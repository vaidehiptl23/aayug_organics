"use client";
import { useState } from "react";
import { toast } from "@/lib/admin-toast";

type Coupon = { id: string; code: string; type: "%" | "₹"; value: number; minOrder: number; limit: number; used: number; active: boolean; expires: string };

const INIT: Coupon[] = [
  { id: "c-1", code: "ORGANIC10", type: "%", value: 10, minOrder: 299, limit: 1000, used: 234, active: true,  expires: "2025-12-31" },
  { id: "c-2", code: "WELCOME50", type: "₹", value: 50, minOrder: 299, limit: 500,  used: 89,  active: true,  expires: "2025-06-30" },
  { id: "c-3", code: "SAVE100",   type: "₹", value: 100, minOrder: 999, limit: 200, used: 12,  active: false, expires: "2025-03-31" },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INIT);
  const [showModal, setModal] = useState(false);
  const [form, setForm]       = useState({ code: "", type: "%", value: "", minOrder: "", limit: "", expires: "" });

  const toggle = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    toast("Coupon status updated", "success");
  };

  const del = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast("Coupon deleted", "success");
  };

  const save = () => {
    if (!form.code || !form.value) return;
    setCoupons((prev) => [...prev, {
      id: `c-${Date.now()}`, code: form.code.toUpperCase(),
      type: form.type as "%" | "₹", value: Number(form.value),
      minOrder: Number(form.minOrder), limit: Number(form.limit),
      used: 0, active: true, expires: form.expires,
    }]);
    toast("Coupon created!", "success");
    setModal(false);
    setForm({ code: "", type: "%", value: "", minOrder: "", limit: "", expires: "" });
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Coupons</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{coupons.length} coupons</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding: "10px 18px", background: "#1b4332", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Create Coupon</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {coupons.map((c) => (
          <div key={c.id} style={{ background: "white", borderRadius: 16, padding: 22, border: `2px solid ${c.active ? "rgba(27,67,50,0.2)" : "#f1f5f9"}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", opacity: c.active ? 1 : 0.65 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🏷️</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: 1 }}>{c.code}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: c.active ? "#dcfce7" : "#f1f5f9", color: c.active ? "#16a34a" : "#94a3b8" }}>
                {c.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: "#1b4332", margin: "0 0 4px" }}>
              {c.type === "%" ? `${c.value}% OFF` : `₹${c.value} OFF`}
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>Min order: ₹{c.minOrder} · Expires: {c.expires}</p>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 5 }}>
                <span>Usage</span><span>{c.used}/{c.limit}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
                <div style={{ width: `${Math.min((c.used / c.limit) * 100, 100)}%`, height: "100%", background: "#1b4332", borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => toggle(c.id)} style={{ flex: 1, padding: "8px 0", background: c.active ? "#f8fafc" : "#1b4332", color: c.active ? "#64748b" : "white", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {c.active ? "Disable" : "Enable"}
              </button>
              <button onClick={() => del(c.id)} style={{ padding: "8px 14px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 9, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#0f172a" }}>Create Coupon</h3>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>×</button>
            </div>
            {[
              { label: "Coupon Code *", key: "code",     placeholder: "e.g. SAVE20", type: "text" },
              { label: "Value *",       key: "value",    placeholder: "e.g. 10",     type: "number" },
              { label: "Min Order (₹)", key: "minOrder", placeholder: "299",          type: "number" },
              { label: "Usage Limit",   key: "limit",    placeholder: "100",          type: "number" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                <option value="%">Percentage (%)</option>
                <option value="₹">Fixed (₹)</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Expiry Date</label>
              <input type="date" value={form.expires} onChange={(e) => setForm((p) => ({ ...p, expires: e.target.value }))}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: 11, background: "#f8fafc", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={save} style={{ flex: 1, padding: 11, background: "#1b4332", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
