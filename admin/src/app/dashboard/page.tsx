"use client";
import { useState, useEffect } from "react";
import { IndianRupee, ShoppingBag, Users, TrendingUp, ArrowUpRight, AlertTriangle, CheckCircle, Clock, Package } from "lucide-react";
import { adminFetch } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const SC: Record<string, { bg: string; color: string }> = {
  delivered: { bg: "#dcfce7", color: "#16a34a" }, shipped: { bg: "#dbeafe", color: "#2563eb" },
  processing: { bg: "#fef9c3", color: "#ca8a04" }, confirmed: { bg: "#f3e8ff", color: "#9333ea" },
  pending: { bg: "#f1f5f9", color: "#64748b" }, cancelled: { bg: "#fee2e2", color: "#dc2626" },
  DELIVERED: { bg: "#dcfce7", color: "#16a34a" }, SHIPPED: { bg: "#dbeafe", color: "#2563eb" },
  PROCESSING: { bg: "#fef9c3", color: "#ca8a04" }, CONFIRMED: { bg: "#f3e8ff", color: "#9333ea" },
  PENDING: { bg: "#f1f5f9", color: "#64748b" }, CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
};

export default function AdminDashboard() {
  const [chart, setChart] = useState<"revenue" | "orders">("revenue");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminFetch<any>("/admin/dashboard/stats");
        setStats(data.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "system-ui,sans-serif" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading store metrics...</p>
      </div>
    );
  }

  const revenueByMonth = stats?.revenueByMonth ?? [
    { month: "Jan", revenue: 0, orders: 0 },
    { month: "Feb", revenue: 0, orders: 0 },
    { month: "Mar", revenue: 0, orders: 0 },
    { month: "Apr", revenue: 0, orders: 0 },
    { month: "May", revenue: 0, orders: 0 },
    { month: "Jun", revenue: 0, orders: 0 },
    { month: "Jul", revenue: 0, orders: 0 },
  ];

  const maxRev = Math.max(...revenueByMonth.map((m: any) => m.revenue || 0), 1000);
  const maxOrd = Math.max(...revenueByMonth.map((m: any) => m.orders || 0), 5);

  const cardStats = [
    { label: "Total Revenue",    value: formatPrice(stats?.totalRevenue ?? 0), icon: IndianRupee, bg: "#f0fdf4", ic: "#16a34a" },
    { label: "Total Orders",     value: (stats?.totalOrders ?? 0).toLocaleString("en-IN"), icon: ShoppingBag, bg: "#eff6ff", ic: "#2563eb" },
    { label: "Customers",        value: (stats?.totalCustomers ?? 0).toLocaleString("en-IN"), icon: Users,       bg: "#faf5ff", ic: "#9333ea" },
    { label: "Pending Orders",   value: (stats?.pendingOrders ?? 0).toLocaleString("en-IN"), icon: TrendingUp,  bg: "#fffbeb", ic: "#d97706" },
  ];

  const recentOrders = stats?.recentOrders ?? [];
  const topProducts = stats?.topProducts ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Welcome back! Live data connected to Aiven PostgreSQL database.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {cardStats.map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={17} color={s.ic} />
              </div>
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>Performance Overview</h2>
            <div style={{ display: "flex", gap: 3, background: "#f1f5f9", borderRadius: 9, padding: 3 }}>
              {(["revenue", "orders"] as const).map((t) => (
                <button key={t} onClick={() => setChart(t)} style={{ padding: "4px 11px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, background: chart === t ? "white" : "transparent", color: chart === t ? "#1b4332" : "#94a3b8", boxShadow: chart === t ? "0 1px 2px rgba(0,0,0,0.08)" : "none", textTransform: "capitalize", fontFamily: "inherit" }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 160 }}>
            {revenueByMonth.map((m: any) => {
              const val = chart === "revenue" ? (m.revenue || 0) : (m.orders || 0);
              const max = chart === "revenue" ? maxRev : maxOrd;
              return (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%", justifyContent: "flex-end" }}>
                  <div title={chart === "revenue" ? formatPrice(val) : `${val} orders`}
                    style={{ width: "100%", borderRadius: "3px 3px 0 0", height: `${(val / max) * 100}%`, minHeight: 3, background: "#1b4332", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  />
                  <span style={{ fontSize: 8, color: "#94a3b8", fontWeight: 500 }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 18px" }}>Sales by Category</h2>
          {[
            { name: "Salt", value: 30, color: "#16a34a" },
            { name: "Honey", value: 25, color: "#2563eb" },
            { name: "Hing", value: 20, color: "#9333ea" },
            { name: "Ghee", value: 25, color: "#ca8a04" }
          ].map((c) => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: c.color }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{c.value}%</span>
              </div>
              <div style={{ height: 7, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
                <div style={{ width: `${c.value}%`, height: "100%", borderRadius: 3, background: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 7 }}><Clock size={14} color="#1b4332" /> Recent Orders</h2>
            <a href="/admin/dashboard/orders" style={{ fontSize: 12, color: "#1b4332", textDecoration: "none", fontWeight: 500 }}>View all</a>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>No recent orders found.</div>
          ) : recentOrders.map((o: any) => {
            const sc = SC[o.status] ?? SC.pending;
            const customerName = o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest Customer";
            return (
              <div key={o.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", borderBottom: "1px solid #f8fafc" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", margin: 0 }}>{o.orderNumber || "AYG-ORDER"}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{customerName}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1b4332", margin: 0 }}>{formatPrice(Number(o.grandTotal))}</p>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: sc.bg, color: sc.color, textTransform: "capitalize" }}>{o.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 7 }}><Package size={14} color="#1b4332" /> Top Sold Products</h2>
            {topProducts.length === 0 ? (
              <div style={{ color: "#94a3b8", fontSize: 12, padding: "10px 0" }}>No sales data available.</div>
            ) : topProducts.slice(0, 5).map((p: any, i: number) => (
              <div key={p.productId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < topProducts.length - 1 ? "1px solid #f8fafc" : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(27,67,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1b4332", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.productName}</p>
                  <p style={{ fontSize: 11, color: "#f59e0b", margin: 0 }}>Sold: {p.totalSold} items</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1b4332", flexShrink: 0 }}>{formatPrice(p.totalRevenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
