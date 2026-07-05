"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";
import { authApi, ApiError } from "@/lib/api";
import { toast } from "@/components/ui/Toast";
import { Suspense } from "react";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const { loginDirect } = useAuthStore();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: emailParam, phone: "",
    password: "", confirm: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (emailParam) {
      set("email", emailParam);
    }
  }, [emailParam]);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (!/[A-Z]/.test(form.password)) e.password = "Needs an uppercase letter";
    if (!/\d/.test(form.password)) e.password = "Needs a number";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
        phone: form.phone || undefined,
      });
      toast.success("Account created! 🌿");
      const loginRes = await authApi.login(form.email, form.password);
      loginDirect(
        {
          id: loginRes.data.user.id,
          firstName: loginRes.data.user.firstName,
          lastName: loginRes.data.user.lastName,
          email: loginRes.data.user.email,
          phone: form.phone,
          joinedDate: new Date().toISOString(),
        },
        loginRes.data.accessToken,
        loginRes.data.refreshToken
      );
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ email: "An account with this email already exists" });
      } else {
        const msg = err instanceof ApiError ? err.message : "Registration failed";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
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
      toast.success("Account created successfully with Google! Welcome to Aayug Organics! 🌿");
      router.push("/");
      setGoogleLoading(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfbf7] px-4 py-12 dark:bg-gray-950">
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
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">Join thousands of organic food lovers.</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          
          {/* Social login button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
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
            <span>{googleLoading ? "Creating Account..." : "Continue with Google"}</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-150 dark:border-gray-700" />
            </div>
            <div className="relative text-center">
              <span className="bg-white px-4 text-xs font-semibold text-gray-400 dark:bg-gray-900 uppercase tracking-wider">or sign up with details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name *" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} placeholder="XYZ" leftIcon={<User className="h-4 w-4" />} />
              <Input label="Last Name *" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} placeholder="Customer" />
            </div>
            <Input label="Email Address *" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} placeholder="xyz@example.com" leftIcon={<Mail className="h-4 w-4" />} />
            <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} placeholder="9876543210" leftIcon={<Phone className="h-4 w-4" />} hint="Optional — for order updates" />
            <Input
              label="Password *"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              error={errors.password}
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? "Hide" : "Show"}>
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <Input label="Confirm Password *" type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} placeholder="Re-enter password" leftIcon={<Lock className="h-4 w-4" />} />
            
            <label className="flex items-start gap-2 cursor-pointer pt-1 select-none">
              <input type="checkbox" required className="accent-[#1b4332] mt-0.5" />
              <span className="text-xs text-gray-500">
                I agree to the{" "}
                <Link href="/" className="text-[#1b4332] font-semibold hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/" className="text-[#1b4332] font-semibold hover:underline">Privacy Policy</Link>
              </span>
            </label>
            
            <Button type="submit" fullWidth size="lg" loading={loading} className="gap-2 mt-6">
              <UserPlus className="h-4 w-4" /> Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-[#1b4332] hover:underline dark:text-green-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#fcfbf7] px-4 py-12 dark:bg-gray-950">
        <p className="text-gray-500 text-sm">Loading signup form...</p>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
