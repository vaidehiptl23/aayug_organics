"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { adminLogin, setAdminSession } from "@/lib/auth";

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
      router.push("/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1b4332",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            background: "white",
            padding: "8px",
            borderRadius: 12,
            display: "inline-block",
            marginBottom: 16
          }}>
            <Image
              src="/logo.jpg"
              alt="Aayug Organics Logo"
              width={160}
              height={50}
              style={{ objectFit: "contain", display: "block" }}
              priority
            />
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "4px 0 0" }}>Admin Panel · Restricted Access</p>
        </div>

        {/* Card */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 24px", display: "flex", alignItems: "center", gap: 8 }}>
            🔐 Sign in to Admin
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@aayugorganics.com"
                style={{
                  width: "100%", padding: "10px 14px", fontSize: 14,
                  border: "1.5px solid #e2e8f0", borderRadius: 10,
                  outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1b4332")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  style={{
                    width: "100%", padding: "10px 44px 10px 14px", fontSize: 14,
                    border: "1.5px solid #e2e8f0", borderRadius: 10,
                    outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1b4332")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, color: "#94a3b8",
                  }}
                >{showPwd ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 10, padding: "10px 14px",
                fontSize: 13, color: "#dc2626",
              }}>⚠️ {error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px", background: "#1b4332",
                color: "white", border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1, marginTop: 4,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit",
              }}
            >
              {loading
                ? <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                : "🔐 Sign In to Admin"
              }
            </button>
          </form>

          <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 16 }}>
            🔒 Restricted to administrators only
          </p>

          {/* Demo hint */}
          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginTop: 12 }}>
            <p style={{ fontSize: 12, color: "#16a34a", margin: 0 }}>
              <strong>Demo:</strong> admin@aayugorganics.com / Admin@123
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
