"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { products as staticProducts } from "@/data/products"; // fallback

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export interface UseProductsResult {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useProducts(params?: Record<string, string>): UseProductsResult {
  const [data, setData]       = useState<Product[]>(staticProducts);
  const [total, setTotal]     = useState(staticProducts.length);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = params ? "?" + new URLSearchParams(params).toString() : "";
        const res = await fetch(`${API}/products${qs}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        // Map backend product shape to frontend Product type
        const mapped: Product[] = (json.data ?? []).map((p: BackendProduct) => mapProduct(p));
        setData(mapped.length > 0 ? mapped : staticProducts);
        setTotal(json.meta?.total ?? mapped.length);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        // Silently fall back to static data
        setData(staticProducts);
        setTotal(staticProducts.length);
        setError(null); // no visible error — static data works fine
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { products: data, total, loading, error };
}

// ── Types ─────────────────────────────────────────────────────
interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sku: string;
  brand?: string;
  category?: { name: string; slug: string };
  price: string | number;
  discountPrice?: string | number | null;
  stockQuantity?: number;
  status?: string;
  isFeatured?: boolean;
  badge?: string | null;
  weight?: string | number | null;
  weightUnit?: string | null;
  avgRating?: string | number;
  totalReviews?: number;
  images?: { id: string; url: string; altText?: string }[];
}

function mapProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    category: p.category?.name ?? "",
    categorySlug: p.category?.slug ?? "",
    brand: p.brand ?? "Aayug Organics",
    price: Number(p.price),
    originalPrice: p.discountPrice ? undefined : undefined,
    images: (p.images ?? []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.altText ?? p.name,
    })),
    badge: p.badge ?? undefined,
    rating: Number(p.avgRating ?? 0),
    reviewCount: p.totalReviews ?? 0,
    inStock: (p.stockQuantity ?? 0) > 0,
    stockCount: p.stockQuantity ?? 0,
    weight: p.weight ? `${p.weight}${p.weightUnit ?? "g"}` : undefined,
    sku: p.sku,
    tags: [],
    isFeatured: p.isFeatured,
  };
}
