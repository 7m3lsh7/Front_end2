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

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "/api";


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
    role: "Admin" | "Teacher" | "Student";
}

export interface MeResponse {
    userId: number;
    role: "Admin" | "Teacher" | "Student";
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string; // Optional - some APIs only return new access token
}

/**
 * Login and store tokens
 */
async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Invalid username or password");
    }

    const data: LoginResponse = await response.json();

    // Store tokens
    if (data.accessToken) {
        tokenStorage.setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
        tokenStorage.setRefreshToken(data.refreshToken);
    }

    return data;
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

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired, try to refresh
            try {
                await refreshAccessToken();
                // Retry the request with new token
                const newToken = tokenStorage.getAccessToken();
                if (newToken) {
                    const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${newToken}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
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
        throw new Error("Unauthenticated");
    }

    return response.json();
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
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
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ refreshToken }),
            });
            // Don't throw error if logout fails on server
            // We still want to clear local tokens
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
};
