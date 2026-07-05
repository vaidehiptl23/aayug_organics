"use client";
import { useState, useEffect, useRef } from "react";
import { adminFetch } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/lib/toast";

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

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `http://localhost:5000${url}`;
  return `http://localhost:3000${url}`;
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

  // Local files preview and crop state
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; previewUrl: string }[]>([]);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  
  // Crop margins
  const [cropLeft, setCropLeft] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleImagesSubmit = async () => {
    if (!showImages || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (const f of selectedFiles) {
        formData.append("images", f.file);
      }
      const sessionStr = sessionStorage.getItem("admin_session");
      const token = sessionStr ? JSON.parse(sessionStr)?.token : null;
      const res = await fetch(`http://localhost:5000/api/v1/products/${showImages.id}/images`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      toast("Images uploaded successfully", "success");
      
      selectedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
      setSelectedFiles([]);
      loadData();
      setShowImgs(null);
    } catch {
      toast("Failed to upload images", "error");
    } finally {
      setUploading(false);
    }
  };

  const closeImageModal = () => {
    selectedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
    setSelectedFiles([]);
    setShowImgs(null);
  };

  useEffect(() => {
    if (cropIndex === null) return;
    const img = new Image();
    img.src = selectedFiles[cropIndex].previewUrl;
    imgRef.current = img;
    img.onload = () => {
      setCropLeft(0);
      setCropRight(0);
      setCropTop(0);
      setCropBottom(0);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const maxW = 400;
      const maxH = 300;
      let w = img.width;
      let h = img.height;
      
      if (w > maxW) {
        h = (maxW / w) * h;
        w = maxW;
      }
      if (h > maxH) {
        w = (maxH / h) * w;
        h = maxH;
      }
      
      canvas.width = w;
      canvas.height = h;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
      }
    };
  }, [cropIndex, selectedFiles]);

  const drawCropOverlay = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    
    const x = (cropLeft / 100) * w;
    const y = (cropTop / 100) * h;
    const cropW = w - x - ((cropRight / 100) * w);
    const cropH = h - y - ((cropBottom / 100) * h);
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, w, y);
    ctx.fillRect(0, y + cropH, w, h - y - cropH);
    ctx.fillRect(0, y, x, cropH);
    ctx.fillRect(x + cropW, y, w - x - cropW, cropH);
    
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cropW, cropH);
  };

  useEffect(() => {
    drawCropOverlay();
  }, [cropLeft, cropRight, cropTop, cropBottom]);

  const applyCrop = () => {
    if (cropIndex === null || !imgRef.current) return;
    const img = imgRef.current;
    
    const x = (cropLeft / 100) * img.width;
    const y = (cropTop / 100) * img.height;
    const w = img.width - x - ((cropRight / 100) * img.width);
    const h = img.height - y - ((cropBottom / 100) * img.height);
    
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const originalFile = selectedFiles[cropIndex].file;
      const croppedFile = new File([blob], originalFile.name, { type: originalFile.type || "image/jpeg" });
      const previewUrl = URL.createObjectURL(croppedFile);
      
      const updated = [...selectedFiles];
      URL.revokeObjectURL(updated[cropIndex].previewUrl);
      updated[cropIndex] = { file: croppedFile, previewUrl };
      
      setSelectedFiles(updated);
      setCropIndex(null);
      toast("Image cropped successfully", "success");
    }, selectedFiles[cropIndex].file.type || "image/jpeg", 0.95);
  };

  const handleImageDelete = async (productId: string, imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await adminFetch(`/products/${productId}/images/${imageId}`, {
        method: "DELETE"
      });
      toast("Image deleted successfully", "success");
      if (showImages) {
        const updatedImages = (showImages.images ?? []).filter(img => img.id !== imageId);
        setShowImgs({ ...showImages, images: updatedImages });
      }
      loadData();
    } catch {
      toast("Failed to delete image", "error");
    }
  };

  const handleSetPrimary = async (productId: string, imageId: string) => {
    try {
      await adminFetch(`/products/${productId}/images/${imageId}/primary`, {
        method: "PATCH"
      });
      toast("Primary image updated successfully", "success");
      if (showImages) {
        const updatedImages = (showImages.images ?? []).map(img => ({
          ...img,
          isPrimary: img.id === imageId
        }));
        setShowImgs({ ...showImages, images: updatedImages });
      }
      loadData();
    } catch {
      toast("Failed to update primary image", "error");
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
                          src={getImageUrl((p.images ?? []).find((i) => i.isPrimary)?.url ?? (p.images ?? [])[0]?.url)}
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
              <button onClick={closeImageModal} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>Close ✕</button>
            </div>

            <div style={{ padding: "16px 24px", borderBottom: "1px solid #f8fafc" }}>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ width: "100%", padding: "14px", border: "2px dashed #d4a373", borderRadius: 12, background: "#fffbf5", color: "#92400e", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                📁 Select images to upload (multiple allowed)
              </button>
            </div>

            {/* Pending uploads preview with Crop Option */}
            {selectedFiles.length > 0 && (
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", background: "#fdfbf7" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#92400e" }}>Pending Uploads ({selectedFiles.length})</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {selectedFiles.map((f, idx) => (
                    <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0", background: "white", padding: 6 }}>
                      <img src={f.previewUrl} alt="Preview" style={{ width: "100%", height: 60, objectFit: "cover", borderRadius: 6 }} />
                      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                        <button onClick={() => setCropIndex(idx)} style={{ flex: 1, padding: "4px 0", background: "#d4a373", color: "white", border: "none", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>Crop ✂️</button>
                        <button onClick={() => {
                          const updated = [...selectedFiles];
                          URL.revokeObjectURL(updated[idx].previewUrl);
                          updated.splice(idx, 1);
                          setSelectedFiles(updated);
                        }} style={{ padding: "4px 8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 4, fontSize: 10, cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                  <button onClick={handleImagesSubmit} disabled={uploading}
                    style={{ flex: 1, padding: "10px 14px", background: "#1b4332", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {uploading ? "⏳ Uploading..." : "💾 Save & Upload All Selected"}
                  </button>
                </div>
              </div>
            )}

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
                        <img src={getImageUrl(img.url)} alt={img.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          onClick={() => handleSetPrimary(showImages.id, img.id)}
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: img.isPrimary ? "#1b4332" : "rgba(255, 255, 255, 0.9)",
                            color: img.isPrimary ? "#fbbf24" : "#64748b",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            transition: "all 0.2s"
                          }}
                          title={img.isPrimary ? "Primary Image" : "Set as Primary"}
                        >
                          ★
                        </button>
                        <button
                          onClick={() => handleImageDelete(showImages.id, img.id)}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(220, 38, 38, 0.9)",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                          }}
                          title="Delete Image"
                        >
                          ✕
                        </button>
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
      {/* ── Image Cropper Modal ─────────────────────────────── */}
      {cropIndex !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 500, padding: 24, boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px", color: "#0f172a" }}>✂️ Crop Product Image</h3>
            
            <div style={{ display: "flex", justifyContent: "center", background: "#fafafa", borderRadius: 12, padding: 14, overflow: "hidden", maxHeight: 300 }}>
              <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", objectFit: "contain", borderRadius: 8, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }} />
            </div>
            
            {/* Crop Sliders */}
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                  <span>Crop Left</span> <span>{cropLeft}%</span>
                </label>
                <input type="range" min="0" max={100 - cropRight - 1} value={cropLeft} onChange={(e) => setCropLeft(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                  <span>Crop Right</span> <span>{cropRight}%</span>
                </label>
                <input type="range" min="0" max={100 - cropLeft - 1} value={cropRight} onChange={(e) => setCropRight(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                  <span>Crop Top</span> <span>{cropTop}%</span>
                </label>
                <input type="range" min="0" max={100 - cropBottom - 1} value={cropTop} onChange={(e) => setCropTop(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                  <span>Crop Bottom</span> <span>{cropBottom}%</span>
                </label>
                <input type="range" min="0" max={100 - cropTop - 1} value={cropBottom} onChange={(e) => setCropBottom(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => setCropIndex(null)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Cancel</button>
              <button onClick={applyCrop} style={{ background: "#ea580c", color: "white", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Apply Crop ✂️</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
