import Link from "next/link";
import { Leaf, FlaskConical, Truck, Award, ArrowRight } from "lucide-react";

const banners = [
  {
    title: "Pure. Natural. Organic.",
    desc: "Every product is lab-tested for purity and certified organic. No compromises.",
    icon: <Leaf className="h-8 w-8" />,
    href: "/products?category=ghee",
    cta: "Shop Ghee",
    bg: "bg-[#1b4332]",
    text: "text-white",
  },
  {
    title: "Ayurvedic Wisdom",
    desc: "Ancient Vedic formulations brought to your modern lifestyle for holistic wellness.",
    icon: <FlaskConical className="h-8 w-8" />,
    href: "/products",
    cta: "Explore",
    bg: "bg-[#d4a373]",
    text: "text-[#1b4332]",
  },
];

const trustBadges = [
  { icon: <Leaf className="h-6 w-6 text-[#1b4332]" />, title: "100% Organic", desc: "FSSAI certified" },
  { icon: <FlaskConical className="h-6 w-6 text-[#1b4332]" />, title: "Lab Tested", desc: "Every batch verified" },
  { icon: <Truck className="h-6 w-6 text-[#1b4332]" />, title: "Fast Delivery", desc: "2-5 business days" },
  { icon: <Award className="h-6 w-6 text-[#1b4332]" />, title: "Trusted Brand", desc: "10,000+ happy customers" },
];

export function PromoBanners() {
  return (
    <section className="py-16 dark:bg-gray-950" aria-label="Promotions and trust badges">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-12">
        {/* Promo cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {banners.map((b) => (
            <div
              key={b.title}
              className={`${b.bg} ${b.text} flex flex-col justify-between rounded-2xl p-8 min-h-[200px]`}
            >
              <div>
                <div className="mb-4 opacity-80">{b.icon}</div>
                <h3 className="text-xl font-bold">{b.title}</h3>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">{b.desc}</p>
              </div>
              <Link
                href={b.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-3 transition-all"
              >
                {b.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trustBadges.map((b) => (
            <div
              key={b.title}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30">
                {b.icon}
              </div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{b.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
