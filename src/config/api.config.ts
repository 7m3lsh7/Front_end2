export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const secureFetch = async (
  url: string,
  options?: RequestInit
) => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

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
