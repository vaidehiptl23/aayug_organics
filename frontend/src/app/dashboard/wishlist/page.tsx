"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { toast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";

export default function WishlistDashboardPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const moveToCart = (productId: string) => {
    const item = items.find((p) => p.id === productId);
    if (item) {
      addToCart(item);
      removeItem(productId);
      toast.success(`${item.name} moved to cart`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Heart className="h-6 w-6 text-[#1b4332]" /> My Wishlist
        <span className="text-base font-normal text-gray-400">({items.length})</span>
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-700">
          <Heart className="h-12 w-12 text-gray-300" />
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link href="/products"><Button variant="outline">Browse Products</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((product) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <Link href={`/products/${product.slug}`}>
                <Image src={product.images[0]?.url ?? "/placeholder.jpg"} alt={product.name} width={80} height={80} className="h-20 w-20 rounded-xl object-cover" unoptimized />
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <div>
                  <p className="text-xs font-medium uppercase text-[#1b4332] dark:text-green-400">{product.category}</p>
                  <Link href={`/products/${product.slug}`}>
                    <p className="font-semibold text-sm text-gray-800 hover:text-[#1b4332] dark:text-white line-clamp-2">{product.name}</p>
                  </Link>
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" className="mt-1" />
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-[#1b4332] dark:text-green-400">{formatPrice(product.price)}</span>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => moveToCart(product.id)} className="gap-1 text-xs px-2.5">
                      <ShoppingCart className="h-3 w-3" /> Move to Cart
                    </Button>
                    <button onClick={() => { removeItem(product.id); toast.info("Removed from wishlist"); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
