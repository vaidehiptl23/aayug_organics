"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export default function AdminRoot() {
  const router = useRouter();
  useEffect(() => {
    const s = getAdminSession();
    router.push(s ? "/admin/dashboard" : "/admin/auth");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#1b4332", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
