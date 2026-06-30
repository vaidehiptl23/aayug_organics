import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { bestSellers } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";

export function BestSellers() {
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
          {bestSellers.map((product, i) => (
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
