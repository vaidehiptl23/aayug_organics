"use client";
import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await adminFetch<any>("/users");
        setCustomers(res.data ?? []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
    const email = (c.email || "").toLowerCase();
    const ms = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const mf = filter === "all" ? true : filter === "verified" ? c.isEmailVerified : !c.isEmailVerified;
    return ms && mf;
  });

  const totalSpent = customers.reduce((s, c) => s + (c.spent || 0), 0);

  const S = {
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "14px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "system-ui,sans-serif" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading registered users...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Customers</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{customers.length} registered customers in database</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total",    value: String(customers.length),                                   color: "#0f172a" },
          { label: "Verified", value: String(customers.filter((c) => c.isEmailVerified).length),      color: "#16a34a" },
          { label: "Active Roles",  value: String(customers.filter((c) => c.role === "CUSTOMER").length) + " users", color: "#1b4332" },
          { label: "Staff Admins",value: String(customers.filter((c) => c.role === "ADMIN").length),        color: "#9333ea" },
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
      <div style={{ background: "white", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Customer", "Email", "Phone", "Joined Date", "Verified", "Role"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No customers match the filter criteria.</td></tr>
            ) : filtered.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ ...S.td, fontWeight: 600 }}>{c.firstName || "N/A"} {c.lastName || ""}</td>
                <td style={S.td}>{c.email}</td>
                <td style={S.td}>{c.phone || "—"}</td>
                <td style={S.td}>{new Date(c.createdAt || c.joinedDate).toLocaleDateString("en-IN")}</td>
                <td style={S.td}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: c.isEmailVerified ? "#dcfce7" : "#fee2e2", color: c.isEmailVerified ? "#16a34a" : "#dc2626" }}>
                    {c.isEmailVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td style={S.td}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: c.role === "ADMIN" ? "#f3e8ff" : "#f1f5f9", color: c.role === "ADMIN" ? "#9333ea" : "#475569" }}>
                    {c.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
