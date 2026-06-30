"use client";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { formatPrice, cn } from "@/lib/utils";

const COUPONS: Record<string, number> = {
  ORGANIC10: 10,
  WELCOME50: 50,
  SAVE100: 100,
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, discount, shipping, tax, total } =
    useCartStore();

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (!code) return;
    if (COUPONS[code]) {
      const disc = COUPONS[code];
      setAppliedCoupon(code);
      setCouponDiscount(disc);
      setCouponError("");
      toast.success(`Coupon "${code}" applied! ₹${disc} off`);
    } else {
      setCouponError("Invalid coupon code");
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCoupon("");
    setCouponError("");
  };

  const grandTotal = total() - couponDiscount;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-gray-100 p-8 dark:bg-gray-800">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your cart is empty</h1>
          <p className="mt-2 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
        </div>
        <Link href="/products">
          <Button size="lg" className="gap-2">
            <ShoppingBag className="h-5 w-5" /> Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart <span className="text-lg font-normal text-gray-400">({items.length} items)</span>
          </h1>
          <button
            onClick={() => { clearCart(); toast.info("Cart cleared"); }}
            className="text-sm text-red-500 hover:text-red-700 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Image */}
                <Link href={`/products/${item.product.slug}`} className="shrink-0">
                  <Image
                    src={item.product.images[0]?.url ?? "/placeholder.jpg"}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded-xl object-cover"
                    unoptimized
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#1b4332] dark:text-green-400">
                        {item.product.category}
                      </p>
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="font-semibold text-gray-800 hover:text-[#1b4332] dark:text-white line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.product.weight && (
                        <p className="text-xs text-gray-400">{item.product.weight}</p>
                      )}
                    </div>
                    <button
                      onClick={() => { removeItem(item.product.id); toast.info("Item removed"); }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity */}
                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-gray-800 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-[#1b4332] dark:text-green-400">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">{formatPrice(item.product.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-[#1b4332] hover:underline dark:text-green-400 mt-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
                <Tag className="h-4 w-4 text-[#1b4332]" /> Apply Coupon
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3 dark:bg-green-900/20">
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">{appliedCoupon}</p>
                    <p className="text-xs text-green-600">₹{couponDiscount} discount applied</p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                    error={couponError}
                    className="flex-1"
                  />
                  <Button onClick={applyCoupon} variant="outline" size="md">Apply</Button>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400">Try: ORGANIC10 · WELCOME50 · SAVE100</p>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-bold text-gray-800 dark:text-white">Price Summary</h3>
              <div className="space-y-3">
                <Row label="Subtotal" value={formatPrice(subtotal())} />
                {discount() > 0 && (
                  <Row label="Product Discount" value={`−${formatPrice(discount())}`} className="text-green-600" />
                )}
                {couponDiscount > 0 && (
                  <Row label={`Coupon (${appliedCoupon})`} value={`−₹${couponDiscount}`} className="text-green-600" />
                )}
                <Row label="Shipping" value={shipping() === 0 ? "FREE" : formatPrice(shipping())} className={shipping() === 0 ? "text-green-600" : ""} />
                <Row label={`Tax (18% GST)`} value={formatPrice(tax())} />
                {shipping() > 0 && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    Add {formatPrice(999 - (subtotal() - discount()))} more for FREE shipping
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
                  <Row label="Total Amount" value={formatPrice(grandTotal)} bold />
                </div>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" fullWidth className="gap-2">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            {/* Trust */}
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-center text-xs text-gray-500">
                🔒 Secure checkout · 💳 All payment methods · 🚚 Fast delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, className = "", bold = false }: {
  label: string; value: string; className?: string; bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm text-gray-600 dark:text-gray-400", bold && "font-bold text-gray-800 dark:text-white text-base")}>
        {label}
      </span>
      <span className={cn("text-sm font-medium text-gray-800 dark:text-white", className, bold && "font-bold text-[#1b4332] dark:text-green-400 text-lg")}>
        {value}
      </span>
    </div>
  );
}
