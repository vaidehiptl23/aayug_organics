"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    tag: "Bestseller",
    headline: "Pure A2 Gir Cow Ghee",
    sub: "Made with traditional Vedic Bilona method. 100% natural, no preservatives.",
    price: "₹699",
    originalPrice: "₹849",
    cta: "Shop Ghee",
    href: "/products?category=ghee",
    bg: "from-[#1b4332] to-[#2d6a4f]",
    emoji: "🥛",
    badge: "18% OFF",
  },
  {
    id: 2,
    tag: "Raw & Unfiltered",
    headline: "Wild Forest Honey",
    sub: "Straight from rock-hive bees in pristine forests. Rich in antioxidants.",
    price: "₹599",
    originalPrice: null,
    cta: "Shop Honey",
    href: "/products?category=honey",
    bg: "from-[#92400e] to-[#b45309]",
    emoji: "🍯",
    badge: "Bestseller",
  },
  {
    id: 3,
    tag: "Cold-Pressed",
    headline: "Virgin Coconut Oil",
    sub: "Freshly pressed, unrefined and full of natural MCTs and lauric acid.",
    price: "₹499",
    originalPrice: "₹549",
    cta: "Shop Oils",
    href: "/products?category=oils",
    bg: "from-[#14532d] to-[#166534]",
    emoji: "🫒",
    badge: "New",
  },
  {
    id: 4,
    tag: "High Curcumin",
    headline: "Lakadong Turmeric",
    sub: "7–12% curcumin content — the world's most potent turmeric variety from Meghalaya.",
    price: "₹349",
    originalPrice: "₹399",
    cta: "Shop Spices",
    href: "/products?category=spices",
    bg: "from-[#78350f] to-[#92400e]",
    emoji: "🌿",
    badge: "Organic",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);

  const prev = () => {
    setIsAuto(false);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };
  const next = () => {
    setIsAuto(false);
    setCurrent((c) => (c + 1) % slides.length);
  };

  useEffect(() => {
    if (!isAuto) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [isAuto]);

  const slide = slides[current];

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        slide.bg,
        "transition-all duration-700"
      )}
      aria-label="Featured promotions"
    >
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
          <p className="mt-4 max-w-md text-base text-white/80 leading-relaxed">
            {slide.sub}
          </p>
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
              <Button variant="white" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Emoji visual */}
        <div className="flex-shrink-0 flex h-64 w-64 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm lg:h-80 lg:w-80">
          <span className="text-[120px] lg:text-[160px] select-none">{slide.emoji}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setIsAuto(false); }}
            className={cn(
              "h-2 rounded-full transition-all",
              i === current ? "w-6 bg-[#d4a373]" : "w-2 bg-white/40"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
