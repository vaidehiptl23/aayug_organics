"use client";
import { useState, useEffect, useRef } from "react";
import { adminFetch, BASE_URL } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/lib/admin-toast";

type ProductImage = { id: string; url: string; alt: string; isPrimary?: boolean };
type Product = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  stock: number;
  badge: string;
  sku: string;
  status: string;
  images?: ProductImage[];
};

export default function AdminProductsPage() {
  const [list, setList]           = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch]       = useState("");
  const [showModal, setModal]     = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);
  const [showImages, setShowImgs] = useState<Product | null>(null);
  const [form, setForm]           = useState({ name: "", categoryId: "", price: "", stock: "", badge: "" });
  const fileRef                   = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading]     = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        adminFetch<any>("/products?limit=100"),
        adminFetch<any>("/categories")
      ]);
      const mappedProds: Product[] = (prodRes.data ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category?.name ?? "General",
        categoryId: p.categoryId ?? "",
        price: Number(p.price),
        stock: p.stockQuantity ?? 0,
        badge: p.badge ?? "",
        sku: p.sku || "",
        status: p.stockQuantity > 0 ? "active" : "out of stock",
        images: (p.images ?? []).map((img: any) => ({
          id: img.id,
          url: img.url,
          alt: img.altText ?? p.name,
          isPrimary: img.isPrimary
        }))
      }));
      setList(mappedProds);
      setCategories(catRes.data ?? []);
      if (catRes.data?.length > 0 && !form.categoryId) {
        setForm(f => ({ ...f, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error("Failed to load products dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      categoryId: categories[0]?.id || "",
      price: "",
      stock: "",
      badge: ""
    });
    setModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      categoryId: p.categoryId,
      price: String(p.price),
      stock: String(p.stock),
      badge: p.badge
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    try {
      const payload = {
        name: form.name,
        categoryId: form.categoryId,
        price: Number(form.price),
        stockQuantity: Number(form.stock),
        badge: form.badge || null,
        sku: editing ? editing.sku : "SKU-" + Math.floor(Math.random() * 900000 + 100000)
      };

      if (editing) {
        await adminFetch(`/products/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        toast("Product updated successfully", "success");
      } else {
        await adminFetch("/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast("Product created successfully", "success");
      }
      setModal(false);
      loadData();
    } catch (err) {
      toast("Error saving product details", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminFetch(`/products/${id}`, { method: "DELETE" });
      toast("Product deleted successfully", "success");
      loadData();
    } catch {
      toast("Failed to delete product", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showImages || !e.target.files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("images", e.target.files[i]);
      }
      // Since it's formData, we call fetch directly
      const sessionStr = sessionStorage.getItem("admin_session");
      const token = sessionStr ? JSON.parse(sessionStr)?.token : null;
      const res = await fetch(`${BASE_URL}/products/${showImages.id}/images`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      toast("Images uploaded successfully", "success");
      loadData();
      setShowImgs(null);
    } catch {
      toast("Failed to upload images", "error");
    } finally {
      setUploading(false);
    }
  };

  const S = {
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "12px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
    btn: (bg: string, co: string) => ({ background: bg, color: co, border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" })
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "system-ui,sans-serif" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading inventory dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Products</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Manage organic inventory ({list.length} products)</p>
        </div>
        <button onClick={openAdd} style={{ padding: "10px 18px", background: "#1b4332", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Add Product</button>
      </div>

      <div style={{ marginBottom: 18 }}>
        <input placeholder="🔍  Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, width: 280, outline: "none", fontFamily: "inherit" }} />
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Product", "Category", "Price", "Stock", "Images", "Status", "Actions"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {(p.images ?? []).length > 0 ? (
                      <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid #f1f5f9" }}>
                        <img
                          src={(p.images ?? []).find((i) => i.isPrimary)?.url ?? (p.images ?? [])[0]?.url}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/1b4332/fff?text=${p.name[0]}`; }}
                        />
                      </div>
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📦</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>SKU: {p.sku}</div>
                    </div>
                  </div>
                </td>
                <td style={S.td}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: "rgba(27,67,50,0.1)", color: "#1b4332" }}>{p.category}</span></td>
                <td style={{ ...S.td, fontWeight: 700, color: "#1b4332" }}>{formatPrice(p.price)}</td>
                <td style={{ ...S.td, fontWeight: 700, color: p.stock < 20 ? "#dc2626" : "#374151" }}>{p.stock}</td>
                <td style={S.td}>
                  <button onClick={() => setShowImgs(p)} style={{ ...S.btn("#eff6ff", "#2563eb"), display: "flex", alignItems: "center", gap: 5 }}>
                    🖼 {(p.images ?? []).length} photos
                  </button>
                </td>
                <td style={S.td}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: p.stock > 0 ? "#dcfce7" : "#fee2e2", color: p.stock > 0 ? "#16a34a" : "#dc2626" }}>{p.stock > 0 ? "active" : "out of stock"}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={S.btn("#f0fdf4", "#16a34a")}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={S.btn("#fef2f2", "#dc2626")}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Image Manager Modal ──────────────────────────────── */}
      {showImages && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 780, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#0f172a" }}>📸 Product Images</h3>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{showImages.name} · {(showImages.images ?? []).length} images</p>
              </div>
              <button onClick={() => setShowImgs(null)} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>Close ✕</button>
            </div>

            <div style={{ padding: "16px 24px", borderBottom: "1px solid #f8fafc" }}>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ width: "100%", padding: "14px", border: "2px dashed #d4a373", borderRadius: 12, background: "#fffbf5", color: "#92400e", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {uploading ? "⏳ Uploading..." : "📁 Click to upload images (multiple allowed)"}
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              {(showImages.images ?? []).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
                  <p style={{ fontSize: 14 }}>No images yet. Upload images above.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {(showImages.images ?? []).map((img) => (
                    <div key={img.id} style={{ borderRadius: 12, border: img.isPrimary ? "2px solid #1b4332" : "1px solid #f1f5f9", overflow: "hidden", background: "#fafafa" }}>
                      <div style={{ position: "relative", paddingTop: "75%", background: "#f8fafc" }}>
                        <img src={img.url} alt={img.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────────── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 500, padding: 28, boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 20px" }}>{editing ? "✍️ Edit Product" : "✨ Add New Product"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Category *</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 13, background: "white" }}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Stock Quantity *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Promo Tag / Badge</label>
                <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Best Seller, 10% OFF"
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", fontSize: 13 }} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={() => setModal(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cancel</button>
                <button onClick={handleSave} style={{ background: "#1b4332", color: "white", border: "none", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Save Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
