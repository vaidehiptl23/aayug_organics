"use client";
import { useState } from "react";
import {
  IndianRupee, ShoppingBag, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, AlertTriangle,
  CheckCircle, Clock, Package,
} from "lucide-react";
import { MONTHLY_REVENUE, CATEGORY_SALES, ORDERS, PRODUCTS } from "@/data/mock";
import { formatPrice, cn } from "@/lib/utils";

const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));
const maxOrders  = Math.max(...MONTHLY_REVENUE.map((m) => m.orders));

const STATUS_STYLE: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  shipped:    "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  confirmed:  "bg-purple-100 text-purple-700",
  pending:    "bg-gray-100 text-gray-600",
  cancelled:  "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [activeChart, setActiveChart] = useState<"revenue" | "orders">("revenue");

  const totalRevenue  = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalOrders   = MONTHLY_REVENUE.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const lowStock      = PRODUCTS.filter((p) => p.stock < 20);

  const stats = [
    { label: "Total Revenue",    value: formatPrice(totalRevenue),         change: "+18.2%", up: true,  icon: IndianRupee, bg: "bg-green-50",  ic: "text-green-600"  },
    { label: "Total Orders",     value: totalOrders.toLocaleString("en-IN"), change: "+12.5%", up: true,  icon: ShoppingBag, bg: "bg-blue-50",   ic: "text-blue-600"   },
    { label: "Total Customers",  value: "284",                              change: "+8.1%",  up: true,  icon: Users,       bg: "bg-purple-50", ic: "text-purple-600" },
    { label: "Avg. Order Value", value: formatPrice(avgOrderValue),         change: "+4.3%",  up: true,  icon: TrendingUp,  bg: "bg-amber-50",  ic: "text-amber-600"  },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s your store overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("h-5 w-5", s.ic)} />
              </div>
              <span className={cn("flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5", s.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500")}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Revenue / Orders bar chart */}
        <div className="xl:col-span-2 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800">Performance Overview</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(["revenue", "orders"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveChart(t)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium capitalize transition-all",
                    activeChart === t ? "bg-white text-[#1b4332] shadow-sm" : "text-gray-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-52">
            {MONTHLY_REVENUE.map((m) => {
              const val = activeChart === "revenue" ? m.revenue : m.orders;
              const max = activeChart === "revenue" ? maxRevenue : maxOrders;
              const pct = (val / max) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: "100%" }}>
                    <div
                      className="w-full rounded-t-md bg-[#1b4332] hover:bg-[#2d6a4f] transition-colors cursor-pointer relative group"
                      style={{ height: `${pct}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                        {activeChart === "revenue" ? formatPrice(val) : `${val} orders`}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">{m.month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-6 text-xs text-gray-500 border-t border-gray-50 pt-4">
            <span>Total: <strong className="text-gray-700">{activeChart === "revenue" ? formatPrice(totalRevenue) : `${totalOrders} orders`}</strong></span>
            <span>Avg/month: <strong className="text-gray-700">{activeChart === "revenue" ? formatPrice(Math.round(totalRevenue / 12)) : `${Math.round(totalOrders / 12)} orders`}</strong></span>
          </div>
        </div>

        {/* Category pie-like chart */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-6">Sales by Category</h2>
          <div className="space-y-4">
            {CATEGORY_SALES.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-medium text-gray-700">{c.name}</span>
                  </div>
                  <span className="font-bold text-gray-600">{c.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.value}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {CATEGORY_SALES.map((c) => (
              <div key={c.name} className="rounded-xl p-3" style={{ backgroundColor: `${c.color}15` }}>
                <p className="text-xs font-semibold" style={{ color: c.color }}>{c.name}</p>
                <p className="text-lg font-bold text-gray-800">{c.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Recent orders */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#1b4332]" /> Recent Orders
            </h2>
            <a href="/dashboard/orders" className="text-xs font-medium text-[#1b4332] hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {ORDERS.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{order.customer} · {order.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1b4332]">{formatPrice(order.total)}</p>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize", STATUS_STYLE[order.status])}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: low stock + top products */}
        <div className="space-y-5">
          {/* Low stock */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock Alerts
            </h2>
            {lowStock.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">All products are well stocked</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{p.name}</p>
                      <p className="text-xs text-gray-400">SKU: {p.sku}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-2.5 py-1 rounded-full",
                      p.stock < 10 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top products */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-[#1b4332]" /> Top Products
            </h2>
            <div className="space-y-3">
              {PRODUCTS.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332] text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-amber-500">⭐ {p.rating}</span>
                      <span className="text-[10px] text-gray-400">·</span>
                      <span className="text-[10px] text-gray-400">{p.reviews} reviews</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#1b4332]">{formatPrice(p.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
