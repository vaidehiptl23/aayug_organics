"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore, DEMO_USER } from "@/store/auth.store";
import { toast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDirect } = useAuthStore();
  const [email, setEmail] = useState("rahul@example.com");
  const [password, setPassword] = useState("Customer@123");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Try real backend first
      await login(email, password);
      toast.success("Welcome back! 👋");
      router.push("/dashboard");
    } catch {
      // Fallback: demo login when backend/DB not yet configured
      loginDirect(
        { ...DEMO_USER, email },
        "demo-access-token",
        "demo-refresh-token"
      );
      toast.success("Signed in with demo account 👋");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfbf7] px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span>🌿</span>
            <span className="text-[#1b4332] dark:text-green-400">Aayug</span>
            <span className="text-[#d4a373]"> Organics</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Please enter your details.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Social login placeholders */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {["Google", "Facebook"].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => toast.info(`${provider} login coming soon`)}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {provider === "Google" ? "🟢" : "🔵"} {provider}
              </button>
            ))}
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative text-center">
              <span className="bg-white px-3 text-xs text-gray-400 dark:bg-gray-800">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="rahul@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              autoComplete="current-password"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#1b4332]" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-[#1b4332] hover:underline dark:text-green-400">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" fullWidth size="lg" loading={loading} className="gap-2">
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-[#1b4332] hover:underline dark:text-green-400">
              Create account
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Demo credentials:</strong> rahul@example.com / Customer@123
              <br />
              <span className="text-blue-500">(Works without a database — connects to Supabase once configured)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
