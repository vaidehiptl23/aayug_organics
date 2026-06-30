import Link from "next/link";
import { categories } from "@/data/products";
import { ArrowRight } from "lucide-react";

export function CategorySection() {
  return (
    <section className="bg-[#f4f1ea] py-16 dark:bg-gray-900" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1b4332] dark:text-green-400">
              Our Range
            </p>
            <h2 id="categories-heading" className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-semibold text-[#1b4332] hover:underline dark:text-green-400 sm:flex"
          >
            All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
            >
              {/* Decorative blob */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f1ea] text-5xl transition-transform duration-300 group-hover:scale-110 dark:bg-gray-700">
                  {cat.emoji}
                </div>
                <h3 className="text-base font-bold text-gray-800 group-hover:text-[#1b4332] dark:text-white dark:group-hover:text-green-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {cat.productCount} products
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1b4332] opacity-0 transition-opacity group-hover:opacity-100 dark:text-green-400">
                  Shop now <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
