"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { loginDirect } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
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
      setLoading(false);
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
          <p className="mt-1 text-sm text-gray-500 font-medium">Access your Aayug Organics account with Google.</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            For security and convenience, registration and sign-in are powered exclusively by Google.
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200/80 bg-white px-5 py-4 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 active:scale-[0.99] transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#1b4332]" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,15.75,14.73,17,12,17c-3.37,0-6-2.63-6-6s2.63-6,6-6c1.52,0,2.9,0.57,3.96,1.49l2-2C16.21,2.84,14.22,2,12,2C7.03,2,3,6.03,3,11s4.03,9,9,9c4.8,0,8.14-3.38,8.14-8.22A7.1,7.1,0,0,0,21.35,11.1Z" fill="#EA4335" />
                <path d="M12,20c2.78,0,5.1-0.92,6.8-2.5l-2.64-2.05C15.08,16.27,13.66,17,12,17c-3.37,0-6-2.63-6-6c0-0.34,0.03-0.67,0.08-1l-2.69-2.08C2.52,9.08,2,10.49,2,12C2,16.97,6.03,20,12,20Z" fill="#34A853" />
                <path d="M6.08,10c-0.05,0.33-0.08,0.66-0.08,1s0.03,0.67,0.08,1l2.69-2.08c-0.12-.34-0.19-.71-0.19-1.09s0.07-.75,0.19-1.09Z" fill="#FBBC05" />
                <path d="M12,4c2.22,0,4.21,0.84,5.78,2.35l2-2C18.1,2.77,15.3,2,12,2C7.03,2,3,6.03,3,11l2.69,2.08c0.55-3.36,3.46-5.83,6.96-6.08Z" fill="#4285F4" />
              </svg>
            )}
            <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              By signing in, you agree to Aayug Organics&apos; <Link href="/" className="underline hover:text-gray-600">Terms of Service</Link> and <Link href="/" className="underline hover:text-gray-600">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
