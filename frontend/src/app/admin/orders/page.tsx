"use client";
import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { SAMPLE_ORDERS } from "@/data/orders";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  shipped:    "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  confirmed:  "bg-purple-100 text-purple-700",
  pending:    "bg-gray-100 text-gray-600",
  cancelled:  "bg-red-100 text-red-700",
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending",    label: "Pending" },
  { value: "confirmed",  label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped",    label: "Shipped" },
  { value: "delivered",  label: "Delivered" },
  { value: "cancelled",  label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orders, setOrders]           = useState(SAMPLE_ORDERS);

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: status as typeof o.status } : o));
    toast.success("Order status updated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 max-w-xs">
          <Input placeholder="Search by order number..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Order</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Customer</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Items</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Total</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Payment</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-800 dark:text-white">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString("en-IN")}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 dark:text-gray-300">{order.address.fullName}</p>
                  <p className="text-xs text-gray-400">{order.address.city}, {order.address.state}</p>
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                <td className="px-5 py-4 font-bold text-[#1b4332] dark:text-green-400">{formatPrice(order.total)}</td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{order.paymentMethod}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#1b4332] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
