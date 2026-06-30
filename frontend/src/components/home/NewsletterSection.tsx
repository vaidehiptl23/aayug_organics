"use client";
import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate API
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section
      className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/20 p-3">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h2 id="newsletter-heading" className="text-3xl font-bold text-white">
          Stay in the Loop 🌿
        </h2>
        <p className="mt-3 text-white/70 leading-relaxed">
          Get exclusive discounts, seasonal offers, new product launches, and Ayurvedic wellness tips — straight to your inbox.
        </p>

        {submitted ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <CheckCircle className="h-12 w-12 text-[#d4a373]" />
            <p className="text-lg font-semibold text-white">You&apos;re subscribed!</p>
            <p className="text-sm text-white/70">
              Welcome to the Aayug Organics family. Check your inbox for a welcome gift.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/50 focus:border-[#d4a373] focus:outline-none sm:rounded-r-none"
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              loading={loading}
              className="sm:rounded-l-none"
            >
              Subscribe
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-white/40">
          We respect your privacy. No spam, ever. Unsubscribe anytime.
        </p>

        {/* Social proof */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
          <span>⭐ 4.8/5 Rating</span>
          <span>•</span>
          <span>👥 10,000+ subscribers</span>
          <span>•</span>
          <span>📦 50,000+ orders delivered</span>
        </div>
      </div>
    </section>
  );
}
