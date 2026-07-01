"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { toast } from "@/components/ui/Toast";
import { formatPrice, calcDiscountPct, cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const badgeVariant: Record<string, "accent" | "success" | "warning" | "danger"> = {
  Bestseller: "accent",
  Organic: "success",
  New: "warning",
};

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
    toast.info(
      inWishlist
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  const discountPct =
    product.originalPrice
      ? calcDiscountPct(product.originalPrice, product.price)
      : 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-gray-100 bg-white transition-all duration-300",
        "hover:border-[#1b4332]/20 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-50 dark:bg-gray-700">
          <Image
            src={product.images[0]?.url ?? "/placeholder.jpg"}
            alt={product.images[0]?.alt ?? product.name}
            width={400}
            height={300}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.badge && (
              <Badge variant={badgeVariant[product.badge] ?? "default"}>
                {product.badge}
              </Badge>
            )}
            {discountPct > 0 && (
              <Badge variant="danger">{discountPct}% OFF</Badge>
            )}
            {!product.inStock && (
              <Badge variant="default">Out of Stock</Badge>
            )}
          </div>
          {/* Quick actions */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleWishlist}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors",
                inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-gray-400 hover:text-[#1b4332] transition-colors"
              aria-label="Quick view"
              onClick={(e) => { e.preventDefault(); window.location.href = `/products/${product.slug}`; }}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5 rounded-t-2xl" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#1b4332] dark:text-green-400">
            {product.category}
          </p>
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800 dark:text-white leading-snug">
            {product.name}
          </h3>

          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="sm"
            className="mb-3"
          />

          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#1b4332] dark:text-green-400">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.weight && (
              <span className="text-xs text-gray-400">{product.weight}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-4 pb-4">
        <Button
          fullWidth
          size="sm"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          variant={product.inStock ? "primary" : "ghost"}
          className="gap-1.5"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </article>
  );
}
