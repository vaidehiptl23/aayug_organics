"use client";

const ADMIN_EMAIL    = "admin@aayugorganics.com";
const ADMIN_PASSWORD = "Admin@123";

export function adminLogin(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function getAdminSession(): { email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem("admin_session");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function setAdminSession(email: string) {
  sessionStorage.setItem("admin_session", JSON.stringify({ email }));
}

export function clearAdminSession() {
  sessionStorage.removeItem("admin_session");
}
