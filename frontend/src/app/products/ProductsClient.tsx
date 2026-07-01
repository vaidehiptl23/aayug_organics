"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, LayoutGrid, List } from "lucide-react";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const PRICE_RANGES = [
  { label: "Under ₹300", min: 0, max: 300 },
  { label: "₹300 – ₹500", min: 300, max: 500 },
  { label: "₹500 – ₹800", min: 500, max: 800 },
  { label: "Above ₹800", min: 800, max: Infinity },
];

const PER_PAGE = 8;

export function ProductsClient() {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Build API params
  const apiParams = useMemo(() => {
    const p: Record<string, string> = { page: String(page), limit: String(PER_PAGE), sort };
    if (search)           p.search   = search;
    if (selectedCategory) p.category = selectedCategory;
    if (inStockOnly)      p.inStock  = "true";
    if (minRating > 0)    p.minRating = String(minRating);
    if (selectedPriceRange !== null) {
      p.minPrice = String(PRICE_RANGES[selectedPriceRange].min);
      if (PRICE_RANGES[selectedPriceRange].max !== Infinity)
        p.maxPrice = String(PRICE_RANGES[selectedPriceRange].max);
    }
    return p;
  }, [page, sort, search, selectedCategory, inStockOnly, minRating, selectedPriceRange]);

  const { products: filtered, total, loading } = useProducts(apiParams);
  const totalPages = Math.ceil(total / PER_PAGE);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get("category") ?? "";
    const q   = searchParams.get("search") ?? "";
    setSelectedCategory(cat);
    setSearch(q);
    setPage(1);
  }, [searchParams]);

  const activeFilterCount = [selectedCategory, selectedPriceRange !== null, minRating > 0, inStockOnly].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory(""); setSelectedPriceRange(null);
    setMinRating(0); setInStockOnly(false); setSearch(""); setPage(1);
  };

  const FilterPanel = () => (
    <aside className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">Category</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => { setSelectedCategory(""); setPage(1); }}
              className="accent-[#1b4332]"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.slug}
                onChange={() => { setSelectedCategory(cat.slug); setPage(1); }}
                className="accent-[#1b4332]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{cat.emoji} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">Price Range</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={selectedPriceRange === null}
              onChange={() => { setSelectedPriceRange(null); setPage(1); }}
              className="accent-[#1b4332]"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">Any Price</span>
          </label>
          {PRICE_RANGES.map((r, i) => (
            <label key={r.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selectedPriceRange === i}
                onChange={() => { setSelectedPriceRange(i); setPage(1); }}
                className="accent-[#1b4332]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">Min. Rating</h3>
        <div className="flex flex-col gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => { setMinRating(r); setPage(1); }}
                className="accent-[#1b4332]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {r === 0 ? "Any Rating" : `${r}★ & above`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
            className="accent-[#1b4332]"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">In Stock Only</span>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full gap-2">
          <X className="h-4 w-4" /> Clear Filters ({activeFilterCount})
        </Button>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-gray-950">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
          {/* Search */}
          <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop filters */}
          <div className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-5 font-bold text-gray-800 dark:text-white">Filters</h2>
              <FilterPanel />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersOpen(true)}
                  className="gap-2 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b4332] text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {/* View toggle */}
                <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setView("grid")}
                    className={cn("p-2 transition-colors", view === "grid" ? "bg-[#1b4332] text-white" : "bg-white text-gray-400 hover:text-gray-600 dark:bg-gray-800")}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn("p-2 transition-colors", view === "list" ? "bg-[#1b4332] text-white" : "bg-white text-gray-400 hover:text-gray-600 dark:bg-gray-800")}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Select
                options={SORT_OPTIONS}
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-48"
              />
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCategory && (
                  <span className="flex items-center gap-1 rounded-full bg-[#1b4332]/10 px-3 py-1 text-xs font-medium text-[#1b4332] dark:bg-green-900/30 dark:text-green-400">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedPriceRange !== null && (
                  <span className="flex items-center gap-1 rounded-full bg-[#1b4332]/10 px-3 py-1 text-xs font-medium text-[#1b4332] dark:bg-green-900/30 dark:text-green-400">
                    {PRICE_RANGES[selectedPriceRange].label}
                    <button onClick={() => setSelectedPriceRange(null)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-[#1b4332]/10 px-3 py-1 text-xs font-medium text-[#1b4332] dark:bg-green-900/30 dark:text-green-400">
                    {minRating}★+
                    <button onClick={() => setMinRating(0)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="flex items-center gap-1 rounded-full bg-[#1b4332]/10 px-3 py-1 text-xs font-medium text-[#1b4332] dark:bg-green-900/30 dark:text-green-400">
                    In Stock
                    <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <span className="text-6xl">🔍</span>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-white">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term.</p>
                <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
              </div>
            ) : (
              <div className={cn(
                "gap-5",
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col"
              )}>
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      p === page
                        ? "bg-[#1b4332] text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    )}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 dark:text-white">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <FilterPanel />
            <Button fullWidth className="mt-6" onClick={() => setFiltersOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
