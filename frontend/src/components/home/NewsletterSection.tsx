"use client";
import { useState } from "react";
import { Mail, CheckCircle, Star, Users, ShieldCheck } from "lucide-react";
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
      className="relative bg-gradient-to-br from-[#0c231a] via-[#1b4332] to-[#0b2217] py-24 overflow-hidden border-t border-emerald-900"
      aria-labelledby="newsletter-heading"
    >
      {/* Floating Animated Organic Leaves & Dust */}
      <div className="absolute inset-0 select-none pointer-events-none opacity-30">
        <div className="absolute top-10 left-12 animate-bounce duration-[4000ms] text-3xl">🌿</div>
        <div className="absolute bottom-16 left-[20%] animate-bounce duration-[6000ms] text-2xl">🍂</div>
        <div className="absolute top-20 right-[15%] animate-bounce duration-[5000ms] text-4xl">🌿</div>
        <div className="absolute bottom-12 right-20 animate-bounce duration-[7000ms] text-xl">🍃</div>
        <div className="absolute top-1/2 left-[80%] animate-pulse text-yellow-400/40 text-lg">✨</div>
        <div className="absolute top-[30%] left-[10%] animate-pulse text-yellow-400/30 text-xl">✨</div>
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
        
        {/* Envelope Badge */}
        <div className="mb-6 inline-flex items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md p-4 border border-white/20 shadow-lg animate-pulse">
          <Mail className="h-8 w-8 text-amber-300" />
        </div>
        
        <h2 id="newsletter-heading" className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Join Our Organic Family 🌿
        </h2>
        <p className="mt-4 text-lg text-emerald-100/75 leading-relaxed max-w-xl mx-auto">
          Get exclusive discounts, seasonal offers, new product launches, and Ayurvedic wellness tips — straight to your inbox.
        </p>

        {submitted ? (
          <div className="mt-8 flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md animate-in zoom-in-95 duration-300 max-w-md mx-auto">
            <CheckCircle className="h-14 w-14 text-amber-300" />
            <p className="text-xl font-bold text-white">You&apos;re subscribed!</p>
            <p className="text-sm text-emerald-100/70">
              Welcome to Aayug Organics. Check your inbox soon for your welcome gift.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-0 max-w-md mx-auto shadow-2xl rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md p-1.5">
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
              className="flex-1 bg-transparent px-5 py-3 text-white placeholder:text-white/40 focus:outline-none text-sm"
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              loading={loading}
              className="rounded-xl shadow-md font-bold text-[#1b4332] bg-amber-400 hover:bg-amber-300 border-none px-6"
            >
              Subscribe
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-white/30 font-medium">
          We respect your privacy. No spam, ever. Unsubscribe anytime.
        </p>

        {/* Dynamic Social Proof Badges */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-white/10 pt-10">
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-white/80 text-xs font-semibold shadow-inner">
            <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
            <span>4.8/5 Customer Rating</span>
          </div>

          <div className="hidden sm:block text-white/20">•</div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-white/80 text-xs font-semibold shadow-inner">
            <Users className="h-4 w-4 text-emerald-400" />
            <span>10,000+ Wellness Subscribers</span>
          </div>

          <div className="hidden sm:block text-white/20">•</div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-white/80 text-xs font-semibold shadow-inner">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <span>50,000+ Orders Handdelivered</span>
          </div>
          
        </div>
      </div>
    </section>
  );
}
