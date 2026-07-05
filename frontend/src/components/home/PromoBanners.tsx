import Link from "next/link";
import { Leaf, FlaskConical, Truck, Award, ArrowRight } from "lucide-react";

export function PromoBanners() {
  const banners = [
    {
      title: "Pure. Natural. Organic.",
      desc: "Every product is lab-tested for purity and certified organic. No compromises.",
      icon: <Leaf className="h-10 w-10 text-emerald-300" />,
      href: "/products?category=ghee",
      cta: "Shop Ghee",
      bgClass: "bg-gradient-to-br from-emerald-950 via-[#1b4332] to-[#0f2d20]",
      textClass: "text-white",
      leafColor: "text-emerald-500/10"
    },
    {
      title: "Ayurvedic Wisdom",
      desc: "Ancient Vedic formulations brought to your modern lifestyle for holistic wellness.",
      icon: <FlaskConical className="h-10 w-10 text-amber-300" />,
      href: "/products",
      cta: "Explore Store",
      bgClass: "bg-gradient-to-br from-[#8c6239] via-[#d4a373] to-[#a0744e]",
      textClass: "text-emerald-950",
      leafColor: "text-white/10"
    },
  ];

  const trustBadges = [
    { icon: <Leaf className="h-6 w-6 text-[#1b4332] dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, title: "100% Organic", desc: "FSSAI certified" },
    { icon: <FlaskConical className="h-6 w-6 text-[#1b4332] dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, title: "Lab Tested", desc: "Every batch verified" },
    { icon: <Truck className="h-6 w-6 text-[#1b4332] dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, title: "Fast Delivery", desc: "2-5 business days" },
    { icon: <Award className="h-6 w-6 text-[#1b4332] dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />, title: "Trusted Brand", desc: "10,000+ happy customers" },
  ];

  return (
    <section className="py-20 dark:bg-gray-950 relative overflow-hidden" aria-label="Promotions and trust badges">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-80 w-80 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-20">
        
        {/* Promo cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {banners.map((b) => (
            <div
              key={b.title}
              className={`${b.bgClass} ${b.textClass} group relative flex flex-col justify-between rounded-3xl p-10 min-h-[260px] shadow-lg border border-white/10 hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              {/* Background ambient light */}
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              {/* Giant background floating leaf decoration */}
              <div className={`absolute right-6 top-6 text-8xl font-serif select-none pointer-events-none transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 ${b.leafColor}`}>
                🍃
              </div>

              <div>
                <div className="mb-6 inline-flex p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                  {b.icon}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{b.title}</h3>
                <p className="mt-3 text-base opacity-85 leading-relaxed max-w-sm">{b.desc}</p>
              </div>
              
              <div className="mt-8">
                <Link
                  href={b.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white/10 hover:bg-white hover:text-emerald-950 backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:shadow-md"
                >
                  <span>{b.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustBadges.map((b) => (
            <div
              key={b.title}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-150/40 bg-white/50 p-6 text-center shadow-sm backdrop-blur-sm hover:bg-white hover:shadow-xl hover:border-emerald-500/20 hover:-translate-y-1.5 transition-all duration-300 dark:border-gray-800/40 dark:bg-gray-900/50 dark:hover:bg-gray-900"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-inner group-hover:bg-[#1b4332] group-hover:text-white transition-all duration-300">
                {b.icon}
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white text-base tracking-tight">{b.title}</p>
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
