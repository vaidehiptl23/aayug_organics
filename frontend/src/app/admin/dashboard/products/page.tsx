"use client";
import { useState } from "react";
import { PRODUCTS } from "@/data/admin-mock";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/lib/admin-toast";

type Product = typeof PRODUCTS[0];

export default function AdminProductsPage() {
  const [search, setSearch]   = useState("");
  const [list, setList]       = useState<Product[]>(PRODUCTS);
  const [showModal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm]       = useState({ name: "", category: "Salt", price: "", stock: "", badge: "" });

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: "Salt", price: "", stock: "", badge: "" });
    setModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), badge: p.badge });
    setModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editing) {
      setList((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p));
      toast("Product updated", "success");
    } else {
      setList((prev) => [...prev, {
        id: `p-${Date.now()}`, name: form.name, category: form.category,
        price: Number(form.price), stock: Number(form.stock),
        rating: 0, reviews: 0, status: "active",
        sku: `${form.category.slice(0, 3).toUpperCase()}-NEW-${Date.now()}`,
        badge: form.badge,
      }]);
      toast("Product added", "success");
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((p) => p.id !== id));
    toast("Product deleted", "success");
  };

  const S = {
    page: { fontFamily: "system-ui, -apple-system, sans-serif" } as React.CSSProperties,
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 } as React.CSSProperties,
    h1: { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 } as React.CSSProperties,
    sub: { fontSize: 13, color: "#94a3b8", margin: "4px 0 0" } as React.CSSProperties,
    btn: { padding: "10px 18px", background: "#1b4332", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } as React.CSSProperties,
    searchWrap: { marginBottom: 20 } as React.CSSProperties,
    searchInput: { padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, width: 280, outline: "none", fontFamily: "inherit" } as React.CSSProperties,
    table: { width: "100%", borderCollapse: "collapse" as const, background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" },
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "14px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
    badge: (active: boolean) => ({ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: active ? "#dcfce7" : "#f1f5f9", color: active ? "#16a34a" : "#94a3b8" }) as React.CSSProperties,
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.h1}>Products</h1>
          <p style={S.sub}>{list.length} products total</p>
        </div>
        <button style={S.btn} onClick={openAdd}>+ Add Product</button>
      </div>

      <div style={S.searchWrap}>
        <input
          style={S.searchInput}
          placeholder="🔍  Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            {["Product", "Category", "Price", "Stock", "Rating", "Status", "Actions"].map((h) => (
              <th key={h} style={{ ...S.th, textAlign: h === "Actions" ? "right" : "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={p.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
              <td style={S.td}>
                <div style={{ fontWeight: 600, color: "#0f172a" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>SKU: {p.sku}</div>
              </td>
              <td style={S.td}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(27,67,50,0.1)", color: "#1b4332" }}>{p.category}</span>
              </td>
              <td style={{ ...S.td, fontWeight: 700, color: "#1b4332" }}>{formatPrice(p.price)}</td>
              <td style={{ ...S.td, fontWeight: 700, color: p.stock < 20 ? "#dc2626" : "#374151" }}>{p.stock}</td>
              <td style={{ ...S.td, color: "#d97706", fontWeight: 600 }}>⭐ {p.rating} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({p.reviews})</span></td>
              <td style={S.td}><span style={S.badge(p.status === "active")}>{p.status === "active" ? "Active" : "Inactive"}</span></td>
              <td style={{ ...S.td, textAlign: "right" }}>
                <button onClick={() => openEdit(p)} style={{ marginRight: 8, padding: "5px 10px", background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: "5px 10px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#0f172a" }}>{editing ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>×</button>
            </div>
            {[
              { label: "Product Name *", key: "name", placeholder: "e.g. A2 Gir Cow Ghee", type: "text" },
              { label: "Price (₹) *",   key: "price", placeholder: "e.g. 899",            type: "number" },
              { label: "Stock Qty",     key: "stock", placeholder: "e.g. 50",             type: "number" },
              { label: "Badge",         key: "badge", placeholder: "e.g. Bestseller",     type: "text" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form] as string}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", fontFamily: "inherit" }}
              >
                {["Salt", "Honey", "Hing", "Ghee"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: 11, background: "#f8fafc", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={handleSave} style={{ flex: 1, padding: 11, background: "#1b4332", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{editing ? "Save Changes" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
