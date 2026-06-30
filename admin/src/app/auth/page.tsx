"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { adminLogin, setAdminSession } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("admin@aayugorganics.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (adminLogin(email, password)) {
      setAdminSession(email);
      router.push("/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1b4332] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Aayug Organics</h1>
          <p className="text-white/60 text-sm mt-1">Admin Panel — Restricted Access</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-[#1b4332]" />
            <h2 className="font-bold text-gray-800">Sign in to Admin</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20"
                  placeholder="admin@aayugorganics.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20"
                  placeholder="Enter admin password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1b4332] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2d6a4f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ShieldCheck className="h-4 w-4" /> Sign In to Admin</>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            🔒 This page is restricted to administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
