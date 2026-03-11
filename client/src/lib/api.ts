const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; networkError?: boolean }> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    return res.json();
  } catch {
    return {
      success: false,
      error: "Unable to connect to server. Please check that the API is running.",
      networkError: true,
    };
  }
}
