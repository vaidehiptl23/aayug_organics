"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, setAdminSession } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("admin@aayugorganics.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = await adminLogin(email, password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#1b4332",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "system-ui,-apple-system,sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 30 }}>🌿</div>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Aayug Organics</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "6px 0 0" }}>Admin Panel · Restricted Access</p>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 24px" }}>🔐 Sign in to Admin</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", fontSize: 14, border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                onFocus={(e) => (e.target.style.borderColor = "#1b4332")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  style={{ width: "100%", padding: "10px 44px 10px 14px", fontSize: 14, border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1b4332")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>⚠️ {error}</div>}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: 12, background: "#1b4332", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> : "🔐 Sign In to Admin"}
            </button>
          </form>
          <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 16 }}>🔒 Restricted to administrators only</p>
          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginTop: 12 }}>
            <p style={{ fontSize: 12, color: "#16a34a", margin: 0 }}><strong>Demo:</strong> admin@aayugorganics.com / Admin@123</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
