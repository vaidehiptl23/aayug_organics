"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { featuredProducts } from "@/data/products";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  showLink?: boolean;
}

export function FeaturedProducts({
  title = "Trending Now",
  subtitle = "Our most-loved organic products, handpicked for you",
  showLink = true,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
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
        
        const featuredSlugs = ["premium-himalayan-crystal-salt", "raw-forest-honey", "pure-hing-asafoetida", "a2-gir-cow-ghee"];
        const featured = mapped.filter((p: any) => featuredSlugs.includes(p.slug));
        setProducts(featured.length > 0 ? featured : mapped.slice(0, 4));
      } catch (err) {
        console.error("Failed to load featured products, falling back to static products", err);
        setProducts(featuredProducts);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-16 dark:bg-gray-950">
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
    <section className="py-16 dark:bg-gray-950" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1b4332] dark:text-green-400">
              Popular
            </p>
            <h2 id="featured-heading" className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
          {showLink && (
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-[#1b4332] hover:underline dark:text-green-400 sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
