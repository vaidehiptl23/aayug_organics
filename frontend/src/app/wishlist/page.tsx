"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const moveToCart = (productId: string) => {
    const item = items.find((p) => p.id === productId);
    if (item) {
      addToCart(item);
      removeItem(productId);
      toast.success(`${item.name} moved to cart`);
    }
  };

  const addAllToCart = () => {
    items.forEach((p) => addToCart(p));
    clearWishlist();
    toast.success("All items moved to cart");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Heart className="h-7 w-7 text-red-500 fill-red-500" /> My Wishlist
            </h1>
            <p className="mt-1 text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
          </div>
          {items.length > 0 && (
            <Button onClick={addAllToCart} variant="outline" className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Add All to Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <div className="rounded-full bg-red-50 p-8"><Heart className="h-16 w-16 text-red-300" /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-700 dark:text-white">Your wishlist is empty</h2>
              <p className="mt-2 text-gray-500">Save your favourite products here and come back to them later.</p>
            </div>
            <Link href="/products"><Button size="lg" className="gap-2">Start Shopping <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <div key={product.id} className="group rounded-2xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="relative">
                  <Link href={`/products/${product.slug}`}>
                    <Image src={product.images[0]?.url ?? "/placeholder.jpg"} alt={product.name} width={400} height={250} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
                  </Link>
                  {product.badge && (
                    <div className="absolute left-3 top-3"><Badge variant="accent">{product.badge}</Badge></div>
                  )}
                  <button
                    onClick={() => { removeItem(product.id); toast.info("Removed from wishlist"); }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase text-[#1b4332] dark:text-green-400">{product.category}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1 font-semibold text-gray-800 hover:text-[#1b4332] dark:text-white line-clamp-2">{product.name}</h3>
                  </Link>
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" className="mt-1" />
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#1b4332] dark:text-green-400">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                  <Button fullWidth size="sm" className="mt-3 gap-2" onClick={() => moveToCart(product.id)} disabled={!product.inStock}>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {product.inStock ? "Move to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
