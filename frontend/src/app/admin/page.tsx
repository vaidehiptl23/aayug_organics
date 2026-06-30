"use client";
import { useState } from "react";
import {
  TrendingUp, ShoppingBag, Users, Package,
  IndianRupee, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Clock, CheckCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { products } from "@/data/products";
import { SAMPLE_ORDERS } from "@/data/orders";

// ─── Mock analytics data ───────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 12400, orders: 42 },
  { month: "Feb", revenue: 18200, orders: 61 },
  { month: "Mar", revenue: 15800, orders: 53 },
  { month: "Apr", revenue: 22100, orders: 74 },
  { month: "May", revenue: 19600, orders: 66 },
  { month: "Jun", revenue: 28400, orders: 95 },
  { month: "Jul", revenue: 31200, orders: 104 },
  { month: "Aug", revenue: 26800, orders: 89 },
  { month: "Sep", revenue: 34500, orders: 115 },
  { month: "Oct", revenue: 41200, orders: 137 },
  { month: "Nov", revenue: 38900, orders: 129 },
  { month: "Dec", revenue: 52300, orders: 174 },
];

const CATEGORY_SALES = [
  { name: "Ghee",  sales: 45, color: "#1b4332", revenue: 40455 },
  { name: "Honey", sales: 28, color: "#d4a373", revenue: 15372 },
  { name: "Salt",  sales: 18, color: "#6366f1", revenue: 3582  },
  { name: "Hing",  sales: 9,  color: "#f59e0b", revenue: 2691  },
];

const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));

export default function AdminDashboard() {
  const [period, setPeriod] = useState<"7d" | "30d" | "12m">("12m");

  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalOrders  = MONTHLY_REVENUE.reduce((s, m) => s + m.orders, 0);
  const totalCustomers = 284;
  const avgOrderValue  = Math.round(totalRevenue / totalOrders);

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      change: "+18.2%",
      up: true,
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: "+12.5%",
      up: true,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Customers",
      value: totalCustomers.toLocaleString(),
      change: "+8.1%",
      up: true,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Avg. Order Value",
      value: formatPrice(avgOrderValue),
      change: "+4.3%",
      up: true,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const lowStockProducts = products.filter((p) => p.stockCount < 20);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "12m"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? "bg-[#1b4332] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "12 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-5 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-green-600" : "text-red-500"}`}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800 dark:text-white">Revenue Overview</h2>
            <span className="text-xs text-gray-400">Monthly Revenue (₹)</span>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-48">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#1b4332] hover:bg-[#2d6a4f] transition-colors cursor-pointer relative group"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
                    {formatPrice(m.revenue)}
                  </div>
                </div>
                <span className="text-[9px] text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-white mb-6">Sales by Category</h2>
          <div className="space-y-4">
            {CATEGORY_SALES.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
                  <span className="text-gray-500">{c.sales}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${c.sales}%`, backgroundColor: c.color }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{formatPrice(c.revenue)} revenue</p>
              </div>
            ))}
          </div>

          {/* Donut legend */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_SALES.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#1b4332]" /> Recent Orders
            </h2>
          </div>
          <div className="space-y-3">
            {SAMPLE_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{order.items.length} items · {order.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1b4332] dark:text-green-400">{formatPrice(order.total)}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    order.status === "delivered" ? "bg-green-100 text-green-700" :
                    order.status === "shipped"   ? "bg-blue-100 text-blue-700" :
                    order.status === "processing"? "bg-amber-100 text-amber-700" :
                                                   "bg-gray-100 text-gray-600"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts + top products */}
        <div className="space-y-4">
          {/* Low stock */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock Alerts
            </h2>
            {lowStockProducts.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">All products are well stocked</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{p.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.stockCount < 10 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      {p.stockCount} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top products */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-[#1b4332]" /> Top Products
            </h2>
            <div className="space-y-3">
              {products.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-400">{formatPrice(p.price)} · ⭐ {p.rating}</p>
                  </div>
                  <span className="text-xs text-gray-400">{p.reviewCount} reviews</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
