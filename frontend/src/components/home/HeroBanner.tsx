"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    tag: "84+ Minerals",
    headline: "Premium Himalayan Crystal Salt",
    sub: "Pure, unrefined pink salt harvested from ancient Himalayan mines. Healthier than regular table salt.",
    price: "₹199",
    originalPrice: "₹249",
    cta: "Shop Salt",
    href: "/products/premium-himalayan-crystal-salt",
    bg: "from-[#c2185b] to-[#ad1457]",
    emoji: "🧂",
    badge: "20% OFF",
  },
  {
    id: 2,
    tag: "Raw & Unfiltered",
    headline: "Pure Forest Honey",
    sub: "Straight from wild forest hives. Unheated, unfiltered — all natural enzymes and antioxidants intact.",
    price: "₹549",
    originalPrice: "₹649",
    cta: "Shop Honey",
    href: "/products/raw-forest-honey",
    bg: "from-[#92400e] to-[#b45309]",
    emoji: "🍯",
    badge: "Organic",
  },
  {
    id: 3,
    tag: "Pure Resin · No Fillers",
    headline: "Authentic Hing (Asafoetida)",
    sub: "Sourced from Afghanistan. Pure compounded Hing with no starch or additives. Just a pinch transforms any dish.",
    price: "₹299",
    originalPrice: "₹349",
    cta: "Shop Hing",
    href: "/products/pure-hing-asafoetida",
    bg: "from-[#78350f] to-[#92400e]",
    emoji: "🌿",
    badge: "14% OFF",
  },
  {
    id: 4,
    tag: "Vedic Bilona Method",
    headline: "A2 Gir Cow Ghee",
    sub: "Hand-churned from A2 milk of indigenous Gir cows. Rich in vitamins A, D, E, K and Omega-3 fatty acids.",
    price: "₹899",
    originalPrice: "₹1099",
    cta: "Shop Ghee",
    href: "/products/a2-gir-cow-ghee",
    bg: "from-[#1b4332] to-[#2d6a4f]",
    emoji: "🥛",
    badge: "Bestseller",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const [dynamicSlides, setDynamicSlides] = useState<any[]>([]);

  const activeSlides = dynamicSlides.length > 0 ? dynamicSlides : slides;

  const prev = () => { setAuto(false); setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length); };
  const next = () => { setAuto(false); setCurrent((c) => (c + 1) % activeSlides.length); };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const apiProducts = json.data ?? [];
        
        const updated = slides.map(slide => {
          const slug = slide.href.split("/").pop();
          const match = apiProducts.find((p: any) => p.slug === slug);
          if (match) {
            const primaryImg = match.images?.find((img: any) => img.isPrimary)?.url || match.images?.[0]?.url;
            return {
              ...slide,
              price: `₹${match.price}`,
              imageUrl: primaryImg || null
            };
          }
          return slide;
        });
        setDynamicSlides(updated);
      } catch (err) {
        console.error("Error loading dynamic slides", err);
        setDynamicSlides(slides);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % activeSlides.length), 5000);
    return () => clearInterval(t);
  }, [auto, activeSlides.length]);

  const slide = activeSlides[current] || slides[0];

  return (
    <section className={cn("relative overflow-hidden bg-gradient-to-br transition-all duration-700 py-4", slide.bg)} aria-label="Featured products">
      {/* Background Blurry Light Blobs */}
      <div className="absolute top-12 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse pointer-events-none select-none" />
      <div className="absolute bottom-12 right-1/4 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl animate-pulse pointer-events-none select-none" style={{ animationDuration: '8s' }} />

      {/* Floating Organic Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute top-1/4 left-10 text-2xl opacity-20 animate-bounce" style={{ animationDuration: '6s' }}>🍃</span>
        <span className="absolute bottom-1/3 right-12 text-3xl opacity-20 animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}>🌿</span>
        <span className="absolute top-12 right-1/4 text-xl opacity-25 animate-pulse" style={{ animationDuration: '4s' }}>✨</span>
        <span className="absolute bottom-16 left-1/3 text-2xl opacity-15 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}>🍂</span>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:py-24 lg:px-8 relative z-10">
        {/* Text */}
        <div className="flex-1 text-white text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a373] animate-ping" />
            {slide.tag}
          </span>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl tracking-tight">
            {slide.headline}
          </h1>
          <p className="mt-4 mx-auto lg:mx-0 max-w-md text-base text-white/80 leading-relaxed">{slide.sub}</p>
          <div className="mt-6 flex items-baseline justify-center lg:justify-start gap-3">
            <span className="text-4xl font-extrabold text-[#d4a373] drop-shadow-sm">{slide.price}</span>
            {slide.originalPrice && (
              <span className="text-lg text-white/50 line-through">{slide.originalPrice}</span>
            )}
            <span className="rounded-full bg-[#d4a373] px-2.5 py-0.5 text-xs font-bold text-[#1b4332]">
              {slide.badge}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <Link href={slide.href}>
              <Button variant="secondary" size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                {slide.cta} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="white" size="lg" className="shadow-md hover:bg-white/10 hover:text-white transition-all duration-300">View All Products</Button>
            </Link>
          </div>
        </div>

        {/* Visual card or Emoji container with glowing rings and parallax badges */}
        <div className="relative group flex-shrink-0 mt-8 lg:mt-0">
          {/* Outer glowing background blob */}
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#d4a373] via-white/30 to-[#d4a373] opacity-50 blur-2xl transition-all duration-700 group-hover:opacity-80 group-hover:scale-105" />
          
          {/* Floating Badge Top-Right */}
          <div className="absolute -top-4 -right-4 z-10 bg-white text-[#1b4332] text-xs font-extrabold px-3.5 py-2 rounded-full shadow-2xl border border-gray-100 flex items-center gap-1.5 transform hover:scale-110 transition-transform cursor-default select-none animate-bounce" style={{ animationDuration: '4s' }}>
            <span>🌿</span> 100% Organic
          </div>

          {/* Floating Badge Bottom-Left */}
          <div className="absolute -bottom-4 -left-4 z-10 bg-[#d4a373] text-[#1b4332] text-xs font-extrabold px-3.5 py-2 rounded-full shadow-2xl border border-white/20 flex items-center gap-1.5 transform hover:scale-110 transition-transform cursor-default select-none animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
            <span>⭐</span> Premium Grade
          </div>

          {/* Main Card Wrapper */}
          <div className="relative flex h-72 w-72 lg:h-80 lg:w-80 items-center justify-center rounded-[2.5rem] bg-white p-6 shadow-2xl overflow-hidden transition-all duration-700 border border-white/60 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.headline}
                className="h-full w-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full rounded-full bg-[#f4f1ea] dark:bg-gray-700">
                <span className="text-[100px] lg:text-[120px] select-none transform group-hover:scale-110 transition-transform duration-500">{slide.emoji}</span>
              </div>
            )}
            
            {/* Subtle overlay reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors shadow-md" aria-label="Previous">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors shadow-md" aria-label="Next">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-20">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setAuto(false); }}
            className={cn("h-2 rounded-full transition-all", i === current ? "w-6 bg-[#d4a373]" : "w-2 bg-white/40")}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
