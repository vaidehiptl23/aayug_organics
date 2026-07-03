"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Circle, Package } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { ordersApi } from "@/lib/api";
import { toast } from "@/components/ui/Toast";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await ordersApi.getMyOrder(id);
        setOrder(res.data);
      } catch {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const getTrackingEvents = (status: string, createdAt: string, updatedAt: string) => {
    const createdDateStr = new Date(createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    const updatedDateStr = new Date(updatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    const s = status.toUpperCase();
    
    return [
      { status: "Order Placed", description: "Your order has been placed successfully.", date: createdDateStr, completed: true },
      { status: "Confirmed", description: "Order confirmed by the seller.", date: createdDateStr, completed: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(s) },
      { status: "Processing", description: "Your order is being packed at our facility.", date: updatedDateStr, completed: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(s) },
      { status: "Shipped", description: "Shipped via partner courier.", date: updatedDateStr, completed: ["SHIPPED", "DELIVERED"].includes(s) },
      { status: "Delivered", description: "Delivered to your address.", date: updatedDateStr, completed: s === "DELIVERED" },
    ];
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-gray-500 text-sm">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <Link href="/dashboard/orders" className="text-sm font-semibold text-[#1b4332] hover:underline">Back to Orders</Link>
      </div>
    );
  }

  const trackingEvents = getTrackingEvents(order.status, order.createdAt, order.updatedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/orders" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-5 font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Package className="h-5 w-5 text-[#1b4332]" /> Order Tracking
        </h2>
        <div className="relative">
          {trackingEvents.map((event, i) => (
            <div key={i} className="flex gap-4 pb-6 last:pb-0">
              {/* Line */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                  event.completed
                    ? "border-[#1b4332] bg-[#1b4332] text-white"
                    : "border-gray-200 bg-white text-gray-300 dark:border-gray-600 dark:bg-gray-800"
                )}>
                  {event.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </div>
                {i < trackingEvents.length - 1 && (
                  <div className={cn("mt-1 w-0.5 flex-1", event.completed ? "bg-[#1b4332]" : "bg-gray-200 dark:bg-gray-700")} style={{ minHeight: 24 }} />
                )}
              </div>
              {/* Content */}
              <div className="pb-2">
                <p className={cn("font-semibold text-sm", event.completed ? "text-gray-800 dark:text-white" : "text-gray-400")}>
                  {event.status}
                </p>
                <p className="text-xs text-gray-500">{event.description}</p>
                {event.date && <p className="text-xs text-gray-400 mt-0.5">{event.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Items */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 font-bold text-gray-800 dark:text-white">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3">
                <Image 
                  src={item.product?.images?.[0]?.url ?? "https://placehold.co/48x48/1b4332/fff?text=Product"} 
                  alt={item.product?.name ?? "Product image"} 
                  width={48} 
                  height={48} 
                  className="h-12 w-12 rounded-lg object-cover" 
                  unoptimized 
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">{item.product?.name}</p>
                  <p className="text-xs text-gray-400">× {item.quantity} · {item.product?.weight || "500g"}</p>
                </div>
                <span className="text-sm font-semibold text-[#1b4332] dark:text-green-400">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 font-bold text-gray-800 dark:text-white">Price Summary</h2>
            <div className="space-y-2 text-sm">
              {[
                { l: "Subtotal", v: formatPrice(order.subtotal) },
                ...(order.discount > 0 ? [{ l: "Discount", v: `−${formatPrice(order.discount)}`, g: true }] : []),
                { l: "Shipping", v: order.shipping === 0 ? "FREE" : formatPrice(order.shipping), g: order.shipping === 0 },
                { l: "Tax (GST)", v: formatPrice(order.tax) },
              ].map(({ l, v, g }) => (
                <div key={l} className="flex justify-between">
                  <span className="text-gray-500">{l}</span>
                  <span className={cn("font-medium", g ? "text-green-600" : "text-gray-800 dark:text-white")}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
                <span className="font-bold text-gray-800 dark:text-white">Total</span>
                <span className="font-bold text-[#1b4332] dark:text-green-400">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 font-bold text-gray-800 dark:text-white">Delivery Address</h2>
            <p className="text-sm font-medium text-gray-800 dark:text-white">{order.address?.fullName}</p>
            <p className="text-sm text-gray-500">{order.address?.phone}</p>
            <p className="text-sm text-gray-500">{order.address?.addressLine1}</p>
            {order.address?.addressLine2 && <p className="text-sm text-gray-500">{order.address?.addressLine2}</p>}
            <p className="text-sm text-gray-500">{order.address?.city}, {order.address?.state} – {order.address?.postalCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
