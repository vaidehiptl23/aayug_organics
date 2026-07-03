"use client";
import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/lib/admin-toast";

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  delivered:  { bg: "#dcfce7", color: "#16a34a" },
  shipped:    { bg: "#dbeafe", color: "#2563eb" },
  processing: { bg: "#fef9c3", color: "#ca8a04" },
  confirmed:  { bg: "#f3e8ff", color: "#9333ea" },
  pending:    { bg: "#f1f5f9", color: "#64748b" },
  cancelled:  { bg: "#fee2e2", color: "#dc2626" },
  DELIVERED:  { bg: "#dcfce7", color: "#16a34a" },
  SHIPPED:    { bg: "#dbeafe", color: "#2563eb" },
  PROCESSING: { bg: "#fef9c3", color: "#ca8a04" },
  CONFIRMED:  { bg: "#f3e8ff", color: "#9333ea" },
  PENDING:    { bg: "#f1f5f9", color: "#64748b" },
  CANCELLED:  { bg: "#fee2e2", color: "#dc2626" },
};

const ALL = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("");
  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await adminFetch<any>("/orders");
      setOrders(res.data ?? []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const customerName = o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest Customer";
    const ms = (o.orderNumber || "").toLowerCase().includes(search.toLowerCase()) || customerName.toLowerCase().includes(search.toLowerCase());
    const mf = filter ? o.status === filter : true;
    return ms && mf;
  });

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      toast(`Status updated to "${status}"`, "success");
    } catch (err) {
      toast("Failed to update status", "error");
    }
  };

  const counts: Record<string, number> = {};
  ALL.forEach((s) => { counts[s] = orders.filter((o) => o.status === s).length; });

  const S = {
    font: "system-ui, -apple-system, sans-serif",
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "13px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "system-ui,sans-serif" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading store orders...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: S.font }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Orders</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{orders.length} total orders in database</p>
      </div>

      {/* Status filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {[{ val: "", label: `All (${orders.length})` }, ...ALL.map((s) => ({ val: s, label: `${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()} (${counts[s] || 0})` }))].map((f) => (
          <button key={f.val} onClick={() => setFilter(f.val === filter ? "" : f.val)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === f.val ? "#1b4332" : "#e2e8f0"}`,
            background: filter === f.val ? "#1b4332" : "white", color: filter === f.val ? "white" : "#64748b",
            fontSize: 12, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ marginBottom: 18 }}>
        <input placeholder="🔍  Search order number or customer name..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, width: 340, outline: "none", fontFamily: "inherit" }} />
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Order #", "Customer", "Date", "Items", "Payment", "Total", "Status", "Change Status"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No orders found.</td></tr>
            ) : filtered.map((o, i) => {
              const sc = STATUS_COLOR[o.status] ?? STATUS_COLOR.PENDING;
              const customerName = o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest Customer";
              return (
                <tr key={o.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ ...S.td, fontWeight: 600, color: "#1b4332" }}>{o.orderNumber || "AYG-ORDER"}</td>
                  <td style={S.td}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{customerName}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{o.user?.email || o.shippingAddress?.email}</div>
                    </div>
                  </td>
                  <td style={S.td}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td style={S.td}>{(o.items ?? []).length} items</td>
                  <td style={S.td}><span style={{ fontSize: 11, fontWeight: 600 }}>{o.paymentMethod || "COD"}</span></td>
                  <td style={{ ...S.td, fontWeight: 700, color: "#1b4332" }}>{formatPrice(Number(o.grandTotal))}</td>
                  <td style={S.td}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: sc.bg, color: sc.color, textTransform: "capitalize" }}>{o.status.toLowerCase()}</span></td>
                  <td style={S.td}>
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} style={{ padding: "4px 8px", fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", outline: "none", fontFamily: "inherit" }}>
                      {ALL.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
