"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore, DEMO_USER } from "@/store/auth.store";
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
      // Call real backend
      await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
        phone: form.phone || undefined,
      });
      toast.success("Account created! 🌿");
      // Auto login
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfbf7] px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-md">
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
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join thousands of organic food lovers.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="accent-[#1b4332] mt-0.5" />
              <span className="text-xs text-gray-500">
                I agree to the{" "}
                <Link href="/" className="text-[#1b4332] underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/" className="text-[#1b4332] underline">Privacy Policy</Link>
              </span>
            </label>
            <Button type="submit" fullWidth size="lg" loading={loading} className="gap-2">
              <UserPlus className="h-4 w-4" /> Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#1b4332] hover:underline dark:text-green-400">
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
