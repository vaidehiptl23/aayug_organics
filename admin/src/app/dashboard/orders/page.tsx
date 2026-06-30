"use client";
import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { ORDERS } from "@/data/mock";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

type Order = typeof ORDERS[0];

const STATUS_STYLE: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  shipped:    "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  confirmed:  "bg-purple-100 text-purple-700",
  pending:    "bg-gray-100 text-gray-600",
  cancelled:  "bg-red-100 text-red-700",
};

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [orders, setOrders]         = useState<Order[]>(ORDERS);

  const filtered = orders.filter((o) => {
    const ms = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter ? o.status === statusFilter : true;
    return ms && mf;
  });

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    toast(`Order status updated to "${status}"`, "success");
  };

  // Summary counts
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStatus("")} className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all", !statusFilter ? "bg-[#1b4332] text-white border-[#1b4332]" : "border-gray-200 text-gray-600 hover:border-[#1b4332]")}>
          All ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s === statusFilter ? "" : s)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize", statusFilter === s ? "bg-[#1b4332] text-white border-[#1b4332]" : "border-gray-200 text-gray-600 hover:border-[#1b4332]")}>
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders or customers..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1b4332]" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-x-auto shadow-sm">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Order", "Customer", "Items", "Total", "Payment", "Status", "Update Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString("en-IN")}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-700">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.city}</p>
                </td>
                <td className="px-5 py-4 text-gray-600">{order.items}</td>
                <td className="px-5 py-4 font-bold text-[#1b4332]">{formatPrice(order.total)}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">{order.payment}</td>
                <td className="px-5 py-4">
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold capitalize", STATUS_STYLE[order.status])}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1b4332] bg-white cursor-pointer">
                    {ALL_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <ShoppingBag className="h-10 w-10 text-gray-200" />
            <p className="text-gray-400">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
