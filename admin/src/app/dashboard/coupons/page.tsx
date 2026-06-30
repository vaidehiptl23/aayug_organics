"use client";
import { useState } from "react";
import { Plus, Trash2, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

type Coupon = { id: string; code: string; type: "%" | "₹"; value: number; minOrder: number; limit: number; used: number; active: boolean; expires: string };

const INITIAL: Coupon[] = [
  { id: "c-1", code: "ORGANIC10", type: "%", value: 10, minOrder: 299,  limit: 1000, used: 234, active: true,  expires: "2025-12-31" },
  { id: "c-2", code: "WELCOME50", type: "₹", value: 50, minOrder: 299,  limit: 500,  used: 89,  active: true,  expires: "2025-06-30" },
  { id: "c-3", code: "SAVE100",   type: "₹", value: 100, minOrder: 999, limit: 200,  used: 12,  active: false, expires: "2025-03-31" },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({ code: "", type: "%", value: "", minOrder: "", limit: "", expires: "" });

  const toggleActive = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    toast("Coupon status updated", "success");
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast("Coupon deleted", "success");
  };

  const handleAdd = () => {
    if (!form.code || !form.value) return;
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`, code: form.code.toUpperCase(),
      type: form.type as "%" | "₹", value: Number(form.value),
      minOrder: Number(form.minOrder), limit: Number(form.limit),
      used: 0, active: true, expires: form.expires,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    toast("Coupon created!", "success");
    setShowAdd(false);
    setForm({ code: "", type: "%", value: "", minOrder: "", limit: "", expires: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">{coupons.length} coupons</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#1b4332] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a4f]">
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className={cn("rounded-2xl border-2 bg-white p-5 shadow-sm", c.active ? "border-[#1b4332]/20" : "border-gray-100 opacity-70")}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#1b4332]" />
                <span className="font-bold text-gray-800 text-lg">{c.code}</span>
              </div>
              <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                {c.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1b4332] mb-1">
              {c.type === "%" ? `${c.value}% OFF` : `₹${c.value} OFF`}
            </p>
            <p className="text-xs text-gray-400 mb-3">Min order: ₹{c.minOrder} · Expires: {c.expires}</p>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Usage</span>
                <span>{c.used}/{c.limit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#1b4332]" style={{ width: `${Math.min((c.used / c.limit) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(c.id)}
                className={cn("flex-1 py-2 rounded-xl text-xs font-semibold transition-all", c.active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-[#1b4332] text-white hover:bg-[#2d6a4f]")}>
                {c.active ? "Disable" : "Enable"}
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add coupon modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">Create Coupon</h3>
              <button onClick={() => setShowAdd(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code *</label>
                <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE20" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#1b4332]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
                  <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b4332]">
                    <option value="%">Percentage (%)</option>
                    <option value="₹">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Value *</label>
                  <input type="number" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                    placeholder={form.type === "%" ? "e.g. 10" : "e.g. 50"} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b4332]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Order (₹)</label>
                  <input type="number" value={form.minOrder} onChange={(e) => setForm((p) => ({ ...p, minOrder: e.target.value }))}
                    placeholder="299" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b4332]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Usage Limit</label>
                  <input type="number" value={form.limit} onChange={(e) => setForm((p) => ({ ...p, limit: e.target.value }))}
                    placeholder="100" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b4332]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                <input type="date" value={form.expires} onChange={(e) => setForm((p) => ({ ...p, expires: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b4332]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="flex-1 bg-[#1b4332] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#2d6a4f]">Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
