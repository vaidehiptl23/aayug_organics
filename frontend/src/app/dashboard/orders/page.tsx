"use client";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import { SAMPLE_ORDERS } from "@/data/orders";
import { formatPrice } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-purple-100 text-purple-700",
  pending: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-pink-100 text-pink-700",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-[#1b4332]" /> My Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">{SAMPLE_ORDERS.length} orders placed</p>
      </div>

      {SAMPLE_ORDERS.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <Package className="h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No orders yet. Start shopping!</p>
          <Link href="/products" className="text-sm font-semibold text-[#1b4332] hover:underline">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {SAMPLE_ORDERS.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-800 dark:text-white">{order.orderNumber}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {order.items.length} item{order.items.length > 1 ? "s" : ""} · {order.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1b4332] dark:text-green-400">{formatPrice(order.total)}</p>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Item thumbnails */}
              <div className="mt-4 flex gap-3 flex-wrap">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-2">
                    <Image
                      src={item.product.images[0]?.url ?? "/placeholder.jpg"}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[120px]">{item.product.name}</p>
                      <p className="text-xs text-gray-400">× {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
