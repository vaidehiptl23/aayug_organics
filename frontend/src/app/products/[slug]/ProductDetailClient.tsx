"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ShoppingCart, Zap, ChevronRight, Truck,
  RotateCcw, ShieldCheck, Minus, Plus, Star,
  ChevronLeft,
} from "lucide-react";
import { Product, Review } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/products/ProductCard";
import { formatPrice, calcDiscountPct, cn } from "@/lib/utils";
import { getRelatedProducts } from "@/data/products";
import { reviewsApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

interface Props { product: Product; }

export function ProductDetailClient({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]           = useState(1);
  const [activeTab, setActiveTab]         = useState<"description" | "reviews" | "shipping">("description");
  const [autoplay, setAutoplay]           = useState(true);

  // Dynamic reviews state
  const [reviews, setReviews]             = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newRating, setNewRating]         = useState(5);
  const [newTitle, setNewTitle]           = useState("");
  const [newBody, setNewBody]             = useState("");

  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const related = getRelatedProducts(product);
  const discountPct = product.originalPrice
    ? calcDiscountPct(product.originalPrice, product.price) : 0;

  const images = product.images;

  const fetchReviews = useCallback(async () => {
    try {
      const res = await reviewsApi.getProductReviews(product.id);
      const dbReviews = (res.data ?? []).map((r: any) => ({
        id: r.id,
        userId: r.userId,
        userName: r.user ? `${r.user.firstName} ${r.user.lastName}` : "Verified Buyer",
        rating: r.rating,
        title: r.title || "Product Review",
        body: r.body || "",
        date: r.createdAt,
        verified: r.isVerifiedBuyer,
      }));
      setReviews(dbReviews);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBody.trim()) {
      toast.error("Please enter a review description");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewsApi.create(product.id, {
        rating: newRating,
        title: newTitle.trim() || undefined,
        body: newBody.trim(),
      });
      toast.success("Review submitted successfully! It will appear once approved. 🎉");
      setNewTitle("");
      setNewBody("");
      setNewRating(5);
      fetchReviews();
    } catch (err) {
      toast.error("Failed to submit review. Try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Auto-scroll images every 3 seconds
  const nextImage = useCallback(() => {
    if (images.length > 1) {
      setSelectedImage((i) => (i + 1) % images.length);
    }
  }, [images.length]);

  const prevImage = () => {
    setAutoplay(false);
    setSelectedImage((i) => (i - 1 + images.length) % images.length);
  };

  const goToImage = (idx: number) => {
    setAutoplay(false);
    setSelectedImage(idx);
  };

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const t = setInterval(nextImage, 3000);
    return () => clearInterval(t);
  }, [autoplay, nextImage, images.length]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} (×${quantity}) added to cart`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1b4332]">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-[#1b4332]">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products?category=${product.categorySlug}`} className="hover:text-[#1b4332]">{product.category}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-800 dark:text-white font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main image with prev/next arrows */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white border border-gray-100 dark:border-gray-800 group">
              <Image
                src={images[selectedImage]?.url ?? "/placeholder.jpg"}
                alt={images[selectedImage]?.alt ?? product.name}
                width={600}
                height={600}
                className="h-96 w-full object-contain p-2 bg-white dark:bg-white lg:h-[500px] transition-all duration-500"
                priority
                unoptimized
              />
              {discountPct > 0 && (
                <div className="absolute left-4 top-4">
                  <Badge variant="danger" className="text-sm px-3 py-1">{discountPct}% OFF</Badge>
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                  <span className="rounded-xl bg-white px-6 py-3 text-lg font-bold text-gray-800">Out of Stock</span>
                </div>
              )}

              {/* Prev/Next arrows — show on hover */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => { setAutoplay(false); setSelectedImage((i) => (i + 1) % images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToImage(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === selectedImage ? "w-5 bg-[#1b4332]" : "w-1.5 bg-white/70"
                      )}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails — horizontal scroll */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => goToImage(i)}
                    className={cn(
                      "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                      i === selectedImage
                        ? "border-[#1b4332] shadow-md scale-105"
                        : "border-gray-200 hover:border-gray-400 dark:border-gray-700 opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img.url} alt={img.alt} width={64} height={64} className="h-full w-full object-contain p-1 bg-white" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/products?category=${product.categorySlug}`}
                className="text-sm font-semibold uppercase tracking-widest text-[#1b4332] hover:underline dark:text-green-400"
              >
                {product.category}
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              {product.badge && (
                <Badge variant="accent" className="mt-2">{product.badge}</Badge>
              )}
            </div>

            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#1b4332] dark:text-green-400">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <Badge variant="danger">Save {formatPrice(product.originalPrice - product.price)}</Badge>
                </>
              )}
            </div>

            {/* SKU & Weight */}
            <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>SKU: <strong className="text-gray-700 dark:text-gray-300">{product.sku}</strong></span>
              {product.weight && <span>Net: <strong className="text-gray-700 dark:text-gray-300">{product.weight}</strong></span>}
            </div>

            {/* Stock */}
            <div>
              {product.inStock ? (
                <p className="text-sm font-medium text-green-600">
                  ✓ In Stock {product.stockCount <= 10 && <span className="text-amber-600">(Only {product.stockCount} left!)</span>}
                </p>
              ) : (
                <p className="text-sm font-medium text-red-600">✗ Out of Stock</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-gray-800 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">{product.stockCount} units available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="gap-2"
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Button
                size="lg"
                fullWidth
                variant="secondary"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="gap-2"
              >
                <Zap className="h-5 w-5" /> Buy Now
              </Button>
              <button
                onClick={() => {
                  toggle(product);
                  toast.info(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-colors",
                  inWishlist
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 dark:border-gray-700"
                )}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
              {[
                { Icon: Truck, label: "Free Shipping", sub: "Orders ₹999+" },
                { Icon: RotateCcw, label: "Easy Returns", sub: "7-day policy" },
                { Icon: ShieldCheck, label: "100% Authentic", sub: "Lab tested" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="h-5 w-5 text-[#1b4332] dark:text-green-400" />
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</p>
                  <p className="text-[10px] text-gray-500">{sub}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800 w-fit">
            {(["description", "reviews", "shipping"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-medium capitalize transition-all",
                  activeTab === tab
                    ? "bg-white shadow text-[#1b4332] dark:bg-gray-700 dark:text-green-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                )}
              >
                {tab} {tab === "reviews" && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "description" && (
              <div className="max-w-3xl space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {product.description}
                </p>
                <div className="rounded-2xl border border-[#1b4332]/20 bg-green-50 p-5 dark:bg-green-900/10">
                  <h3 className="font-semibold text-[#1b4332] dark:text-green-400 mb-2">Why choose Aayug Organics?</h3>
                  <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                    {["FSSAI certified organic", "No artificial preservatives or additives", "Lab tested for purity and authenticity", "Sustainably sourced from small farmers", "Packed in food-safe, eco-friendly packaging"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-[#1b4332] dark:text-green-400">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl space-y-6">
                {/* Summary */}
                <div className="flex items-center gap-6 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-[#1b4332] dark:text-green-400">{product.rating}</p>
                    <StarRating rating={product.rating} showCount={false} size="sm" className="mt-1 justify-center" />
                    <p className="mt-1 text-xs text-gray-500">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-3 text-xs text-gray-500">{star}</span>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-[10px] text-gray-400 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write Review Form */}
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-850 space-y-4 shadow-sm">
                    <h3 className="font-bold text-base text-gray-800 dark:text-white">Write a Review</h3>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Your Rating *</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="transition-transform active:scale-95"
                          >
                            <Star className={cn("h-6 w-6 text-amber-400", star <= newRating ? "fill-current" : "")} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Review Title</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Summarize your experience (optional)"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#1b4332] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Review Comments *</label>
                      <textarea
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                        placeholder="Write your review here..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[#1b4332] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <Button type="submit" loading={submittingReview} size="md">Submit Review</Button>
                  </form>
                ) : (
                  <div className="rounded-2xl bg-[#f5efe6] p-4 text-center dark:bg-gray-800 border border-amber-100 dark:border-gray-700">
                    <p className="text-xs text-[#5c3d2e] dark:text-gray-300">
                      Please <Link href="/auth/login" className="font-bold underline hover:text-[#1b4332]">sign in</Link> to write a review.
                    </p>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {loadingReviews ? (
                    <p className="text-xs text-gray-500">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-xs text-gray-500">No reviews yet for this product. Be the first to write one!</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b4332] text-sm font-bold text-white uppercase">
                              {review.userName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 dark:text-white">{review.userName}</p>
                              <StarRating rating={review.rating} showCount={false} size="sm" />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-gray-400">{new Date(review.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</p>
                            {review.verified && (
                              <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-medium text-green-700 border border-green-200">
                                ✓ Verified Buyer
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-white">{review.title}</p>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{review.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-2xl space-y-4">
                {[
                  { icon: Truck, title: "Standard Delivery", desc: "3–5 business days · ₹99 (Free on orders ₹999+)" },
                  { icon: Zap, title: "Express Delivery", desc: "1–2 business days · ₹149" },
                  { icon: RotateCcw, title: "Returns & Refunds", desc: "7-day hassle-free returns. Full refund on damaged or wrong items." },
                  { icon: ShieldCheck, title: "Secure Packaging", desc: "Tamper-proof, food-safe packaging. Cold-chain maintained for ghee." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    <Icon className="h-6 w-6 shrink-0 text-[#1b4332] dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{title}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
