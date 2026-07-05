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
    <section className={cn("relative overflow-hidden bg-gradient-to-br transition-all duration-700", slide.bg)} aria-label="Featured products">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 lg:flex-row lg:py-24 lg:px-8">
        {/* Text */}
        <div className="flex-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a373]" />
            {slide.tag}
          </span>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {slide.headline}
          </h1>
          <p className="mt-4 max-w-md text-base text-white/80 leading-relaxed">{slide.sub}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[#d4a373]">{slide.price}</span>
            {slide.originalPrice && (
              <span className="text-lg text-white/50 line-through">{slide.originalPrice}</span>
            )}
            <span className="rounded-full bg-[#d4a373] px-2.5 py-0.5 text-xs font-bold text-[#1b4332]">
              {slide.badge}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={slide.href}>
              <Button variant="secondary" size="lg" className="gap-2">
                {slide.cta} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="white" size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
        {/* Visual card or Emoji */}
        <div className="flex-shrink-0 flex h-64 w-64 items-center justify-center rounded-2xl bg-white p-4 lg:h-80 lg:w-80 shadow-2xl overflow-hidden transition-all duration-500">
          {slide.imageUrl ? (
            <img
              src={slide.imageUrl}
              alt={slide.headline}
              className="h-full w-full object-contain transition-all duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-[120px] lg:text-[160px] select-none">{slide.emoji}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors" aria-label="Previous">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors" aria-label="Next">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
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
