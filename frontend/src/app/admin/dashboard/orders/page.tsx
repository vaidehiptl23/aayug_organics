"use client";
import { useState } from "react";
import { ORDERS } from "@/data/admin-mock";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/lib/admin-toast";

type Order = typeof ORDERS[0];

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  delivered:  { bg: "#dcfce7", color: "#16a34a" },
  shipped:    { bg: "#dbeafe", color: "#2563eb" },
  processing: { bg: "#fef9c3", color: "#ca8a04" },
  confirmed:  { bg: "#f3e8ff", color: "#9333ea" },
  pending:    { bg: "#f1f5f9", color: "#64748b" },
  cancelled:  { bg: "#fee2e2", color: "#dc2626" },
};

const ALL = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("");
  const [orders, setOrders]   = useState<Order[]>(ORDERS);

  const filtered = orders.filter((o) => {
    const ms = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const mf = filter ? o.status === filter : true;
    return ms && mf;
  });

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    toast(`Status updated to "${status}"`, "success");
  };

  const counts: Record<string, number> = {};
  ALL.forEach((s) => { counts[s] = orders.filter((o) => o.status === s).length; });

  const S = {
    font: "system-ui, -apple-system, sans-serif",
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "13px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
  };

  return (
    <div style={{ fontFamily: S.font }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Orders</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{orders.length} total orders</p>
      </div>

      {/* Status filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {[{ val: "", label: `All (${orders.length})` }, ...ALL.map((s) => ({ val: s, label: `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})` }))].map((f) => (
          <button key={f.val} onClick={() => setFilter(f.val === filter ? "" : f.val)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === f.val ? "#1b4332" : "#e2e8f0"}`,
            background: filter === f.val ? "#1b4332" : "white", color: filter === f.val ? "white" : "#64748b",
            fontSize: 12, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="🔍  Search orders or customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, width: 300, outline: "none", fontFamily: "inherit" }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Order", "Customer", "Items", "Total", "Payment", "Status", "Update"].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => {
              const sc = STATUS_COLOR[o.status] ?? STATUS_COLOR.pending;
              return (
                <tr key={o.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{o.orderNumber}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date(o.date).toLocaleDateString("en-IN")}</div>
                  </td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 500 }}>{o.customer}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{o.city}</div>
                  </td>
                  <td style={S.td}>{o.items}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: "#1b4332" }}>{formatPrice(o.total)}</td>
                  <td style={{ ...S.td, fontSize: 12, color: "#64748b" }}>{o.payment}</td>
                  <td style={S.td}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.color, textTransform: "capitalize" }}>{o.status}</span>
                  </td>
                  <td style={S.td}>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      style={{ fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 7, padding: "5px 8px", outline: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      {ALL.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8", fontSize: 14 }}>No orders found</div>
        )}
      </div>
    </div>
  );
}
