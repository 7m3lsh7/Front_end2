/**
 * authService
 * ===========
 * Authentication API abstraction layer.
 *
 * Responsibilities:
 * - Encapsulate all authentication-related HTTP requests
 * - Handle login, logout, and user retrieval
 * - Manage JWT access tokens and refresh tokens
 * - Handle token refresh automatically
 *
 * This layer decouples UI components
 * from low-level API implementation details.
 */

import { tokenStorage } from "@/utils/token-storage";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "/backend-api").replace(/\/+$/, "");


export interface LoginPayload {
    username: string;
    password: string;
}

/**
 * Login response with JWT tokens
 */
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    role: "Admin" | "Teacher" | "Student" | "Staff";
}

export interface MeResponse {
    userId: number;
    role: "Admin" | "Teacher" | "Student" | "Staff";
    username: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string; // Optional - some APIs only return new access token
}

interface JwtPayload {
    [key: string]: unknown;
}

function decodeJwtPayload(token: string): JwtPayload | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
        const decoded = atob(padded);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

function getClaimString(payload: JwtPayload | null, key: string): string | null {
    const value = payload?.[key];
    return typeof value === "string" ? value : null;
}

function parseUserFromToken(accessToken: string): MeResponse | null {
    const payload = decodeJwtPayload(accessToken);
    if (!payload) return null;

    const userIdRaw = getClaimString(
        payload,
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    );
    const username =
        getClaimString(payload, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name") ?? "User";
    const roleRaw =
        getClaimString(payload, "http://schemas.microsoft.com/ws/2008/06/identity/claims/role") ?? "Student";

    const normalizedRole =
        roleRaw === "Student Affairs" || roleRaw === "StudentAffairs" ? "Staff" : roleRaw;

    const role = (normalizedRole === "Admin" ||
        normalizedRole === "Teacher" ||
        normalizedRole === "Student" ||
        normalizedRole === "Staff"
        ? normalizedRole
        : "Student") as MeResponse["role"];
    const userId = Number(userIdRaw ?? "0");

    return {
        userId: Number.isFinite(userId) ? userId : 0,
        role,
        username,
    };
}

/**
 * Login and store tokens
 */
async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Invalid username or password");
    }

    const raw = (await response.json()) as {
        accessToken: string;
        refreshToken?: string;
        role: string;
    };

    // Store tokens
    if (!raw.accessToken || !raw.refreshToken) {
        tokenStorage.clearAll();
        throw new Error("Login response is incomplete. Missing tokens.");
    }

    if (raw.accessToken) {
        tokenStorage.setAccessToken(raw.accessToken);
    }
    if (raw.refreshToken) {
        tokenStorage.setRefreshToken(raw.refreshToken);
    }

    const normalizedRole =
        raw.role === "Student Affairs" || raw.role === "StudentAffairs" ? "Staff" : raw.role;

    return {
        accessToken: raw.accessToken,
        refreshToken: raw.refreshToken,
        role:
            normalizedRole === "Admin" ||
            normalizedRole === "Teacher" ||
            normalizedRole === "Student" ||
            normalizedRole === "Staff"
                ? normalizedRole
                : "Student",
    };
}

/**
 * Get current user information
 * Uses access token from storage
 */
async function getMe(): Promise<MeResponse> {
    const accessToken = tokenStorage.getAccessToken();
    
    if (!accessToken) {
        throw new Error("Unauthenticated");
    }

    const response = await fetch(`${API_BASE_URL}/Auth/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired, try to refresh
            try {
                await refreshAccessToken();
                // Retry the request with new token
                const newToken = tokenStorage.getAccessToken();
                if (newToken) {
                    const retryResponse = await fetch(`${API_BASE_URL}/Auth/me`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${newToken}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (retryResponse.ok) {
                        return retryResponse.json();
                    }
                }
            } catch {
                // Refresh failed, clear tokens
                tokenStorage.clearAll();
            }
        }
        const fallbackUser = parseUserFromToken(accessToken);
        if (fallbackUser) {
            return fallbackUser;
        }
        throw new Error("Unauthenticated");
    }

    const raw = (await response.json()) as {
        userId: number;
        role: string;
        username?: string;
    };

    const normalizedRole =
        raw.role === "Student Affairs" || raw.role === "StudentAffairs" ? "Staff" : raw.role;

    return {
        userId: raw.userId,
        username: raw.username ?? "User",
        role:
            normalizedRole === "Admin" ||
            normalizedRole === "Teacher" ||
            normalizedRole === "Student" ||
            normalizedRole === "Staff"
                ? normalizedRole
                : "Student",
    };
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
        throw new Error("Session expired. Please sign in again.");
    }

    const response = await fetch(`${API_BASE_URL}/Auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        // Refresh failed, clear all tokens
        tokenStorage.clearAll();
        throw new Error("Token refresh failed");
    }

    const data: RefreshTokenResponse = await response.json();

    // Update tokens
    if (data.accessToken) {
        tokenStorage.setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
        tokenStorage.setRefreshToken(data.refreshToken);
    }
}

/**
 * Logout and clear tokens
 */
async function logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    try {
        // Call logout endpoint if refresh token exists
        if (refreshToken) {
            await fetch(`${API_BASE_URL}/Auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });
        }
    } catch {
        // Ignore errors, continue to clear local tokens
    } finally {
        // Always clear local tokens
        tokenStorage.clearAll();
    }
}

export const authService = {
    login,
    getMe,
    logout,
    refreshAccessToken,
    parseUserFromToken,
};
