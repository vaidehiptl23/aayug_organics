"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDirect } = useAuthStore();
  const [email, setEmail] = useState("xyz@example.com");
  const [password, setPassword] = useState("Customer@123");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      loginDirect(
        {
          id: "google-customer-user",
          firstName: "Google",
          lastName: "Customer",
          email: "customer.aayug@gmail.com",
          phone: "+919876543210",
          joinedDate: new Date().toISOString(),
        },
        "mock-google-access-token",
        "mock-google-refresh-token"
      );
      toast.success("Welcome back! Signed in with Google. 👋");
      router.push("/");
      setGoogleLoading(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfbf7] px-4 dark:bg-gray-950">
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
          
          {/* Social login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200/80 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 active:scale-[0.99] transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50 mb-6"
          >
            {googleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#1b4332]" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,15.75,14.73,17,12,17c-3.37,0-6-2.63-6-6s2.63-6,6-6c1.52,0,2.9,0.57,3.96,1.49l2-2C16.21,2.84,14.22,2,12,2C7.03,2,3,6.03,3,11s4.03,9,9,9c4.8,0,8.14-3.38,8.14-8.22A7.1,7.1,0,0,0,21.35,11.1Z" fill="#EA4335" />
                <path d="M12,20c2.78,0,5.1-0.92,6.8-2.5l-2.64-2.05C15.08,16.27,13.66,17,12,17c-3.37,0-6-2.63-6-6c0-0.34,0.03-0.67,0.08-1l-2.69-2.08C2.52,9.08,2,10.49,2,12C2,16.97,6.03,20,12,20Z" fill="#34A853" />
                <path d="M6.08,10c-0.05,0.33-0.08,0.66-0.08,1s0.03,0.67,0.08,1l2.69-2.08c-0.12-.34-0.19-.71-0.19-1.09s0.07-.75,0.19-1.09Z" fill="#FBBC05" />
                <path d="M12,4c2.22,0,4.21,0.84,5.78,2.35l2-2C18.1,2.77,15.3,2,12,2C7.03,2,3,6.03,3,11l2.69,2.08c0.55-3.36,3.46-5.83,6.96-6.08Z" fill="#4285F4" />
              </svg>
            )}
            <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-150 dark:border-gray-700" />
            </div>
            <div className="relative text-center">
              <span className="bg-white px-4 text-xs font-semibold text-gray-400 dark:bg-gray-900 uppercase tracking-wider">or sign in with email</span>
            </div>
          </div>

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
