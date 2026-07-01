"use client";
import { useState } from "react";
import { IndianRupee, ShoppingBag, Users, TrendingUp, ArrowUpRight, AlertTriangle, CheckCircle, Clock, Package } from "lucide-react";
import { MONTHLY_REVENUE, CATEGORY_SALES, ORDERS, PRODUCTS } from "@/data/admin-mock";
import { formatPrice } from "@/lib/utils";

const maxRev = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));
const maxOrd = Math.max(...MONTHLY_REVENUE.map((m) => m.orders));

const SC: Record<string, { bg: string; color: string }> = {
  delivered: { bg: "#dcfce7", color: "#16a34a" }, shipped: { bg: "#dbeafe", color: "#2563eb" },
  processing: { bg: "#fef9c3", color: "#ca8a04" }, confirmed: { bg: "#f3e8ff", color: "#9333ea" },
  pending: { bg: "#f1f5f9", color: "#64748b" }, cancelled: { bg: "#fee2e2", color: "#dc2626" },
};

export default function AdminDashboard() {
  const [chart, setChart] = useState<"revenue" | "orders">("revenue");
  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalOrders  = MONTHLY_REVENUE.reduce((s, m) => s + m.orders, 0);
  const avgOrder     = Math.round(totalRevenue / totalOrders);
  const lowStock     = PRODUCTS.filter((p) => p.stock < 20);

  const stats = [
    { label: "Total Revenue",    value: formatPrice(totalRevenue),            icon: IndianRupee, bg: "#f0fdf4", ic: "#16a34a" },
    { label: "Total Orders",     value: totalOrders.toLocaleString("en-IN"), icon: ShoppingBag, bg: "#eff6ff", ic: "#2563eb" },
    { label: "Customers",        value: "284",                                icon: Users,       bg: "#faf5ff", ic: "#9333ea" },
    { label: "Avg. Order Value", value: formatPrice(avgOrder),                icon: TrendingUp,  bg: "#fffbeb", ic: "#d97706" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Welcome back! Here&apos;s your store overview.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={17} color={s.ic} />
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", padding: "2px 7px", borderRadius: 20 }}>
                <ArrowUpRight size={10} />+12%
              </span>
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
            {MONTHLY_REVENUE.map((m) => {
              const val = chart === "revenue" ? m.revenue : m.orders;
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
          {CATEGORY_SALES.map((c) => (
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
          {ORDERS.slice(0, 5).map((o) => {
            const sc = SC[o.status] ?? SC.pending;
            return (
              <div key={o.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", borderBottom: "1px solid #f8fafc" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", margin: 0 }}>{o.orderNumber}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{o.customer} · {o.city}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1b4332", margin: 0 }}>{formatPrice(o.total)}</p>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: sc.bg, color: sc.color, textTransform: "capitalize" }}>{o.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 7 }}><AlertTriangle size={14} color="#f59e0b" /> Low Stock</h2>
            {lowStock.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#16a34a", fontSize: 13 }}><CheckCircle size={14} /> All stocked well</div>
            ) : lowStock.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 11px", borderRadius: 9, background: "#fffbeb", marginBottom: 5 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#374151", margin: 0 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>SKU: {p.sku}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: p.stock < 10 ? "#fee2e2" : "#fef9c3", color: p.stock < 10 ? "#dc2626" : "#ca8a04" }}>{p.stock} left</span>
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 7 }}><Package size={14} color="#1b4332" /> Top Products</h2>
            {PRODUCTS.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < PRODUCTS.length - 1 ? "1px solid #f8fafc" : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(27,67,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1b4332", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "#f59e0b", margin: 0 }}>⭐ {p.rating}</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1b4332", flexShrink: 0 }}>{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
