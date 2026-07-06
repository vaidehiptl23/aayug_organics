export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const sessionStr = typeof window !== "undefined" ? sessionStorage.getItem("admin_session") : null;
  const session = sessionStr ? JSON.parse(sessionStr) : null;
  const token = session?.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  return res.json();
}
