import { authService } from "@/services/auth.service";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend-api";

interface ExtendedRequestInit extends RequestInit {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

const getAccessToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
const getRefreshToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const getErrorMessage = async (res: Response): Promise<string> => {
  let errorMessage = "API request failed";
  try {
    const errorData = await res.json().catch(() => null) as
      | { message?: string; title?: string; errors?: Record<string, string[]> }
      | null;

    if (typeof errorData?.message === "string" && errorData.message.trim()) {
      errorMessage = errorData.message;
    } else if (typeof errorData?.title === "string" && errorData.title.trim()) {
      errorMessage = errorData.title;
    } else if (errorData?.errors && typeof errorData.errors === "object") {
      const validationMessages = Object.values(errorData.errors)
        .flat()
        .filter(Boolean)
        .join(" | ");
      if (validationMessages) errorMessage = validationMessages;
    }
  } catch {
    // Keep fallback message.
  }
  return `${errorMessage} (HTTP ${res.status})`;
};

export const secureFetch = async (
  url: string,
  options?: ExtendedRequestInit
): Promise<unknown> => {
  try {
    const accessToken = getAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && !options?._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
        throw new Error("Session expired. Please sign in again.");
      }

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(async (newToken) => {
          const retryHeaders: HeadersInit = {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
          };
          if (newToken) retryHeaders["Authorization"] = `Bearer ${newToken}`;

          const retryRes = await fetch(url, {
            ...options,
            _retry: true,
            headers: retryHeaders,
          });
          if (!retryRes.ok) throw new Error(await getErrorMessage(retryRes));
          return retryRes.json();
        });
      }

      isRefreshing = true;
      try {
        await authService.refreshAccessToken();
        const newToken = getAccessToken();
        processQueue(null, newToken);

        const retryHeaders: HeadersInit = {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        };
        if (newToken) retryHeaders["Authorization"] = `Bearer ${newToken}`;

        const retryRes = await fetch(url, {
          ...options,
          _retry: true,
          headers: retryHeaders,
        });
        if (!retryRes.ok) throw new Error(await getErrorMessage(retryRes));
        return retryRes.json();
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
        throw new Error("Session expired. Please sign in again.");
      } finally {
        isRefreshing = false;
      }
    }

    if (!res.ok) throw new Error(await getErrorMessage(res));
    return res.json();
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Network error occurred");
  }
};
