"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Users, Flame, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function StoryPage() {
  return (
    <div className="bg-[#fcfbf7] text-gray-800 dark:bg-gray-950 dark:text-gray-100 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1b4332]/10 to-transparent py-20 lg:py-28">
        {/* Decorative Floating Leaves */}
        <div className="absolute top-10 left-10 text-emerald-800/10 dark:text-emerald-500/5 animate-bounce duration-1000 select-none pointer-events-none">
          🌿
        </div>
        <div className="absolute bottom-10 right-10 text-amber-700/10 dark:text-amber-500/5 animate-pulse select-none pointer-events-none">
          🍁
        </div>

        <div className="container mx-auto px-4 text-center max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#1b4332] dark:bg-emerald-950/30 dark:text-emerald-400">
            <Leaf className="h-3 w-3" /> Our Roots
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            From Soil to Soul: The Journey of <span className="text-[#1b4332] dark:text-emerald-400">Aayug Organics</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            We started with a simple, sacred belief: that food is the ultimate medicine, and purity is the ultimate truth. Discover how we are reviving India&apos;s ancient Vedic food traditions.
          </p>
        </div>
      </section>

      {/* The Genesis Section */}
      <section className="container mx-auto px-4 max-w-6xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1b4332]/20 to-transparent rounded-3xl -rotate-2 scale-102 group-hover:rotate-0 transition duration-300" />
            <Image
              src="/products/ghee/ghee-why.jpeg"
              alt="Ancient Ghee churned with love"
              width={600}
              height={400}
              className="rounded-3xl object-cover shadow-xl border border-gray-150 relative dark:border-gray-800"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">How We Began</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              In an era dominated by hyper-processed food, synthetic preservatives, and shortcut manufacturing, we realized that the food on our plates had lost its life force. Traditional recipes that kept generations healthy were replaced by assembly lines.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>Aayug Organics</strong> was born in the heart of rural Indian farms. We partnered directly with traditional farmers who refused to use chemical fertilizers or artificial growth techniques. By combining their generational farming wisdom with clean lab testing, we set out to make food pure again.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">100% Tested Pure</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Farmer Sourced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Pillars of Vedic Purity */}
      <section className="bg-emerald-950 text-white py-20 mt-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Our Standards of Purity</h2>
            <p className="mt-4 text-emerald-200">We refuse to compromise. Each product is crafted using slow, intentional processes to preserve natural enzymes and nutrition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition duration-300">
              <div className="h-12 w-12 rounded-2xl bg-emerald-800/50 flex items-center justify-center text-emerald-300 mb-6">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Traditional Slow Cooking</h3>
              <p className="text-emerald-100/80 leading-relaxed text-sm">
                No high-pressure steam boilers or express heating. Our products are simmered slowly on mild heat to ensure essential fatty acids and natural aromas remain fully active.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition duration-300">
              <div className="h-12 w-12 rounded-2xl bg-emerald-800/50 flex items-center justify-center text-emerald-300 mb-6">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zero Artificial Additives</h3>
              <p className="text-emerald-100/80 leading-relaxed text-sm">
                No chemical binders, stabilizers, artificial colors, or synthetic fragrances. What you receive is exactly what nature prepared in the soil, raw and unaltered.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition duration-300">
              <div className="h-12 w-12 rounded-2xl bg-[#a0522d]/40 flex items-center justify-center text-[#ffb703] mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vedic Bilona Churning</h3>
              <p className="text-[#ffe5a3] leading-relaxed text-sm">
                For our ghee, we follow the classical Vedic recipe: boiling A2 milk, setting it to curd, and then hand-churning it clockwise and anti-clockwise to produce premium butter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Products Section */}
      <section className="container mx-auto px-4 max-w-6xl mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-bold text-[#1b4332] dark:text-green-400 uppercase tracking-widest">Our Crafts</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">The Story Behind Our Signature Products</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3">From selecting cow breeds to harvesting pure mountain herbs.</p>
        </div>

        <div className="space-y-20">
          {/* Product 1: Ghee */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-[#e9f5ed] rounded-3xl transform rotate-1 scale-102 dark:bg-emerald-950/20" />
              <Image
                src="/products/ghee/ghee-bilona.jpeg"
                alt="Slow process of making Bilona Ghee"
                width={550}
                height={380}
                className="rounded-3xl object-cover shadow-lg relative border border-gray-100 dark:border-gray-800"
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block bg-[#1b4332]/10 text-[#1b4332] font-bold px-3 py-1 rounded-full text-xs dark:bg-emerald-900/40 dark:text-emerald-400">
                Crafted Signature
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">A2 Vedic Bilona Ghee</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Most commercial ghee is produced from cream or butter using industrial centrifuges. This shortcuts the process but strips away the essential micro-nutrients.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We collect fresh, creamy milk from pasture-fed Indigenous cows. The milk is boiled slow, cooled, culture-set overnight to form curd, and then churned using wooden churners in the Brahma Muhurta. The separated butter (Loni) is melted on cow dung fires, producing aromatic, golden Ghee loaded with natural health benefits.
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 font-bold text-[#1b4332] hover:underline dark:text-green-400">
                Explore Our Ghee Collection <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product 2: Hing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:flex-row-reverse">
            <div className="lg:col-span-6 lg:order-2 relative">
              <div className="absolute inset-0 bg-[#f9f5eb] rounded-3xl transform -rotate-1 scale-102 dark:bg-amber-950/10" />
              <Image
                src="/products/hing/hing_4.jpg"
                alt="Hand-selected pure raw Hing resins"
                width={550}
                height={380}
                className="rounded-3xl object-cover shadow-lg relative border border-gray-100 dark:border-gray-800"
              />
            </div>
            <div className="lg:col-span-6 lg:order-1 space-y-6">
              <div className="inline-block bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs dark:bg-amber-950/40 dark:text-amber-400">
                Spice King
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Compounded Yellow & Raw Hing</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Pure Heeng is a natural gum resin extracted from the roots of Ferula plants. Many commercial brands mix it with heavy flour, chalk, or synthetic gums.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our Hing is sourced from cold, mountainous regions where the roots develop concentrated digestive oils. The resin is collected by hand, sun-dried naturally, and custom-compounded in small batches to preserve its intensely warm, therapeutic aroma. Just a tiny pinch is enough to elevate any dish.
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 font-bold text-[#1b4332] hover:underline dark:text-green-400">
                Explore Our Spices <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing and Sustainability Section */}
      <section className="bg-gradient-to-tr from-stone-100 to-[#fcfbf7] dark:from-gray-900 dark:to-gray-950 py-20 mt-24 border-y border-gray-150/40 dark:border-gray-800/40">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Our Promise to You</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            We pledge to never use preservatives, never add cheap fillers, and always support traditional farming families. Thank you for being a part of this mission to nourish families, restore soil health, and keep ancient traditions alive.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="rounded-xl px-8 shadow-md">
                Shop Organic Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
