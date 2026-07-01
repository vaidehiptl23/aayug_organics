"use client";
import { useState } from "react";
import { CUSTOMERS } from "@/data/admin-mock";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const filtered = CUSTOMERS.filter((c) => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" ? true : filter === "verified" ? c.verified : !c.verified;
    return ms && mf;
  });

  const totalSpent = CUSTOMERS.reduce((s, c) => s + c.spent, 0);

  const S = {
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "14px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Customers</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{CUSTOMERS.length} registered customers</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total",    value: String(CUSTOMERS.length),                                   color: "#0f172a" },
          { label: "Verified", value: String(CUSTOMERS.filter((c) => c.verified).length),          color: "#16a34a" },
          { label: "Revenue",  value: formatPrice(totalSpent),                                     color: "#1b4332" },
          { label: "Avg Spend",value: formatPrice(Math.round(totalSpent / CUSTOMERS.length)),       color: "#9333ea" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          placeholder="🔍  Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, width: 260, outline: "none", fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4 }}>
          {(["all", "verified", "unverified"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer",
              background: filter === f ? "white" : "transparent",
              color: filter === f ? "#1b4332" : "#94a3b8",
              fontWeight: filter === f ? 600 : 400,
              fontSize: 12, textTransform: "capitalize", boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              fontFamily: "inherit",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Customer", "Contact", "Orders", "Total Spent", "Joined", "Status"].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(27,67,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1b4332", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {c.name[0]}
                    </div>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{c.name}</span>
                  </div>
                </td>
                <td style={S.td}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{c.email}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{c.phone}</div>
                </td>
                <td style={{ ...S.td, fontWeight: 600 }}>{c.orders}</td>
                <td style={{ ...S.td, fontWeight: 700, color: "#1b4332" }}>{formatPrice(c.spent)}</td>
                <td style={{ ...S.td, fontSize: 12, color: "#94a3b8" }}>{new Date(c.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td style={S.td}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: c.verified ? "#dcfce7" : "#fef9c3", color: c.verified ? "#16a34a" : "#ca8a04" }}>
                    {c.verified ? "✓ Verified" : "⏳ Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8", fontSize: 14 }}>No customers found</div>
        )}
      </div>
    </div>
  );
}
