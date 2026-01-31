/**
 * Token Storage Utility
 * ====================
 * Manages JWT access token and refresh token storage.
 * 
 * Security considerations:
 * - Access token: Stored in memory (sessionStorage) for better security
 * - Refresh token: Can be stored in httpOnly cookie (server-side) or localStorage
 * 
 * This utility provides a centralized way to manage tokens
 * across the application.
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Store access token in sessionStorage
 * SessionStorage is cleared when tab is closed, providing better security
 */
export const tokenStorage = {
    /**
     * Get access token from sessionStorage
     */
    getAccessToken(): string | null {
        if (typeof window === "undefined") return null;
        return sessionStorage.getItem(ACCESS_TOKEN_KEY);
    },

    /**
     * Store access token in sessionStorage
     */
    setAccessToken(token: string): void {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    /**
     * Remove access token from sessionStorage
     */
    removeAccessToken(): void {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    },

    /**
     * Get refresh token from localStorage
     * Note: In production, refresh token should ideally be in httpOnly cookie
     * But for now, we'll use localStorage for simplicity
     */
    getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Store refresh token in localStorage
     */
    setRefreshToken(token: string): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    /**
     * Remove refresh token from localStorage
     */
    removeRefreshToken(): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Clear all tokens (for logout)
     */
    clearAll(): void {
        this.removeAccessToken();
        this.removeRefreshToken();
    },

    /**
     * Check if user has tokens
     */
    hasTokens(): boolean {
        return !!(this.getAccessToken() && this.getRefreshToken());
    },
};
