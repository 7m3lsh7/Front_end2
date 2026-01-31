import { tokenStorage } from "@/utils/token-storage";
import { authService } from "@/services/auth.service";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Extended RequestInit with _retry flag
interface ExtendedRequestInit extends RequestInit {
  _retry?: boolean;
}

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Secure fetch with JWT token support and automatic token refresh
 * 
 * Features:
 * - Automatically adds Authorization header with access token
 * - Handles token refresh on 401 errors
 * - Queues requests during token refresh
 */
export const secureFetch = async (
  url: string,
  options?: ExtendedRequestInit
) => {
  try {
    const accessToken = tokenStorage.getAccessToken();
    
    // Prepare headers with access token
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    // Handle 401 Unauthorized - token expired
    if (res.status === 401 && !options?._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken: string | null) => {
            const retryHeaders: HeadersInit = {
              "Content-Type": "application/json",
              ...(options?.headers || {}),
            };
            if (newToken) {
              retryHeaders["Authorization"] = `Bearer ${newToken}`;
            }
            return fetch(url, {
              ...options,
              credentials: "include",
              headers: retryHeaders,
            });
          })
          .then(async (retryRes) => {
            if (!retryRes.ok) {
              let errorMessage = "API request failed";
              try {
                const errorData = await retryRes.json().catch(() => null);
                errorMessage = errorData?.message || errorMessage;
              } catch {
                // If parsing fails, use default message
              }
              throw new Error(errorMessage);
            }
            return retryRes.json();
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        await authService.refreshAccessToken();
        const newToken = tokenStorage.getAccessToken();
        
        processQueue(null, newToken);
        
        // Retry the original request with new token
        const retryHeaders: HeadersInit = {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        };
        if (newToken) {
          retryHeaders["Authorization"] = `Bearer ${newToken}`;
        }

        const retryRes = await fetch(url, {
          ...options,
          _retry: true,
          credentials: "include",
          headers: retryHeaders,
        });

        if (!retryRes.ok) {
          let errorMessage = "API request failed";
          try {
            const errorData = await retryRes.json().catch(() => null);
            errorMessage = errorData?.message || errorMessage;
          } catch {
            // If parsing fails, use default message
          }
          throw new Error(errorMessage);
        }

        return retryRes.json();
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear tokens and optionally redirect to login
        tokenStorage.clearAll();
        if (typeof window !== "undefined") {
          // Optionally redirect to login page
          // window.location.href = "/login";
        }
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    if (!res.ok) {
      // Try to get error message from response
      let errorMessage = "API request failed";
      try {
        const errorData = await res.json().catch(() => null);
        errorMessage = errorData?.message || errorMessage;
      } catch {
        // If parsing fails, use default message
      }
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    // Re-throw if it's already an Error, otherwise wrap it
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
};
