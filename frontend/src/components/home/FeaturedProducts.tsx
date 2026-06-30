import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";

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
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
