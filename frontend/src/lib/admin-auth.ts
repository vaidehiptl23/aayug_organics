"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export async function adminLogin(email: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return false;
    const body = await res.json();
    if (body.data?.user?.role === "ADMIN") {
      sessionStorage.setItem("admin_session", JSON.stringify({
        email: body.data.user.email,
        token: body.data.accessToken
      }));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getAdminSession(): { email: string } | null {
  if (typeof window === "undefined") return null;
  const s = sessionStorage.getItem("admin_session");
  return s ? JSON.parse(s) : null;
}

export function setAdminSession(email: string) {
  // session storage email is set inside adminLogin method along with token
}

export function clearAdminSession() {
  sessionStorage.removeItem("admin_session");
}
