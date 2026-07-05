"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";

export function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestsellers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/products?limit=8");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        
        const mapped = (json.data ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          category: p.category?.name ?? "General",
          categorySlug: p.category?.slug ?? "",
          brand: p.brand || "Aayug Organics",
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          images: (p.images ?? []).map((img: any) => ({
            id: img.id,
            url: img.url,
            alt: img.altText ?? p.name
          })),
          badge: p.badge || undefined,
          rating: Number(p.avgRating) || 5,
          reviewCount: Number(p.totalReviews) || 0,
          inStock: p.stockQuantity > 0,
          stockCount: p.stockQuantity ?? 0,
          weight: p.weight || undefined,
          sku: p.sku || ""
        }));
        
        const bestsellers = mapped.filter((p: any) => p.badge?.toLowerCase().includes("bestseller") || p.isBestSeller || p.slug === "premium-himalayan-crystal-salt" || p.slug === "a2-gir-cow-ghee" || p.slug === "raw-forest-honey");
        setProducts(bestsellers.length > 0 ? bestsellers.slice(0, 4) : mapped.slice(0, 4));
      } catch (err) {
        console.error("Failed to load best sellers", err);
      } finally {
        setLoading(false);
      }
    };
    loadBestsellers();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#f4f1ea] py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f4f1ea] py-16 dark:bg-gray-900" aria-labelledby="bestsellers-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#d4a373]">
              <TrendingUp className="h-4 w-4" /> Top Selling
            </p>
            <h2 id="bestsellers-heading" className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              Best Sellers
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Trusted by thousands of happy customers
            </p>
          </div>
          <Link
            href="/products?sort=popularity"
            className="hidden items-center gap-1 text-sm font-semibold text-[#1b4332] hover:underline dark:text-green-400 sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <div key={product.id} className="relative">
              {/* Rank badge */}
              <div className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1b4332] text-xs font-bold text-white shadow-lg">
                #{i + 1}
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
