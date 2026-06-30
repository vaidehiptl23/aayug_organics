import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Products – Shop All Organic Products" };

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
