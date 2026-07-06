"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Smartphone, KeyRound, User, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/components/ui/Toast";
import { authApi, ApiError } from "@/lib/api";

export default function OtpPage() {
  const router = useRouter();
  const { loginDirect } = useAuthStore();

  // Step 1: Send Phone
  // Step 2: Verify OTP
  // Step 3: Complete profile (only if new user)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // New user registration fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Store tokens from verifyOtp step to use for completeOtpProfile
  const [tempRegPhone, setTempRegPhone] = useState("");

  // Timer logic for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const validatePhone = () => {
    // Basic phone validation (starts with optional +, matches digits, length between 10-15)
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;

    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      toast.success("Verification code sent! 📱");
      setStep(2);
      setResendTimer(60); // 1 minute countdown
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Failed to send code";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyOtp(phone, code);
      const { isNewUser, accessToken, refreshToken, user } = response.data;

      if (isNewUser) {
        setTempRegPhone(phone);
        setStep(3);
      } else {
        if (accessToken && refreshToken && user) {
          await loginDirect(user, accessToken, refreshToken);
          toast.success("Welcome back! 👋");
          router.push("/");
        } else {
          throw new Error("Invalid response keys");
        }
      }
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Invalid code. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toast.error("Please fill in all profile fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.completeOtpProfile({
        phone: tempRegPhone,
        firstName,
        lastName,
        email
      });
      const { accessToken, refreshToken, user } = response.data;
      await loginDirect(user, accessToken, refreshToken);
      toast.success("Registration complete! Welcome to Aayug Organics 🌿");
      router.push("/");
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 && "OTP Authentication"}
            {step === 2 && "Enter Code"}
            {step === 3 && "Complete Profile"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            {step === 1 && "Secure login or registration with your phone number."}
            {step === 2 && `We texted a verification code to +${phone.replace(/\D/g, "")}`}
            {step === 3 && "Just a few more details to set up your free account."}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          
          {/* STEP 1: Phone Entry */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                leftIcon={<Smartphone className="h-4 w-4" />}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={loading} className="gap-2 mt-6">
                <Send className="h-4 w-4" /> Send OTP Code
              </Button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1b4332] hover:underline dark:text-green-400">
                  <ArrowLeft className="h-4 w-4" /> Back to Email Sign In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: Code Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                label="Verification Code"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit code"
                leftIcon={<KeyRound className="h-4 w-4" />}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={loading} className="gap-2 mt-6">
                <CheckCircle2 className="h-4 w-4" /> Verify & Login
              </Button>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit Number
                </button>
                {resendTimer > 0 ? (
                  <span className="text-sm font-medium text-gray-400">
                    Resend code in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm font-bold text-[#1b4332] hover:underline dark:text-green-400"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Dev Simulation Mode Hint */}
              <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 dark:bg-green-950/20 text-left">
                <p className="text-xs text-green-700 dark:text-green-400">
                  <strong>Simulated SMS Note:</strong>
                  <br />
                  Since you are on Render's Free tier, the 6-digit OTP code has been printed to your **Render Backend service logs**. Please check your logs to view and enter the code!
                </p>
              </div>
            </form>
          )}

          {/* STEP 3: Complete Profile */}
          {step === 3 && (
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Rahul"
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  required
                />
              </div>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={loading} className="gap-2 mt-6">
                Register Profile
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
