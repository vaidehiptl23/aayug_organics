"use client";
import Link from "next/link";
import { Package, Heart, MapPin, ShoppingBag, TrendingUp, Clock } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { SAMPLE_ORDERS } from "@/data/orders";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const stats = [
    { label: "Total Orders", value: SAMPLE_ORDERS.length, icon: Package, href: "/dashboard/orders", color: "bg-blue-50 text-blue-600" },
    { label: "Wishlist Items", value: wishlistCount, icon: Heart, href: "/dashboard/wishlist", color: "bg-red-50 text-red-600" },
    { label: "Cart Items", value: cartCount, icon: ShoppingBag, href: "/cart", color: "bg-amber-50 text-amber-600" },
    { label: "Saved Addresses", value: 2, icon: MapPin, href: "/dashboard/addresses", color: "bg-green-50 text-green-600" },
  ];

  const recentOrders = SAMPLE_ORDERS.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] px-6 py-8 text-white">
        <h1 className="text-2xl font-bold">Good day, {user?.firstName}! 🌿</h1>
        <p className="mt-1 text-white/70">Here&apos;s an overview of your account activity.</p>
        <p className="mt-3 text-xs text-white/50">Member since {new Date(user?.joinedDate ?? "").toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#1b4332]" /> Recent Orders
          </h2>
          <Link href="/dashboard/orders" className="text-sm font-medium text-[#1b4332] hover:underline dark:text-green-400">View all</Link>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-white">{order.orderNumber}</p>
                <p className="text-xs text-gray-500">{order.items.length} item{order.items.length > 1 ? "s" : ""} · {new Date(order.date).toLocaleDateString("en-IN")}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#1b4332] dark:text-green-400">{formatPrice(order.total)}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/products" className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-all dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1b4332]/10"><TrendingUp className="h-6 w-6 text-[#1b4332]" /></div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Shop New Arrivals</p>
            <p className="text-xs text-gray-500">Discover our latest organic products</p>
          </div>
        </Link>
        <Link href="/dashboard/wishlist" className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-all dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50"><Heart className="h-6 w-6 text-red-500" /></div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">My Wishlist</p>
            <p className="text-xs text-gray-500">{wishlistCount} item{wishlistCount !== 1 ? "s" : ""} saved</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-amber-100 text-amber-700",
    confirmed: "bg-purple-100 text-purple-700",
    pending: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${colors[status] ?? colors.pending}`}>
      {status}
    </span>
  );
}
