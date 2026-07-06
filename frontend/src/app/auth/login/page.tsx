"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("xyz@example.com");
  const [password, setPassword] = useState("Customer@123");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

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
      await login(email, password);
      toast.success("Welcome back! 👋");
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setShowRegisterPopup(true);
      } else {
        const msg = err instanceof ApiError ? err.message : "Invalid credentials";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfbf7] px-4 dark:bg-gray-950 relative">
      
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Aayug Organics Logo"
              width={180}
              height={60}
              className="h-14 w-auto object-contain dark:brightness-110"
              priority
            />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Sign In</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">Welcome back! Please enter your details.</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="xyz@example.com"
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
            
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="accent-[#1b4332]" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm font-bold text-[#1b4332] hover:underline dark:text-green-400">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} className="gap-2 mt-6">
              <LogIn className="h-4 w-4" /> Sign In
            </Button>

            <div className="relative my-4 flex items-center justify-center text-xs uppercase font-semibold text-gray-400">
              <span className="absolute inset-x-0 h-px bg-gray-100 dark:bg-gray-800"></span>
              <span className="relative bg-white dark:bg-gray-900 px-3">or</span>
            </div>

            <Link href="/auth/otp" className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition">
              <Smartphone className="h-4 w-4 text-[#1b4332] dark:text-green-400" /> Sign In with Phone OTP
            </Link>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-[#1b4332] hover:underline dark:text-green-400">
              Create account
            </Link>
          </p>

          <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 dark:bg-green-950/20 text-left">
            <p className="text-xs text-green-700 dark:text-green-400">
              <strong>Database credentials:</strong> xyz@example.com / Customer@123
              <br />
              <span className="text-green-600">(Real database user — verified against Aiven PostgreSQL)</span>
            </p>
          </div>
        </div>
      </div>

      {showRegisterPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md scale-in-center transform rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowRegisterPopup(false)} 
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30 text-[#1b4332] dark:text-green-400">
              <UserPlus className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Not Found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The email <strong className="text-[#1b4332] dark:text-green-400">{email}</strong> is not registered with us yet. Join Aayug Organics to start shopping.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link 
                href={`/auth/register?email=${encodeURIComponent(email)}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b4332] py-3 text-sm font-semibold text-white transition hover:bg-[#1b4332]/90 shadow-lg shadow-[#1b4332]/10"
              >
                <UserPlus className="h-4 w-4" /> Create Free Account
              </Link>
              <button 
                onClick={() => setShowRegisterPopup(false)} 
                className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition"
              >
                Try Another Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
