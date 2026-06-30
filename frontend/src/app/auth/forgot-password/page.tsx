"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfbf7] px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span>🌿</span>
            <span className="text-[#1b4332] dark:text-green-400">Aayug Organics</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Check your inbox</h2>
              <p className="mt-2 text-sm text-gray-500">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your spam folder if you don&apos;t see it.
              </p>
              <Link href="/auth/login" className="mt-6 inline-block">
                <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Forgot your password?</h1>
              <p className="mb-6 text-sm text-gray-500">Enter your email and we&apos;ll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  error={error}
                  placeholder="rahul@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                <Button type="submit" fullWidth size="lg" loading={loading}>Send Reset Link</Button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1b4332] dark:hover:text-green-400">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
