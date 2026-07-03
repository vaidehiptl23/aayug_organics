import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    category: p.category?.name ?? "",
    categorySlug: p.category?.slug ?? "",
    brand: p.brand ?? "Aayug Organics",
    price: Number(p.price),
    originalPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    images: (p.images ?? []).map((img: any) => ({
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await productsApi.getBySlug(slug);
    const product = mapProduct(res.data);
    return {
      title: product.name,
      description: product.description.slice(0, 155),
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  try {
    const res = await productsApi.getBySlug(slug);
    if (!res?.data) notFound();
    const product = mapProduct(res.data);
    return <ProductDetailClient product={product} />;
  } catch {
    notFound();
  }
}
