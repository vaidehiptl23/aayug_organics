"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/data/admin-mock";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/lib/admin-toast";

type ProductImage = { id: string; url: string; alt: string; isPrimary?: boolean };
type Product = typeof PRODUCTS[0] & { images?: ProductImage[] };

// ── Ghee images from the actual product photos ──
const GHEE_IMAGES: ProductImage[] = [
  { id: "g1", url: "/products/ghee/ghee-front.jpeg",     alt: "A2 Gir Cow Ghee - Front View",    isPrimary: true  },
  { id: "g2", url: "/products/ghee/ghee-back.jpeg",      alt: "A2 Gir Cow Ghee - Back Label",    isPrimary: false },
  { id: "g3", url: "/products/ghee/ghee-banner.jpeg",    alt: "Ghee - Health Benefits Banner",   isPrimary: false },
  { id: "g4", url: "/products/ghee/ghee-bilona.jpeg",    alt: "Bilona Method Process",           isPrimary: false },
  { id: "g5", url: "/products/ghee/ghee-why.jpeg",       alt: "Why Aayug Ghee is Better",        isPrimary: false },
  { id: "g6", url: "/products/ghee/ghee-choose.jpeg",    alt: "Why Choose Aayug",                isPrimary: false },
  { id: "g7", url: "/products/ghee/ghee-nutrition.jpeg", alt: "Nutrition Facts",                 isPrimary: false },
  { id: "g8", url: "/products/ghee/ghee-process.jpeg",   alt: "Traditional Bilona Process",      isPrimary: false },
  { id: "g9", url: "/products/ghee/ghee-benefits.jpeg",  alt: "Packed With Health Benefits",     isPrimary: false },
];

const INITIAL_PRODUCTS: Product[] = PRODUCTS.map((p) => ({
  ...p,
  images: p.name.includes("Ghee") ? GHEE_IMAGES : [],
}));

export default function AdminProductsPage() {
  const [list, setList]           = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch]       = useState("");
  const [showModal, setModal]     = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);
  const [showImages, setShowImgs] = useState<Product | null>(null);
  const [form, setForm]           = useState({ name: "", category: "Salt", price: "", stock: "", badge: "" });
  const fileRef                   = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
        rating: 0, reviews: 0, status: "active", images: [],
        sku: `${form.category.slice(0,3).toUpperCase()}-NEW-${Date.now()}`, badge: form.badge,
      }]);
      toast("Product added", "success");
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setList((prev) => prev.filter((p) => p.id !== id));
    toast("Product deleted", "success");
  };

  // ── Image management ──────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !showImages) return;
    setUploading(true);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        const newImg: ProductImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url, alt: file.name.replace(/\.[^.]+$/, ""),
          isPrimary: (showImages.images ?? []).length === 0,
        };
        setList((prev) => prev.map((p) =>
          p.id === showImages.id ? { ...p, images: [...(p.images ?? []), newImg] } : p
        ));
        setShowImgs((prev) => prev ? { ...prev, images: [...(prev.images ?? []), newImg] } : prev);
      };
      reader.readAsDataURL(file);
    });

    setTimeout(() => setUploading(false), 500);
    toast(`${files.length} image(s) added`, "success");
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteImage = (productId: string, imgId: string) => {
    setList((prev) => prev.map((p) =>
      p.id === productId ? { ...p, images: (p.images ?? []).filter((i) => i.id !== imgId) } : p
    ));
    setShowImgs((prev) => prev ? { ...prev, images: (prev.images ?? []).filter((i) => i.id !== imgId) } : prev);
    toast("Image deleted", "success");
  };

  const setPrimary = (productId: string, imgId: string) => {
    setList((prev) => prev.map((p) =>
      p.id === productId ? { ...p, images: (p.images ?? []).map((i) => ({ ...i, isPrimary: i.id === imgId })) } : p
    ));
    setShowImgs((prev) => prev ? { ...prev, images: (prev.images ?? []).map((i) => ({ ...i, isPrimary: i.id === imgId })) } : prev);
    toast("Primary image updated", "success");
  };

  const updateAlt = (productId: string, imgId: string, alt: string) => {
    setList((prev) => prev.map((p) =>
      p.id === productId ? { ...p, images: (p.images ?? []).map((i) => i.id === imgId ? { ...i, alt } : i) } : p
    ));
  };

  const S = {
    th: { padding: "11px 14px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "12px 14px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
    btn: (bg: string, color: string) => ({ padding: "5px 10px", background: bg, color, border: "none", borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }),
  };

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Products</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 0" }}>{list.length} products</p>
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
                    {/* Primary image thumb */}
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
                <td style={S.td}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: p.status === "active" ? "#dcfce7" : "#f1f5f9", color: p.status === "active" ? "#16a34a" : "#94a3b8" }}>{p.status}</span></td>
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
          <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 780, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 60px rgba(0,0,0,0.4)", fontFamily: "system-ui,sans-serif" }}>
            {/* Header */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#0f172a" }}>📸 Product Images</h3>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{showImages.name} · {(showImages.images ?? []).length} images</p>
              </div>
              <button onClick={() => setShowImgs(null)} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Close ✕</button>
            </div>

            {/* Upload area */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #f8fafc" }}>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ width: "100%", padding: "14px", border: "2px dashed #d4a373", borderRadius: 12, background: "#fffbf5", color: "#92400e", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {uploading ? "⏳ Uploading..." : "📁 Click to upload images (multiple allowed)"}
              </button>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, textAlign: "center" }}>JPG, PNG, WebP supported · Upload from your computer</p>
            </div>

            {/* Images grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              {(showImages.images ?? []).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
                  <p style={{ fontSize: 14 }}>No images yet. Upload your first image above.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {(showImages.images ?? []).map((img) => (
                    <div key={img.id} style={{ borderRadius: 12, border: img.isPrimary ? "2px solid #1b4332" : "1px solid #f1f5f9", overflow: "hidden", background: "#fafafa" }}>
                      {/* Image */}
                      <div style={{ position: "relative", paddingTop: "75%", background: "#f8fafc" }}>
                        <img
                          src={img.url}
                          alt={img.alt}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x225/f1f5f9/94a3b8?text=Image"; }}
                        />
                        {img.isPrimary && (
                          <span style={{ position: "absolute", top: 6, left: 6, background: "#1b4332", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>
                            ★ PRIMARY
                          </span>
                        )}
                      </div>
                      {/* Controls */}
                      <div style={{ padding: 10 }}>
                        <input
                          value={img.alt}
                          onChange={(e) => updateAlt(showImages.id, img.id, e.target.value)}
                          placeholder="Image description..."
                          style={{ width: "100%", padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 11, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 8 }}
                        />
                        <div style={{ display: "flex", gap: 5 }}>
                          {!img.isPrimary && (
                            <button onClick={() => setPrimary(showImages.id, img.id)}
                              style={{ flex: 1, padding: "5px 0", background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                              Set Primary
                            </button>
                          )}
                          <button onClick={() => deleteImage(showImages.id, img.id)}
                            style={{ padding: "5px 10px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 7, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Product Modal ──────────────────────────── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", fontFamily: "system-ui,sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{editing ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>×</button>
            </div>
            {[
              { label: "Product Name *", key: "name",  type: "text",   placeholder: "e.g. A2 Gir Cow Ghee" },
              { label: "Price (₹) *",   key: "price", type: "number", placeholder: "e.g. 899" },
              { label: "Stock Qty",     key: "stock", type: "number", placeholder: "e.g. 50"  },
              { label: "Badge",         key: "badge", type: "text",   placeholder: "e.g. Bestseller" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input type={f.type} value={form[f.key as keyof typeof form] as string} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", fontFamily: "inherit" }}>
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
