"use client";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";

const footerLinks = {
  shop: [
    { href: "/products?category=ghee", label: "Ghee" },
    { href: "/products?category=honey", label: "Honey" },
    { href: "/products?category=oils", label: "Oils" },
    { href: "/products?category=spices", label: "Spices" },
    { href: "/products", label: "All Products" },
  ],
  support: [
    { href: "/", label: "FAQs" },
    { href: "/", label: "Shipping Policy" },
    { href: "/", label: "Return & Refund" },
    { href: "/", label: "Track Order" },
    { href: "/", label: "Contact Us" },
  ],
  company: [
    { href: "/", label: "About Us" },
    { href: "/", label: "Blog" },
    { href: "/", label: "Sustainability" },
    { href: "/", label: "Privacy Policy" },
    { href: "/", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1b4332] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center lg:px-8">
          <div>
            <h3 className="text-2xl font-bold">Join the Organic Movement 🌿</h3>
            <p className="mt-1 text-white/70">
              Get exclusive offers, new product updates, and Ayurvedic wellness tips.
            </p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-[#d4a373] focus:outline-none"
              aria-label="Email for newsletter"
            />
            <Button variant="secondary" type="submit">Subscribe</Button>
          </form>
          <p className="text-xs text-white/50">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold">Aayug Organics</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Bringing you 100% pure, natural, and organic products — from farms to your family.
            Rooted in Ayurvedic wisdom, tested for modern life.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-white/70">
            <a href="mailto:contact@aayugorganics.com" className="flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" /> contact@aayugorganics.com
            </a>
            <a href="tel:+919173631159" className="flex items-center gap-2 hover:text-white">
              <Phone className="h-4 w-4" /> +91 91736 31159
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Ahmedabad, Gujarat, India
            </span>
          </div>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/aayugorganics", label: "Facebook" },
              { Icon: Instagram, href: "https://www.instagram.com/aayugorganics", label: "Instagram" },
              { Icon: Youtube, href: "#", label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-[#d4a373] hover:text-[#1b4332]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="mb-4 font-semibold text-[#d4a373]">Shop</h4>
          <ul className="flex flex-col gap-2">
            {footerLinks.shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-4 font-semibold text-[#d4a373]">Support</h4>
          <ul className="flex flex-col gap-2">
            {footerLinks.support.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-4 font-semibold text-[#d4a373]">Company</h4>
          <ul className="flex flex-col gap-2">
            {footerLinks.company.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/50 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Aayug Organics. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {["UPI", "VISA", "Mastercard", "RuPay", "COD"].map((m) => (
              <span
                key={m}
                className="rounded border border-white/20 px-2 py-0.5 text-[10px] font-medium text-white/60"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
