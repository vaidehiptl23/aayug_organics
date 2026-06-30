"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Package, X } from "lucide-react";
import { PRODUCTS } from "@/data/mock";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

type Product = typeof PRODUCTS[0];

export default function AdminProductsPage() {
  const [search, setSearch]   = useState("");
  const [list, setList]       = useState<Product[]>(PRODUCTS);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm]       = useState({ name: "", category: "Salt", price: "", stock: "", badge: "" });

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((p) => p.id !== id));
    toast("Product deleted", "success");
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editing) {
      setList((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p));
      toast("Product updated", "success");
    } else {
      const newProduct: Product = {
        id: `p-${Date.now()}`, name: form.name, category: form.category,
        price: Number(form.price), stock: Number(form.stock),
        rating: 0, reviews: 0, status: "active",
        sku: `${form.category.slice(0, 3).toUpperCase()}-NEW-${Date.now()}`,
        badge: form.badge,
      };
      setList((prev) => [...prev, newProduct]);
      toast("Product added", "success");
    }
    setShowAdd(false); setEditing(null);
    setForm({ name: "", category: "Salt", price: "", stock: "", badge: "" });
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), badge: p.badge });
    setShowAdd(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{list.length} products</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: "", category: "Salt", price: "", stock: "", badge: "" }); setShowAdd(true); }}
          className="flex items-center gap-2 bg-[#1b4332] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a4f] transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1b4332]" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Product", "Category", "Price", "Stock", "Rating", "Status", "Actions"].map((h) => (
                <th key={h} className={cn("px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide", h === "Actions" && "text-right")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">SKU: {p.sku}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332]">{p.category}</span>
                </td>
                <td className="px-5 py-4 font-bold text-[#1b4332]">{formatPrice(p.price)}</td>
                <td className="px-5 py-4">
                  <span className={cn("font-bold text-sm", p.stock < 20 ? "text-red-600" : "text-gray-700")}>{p.stock}</span>
                </td>
                <td className="px-5 py-4 text-amber-500 font-semibold text-sm">⭐ {p.rating}</td>
                <td className="px-5 py-4">
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold capitalize", p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#1b4332] hover:bg-green-50 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Package className="h-10 w-10 text-gray-200" />
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">{editing ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowAdd(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Product Name *", key: "name", placeholder: "e.g. A2 Gir Cow Ghee" },
                { label: "Price (₹) *",   key: "price", placeholder: "e.g. 899", type: "number" },
                { label: "Stock Qty *",    key: "stock", placeholder: "e.g. 50",  type: "number" },
                { label: "Badge",          key: "badge", placeholder: "e.g. Bestseller" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input
                    type={f.type ?? "text"}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b4332]">
                  {["Salt", "Honey", "Hing", "Ghee"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-[#1b4332] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#2d6a4f]">
                {editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
