"use client";
import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { Address } from "@/types";

const INITIAL_ADDRESSES: Address[] = [
  { id: "a-1", fullName: "Rahul Sharma", phone: "9876543210", addressLine1: "42, Shanti Nagar, Satellite Road", city: "Ahmedabad", state: "Gujarat", postalCode: "380015", country: "India", isDefault: true },
  { id: "a-2", fullName: "Rahul Sharma", phone: "9876543210", addressLine1: "15, Green Park Colony", addressLine2: "Near Civil Hospital", city: "Surat", state: "Gujarat", postalCode: "395007", country: "India", isDefault: false },
];

const STATES = ["Gujarat", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Rajasthan", "Uttar Pradesh", "West Bengal"].map((s) => ({ value: s, label: s }));

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = { ...form, id: `a-${Date.now()}`, country: "India", isDefault: false };
    setAddresses((a) => [...a, newAddr]);
    setShowForm(false);
    setForm({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" });
    toast.success("Address added");
  };

  const setDefault = (id: string) => {
    setAddresses((a) => a.map((addr) => ({ ...addr, isDefault: addr.id === id })));
    toast.success("Default address updated");
  };

  const remove = (id: string) => {
    setAddresses((a) => a.filter((addr) => addr.id !== id));
    toast.info("Address removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="h-6 w-6 text-[#1b4332]" /> Saved Addresses
        </h1>
        <Button size="sm" onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className={`relative rounded-2xl border-2 bg-white p-5 dark:bg-gray-800 ${addr.isDefault ? "border-[#1b4332]" : "border-gray-100 dark:border-gray-700"}`}>
            {addr.isDefault && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#1b4332] px-2 py-0.5 text-[10px] font-bold text-white">
                <Star className="h-2.5 w-2.5 fill-current" /> Default
              </span>
            )}
            <p className="font-bold text-gray-800 dark:text-white">{addr.fullName}</p>
            <p className="text-sm text-gray-500">{addr.phone}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{addr.addressLine1}</p>
            {addr.addressLine2 && <p className="text-sm text-gray-600 dark:text-gray-400">{addr.addressLine2}</p>}
            <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city}, {addr.state} – {addr.postalCode}</p>
            <div className="mt-4 flex gap-2">
              {!addr.isDefault && (
                <Button size="sm" variant="outline" onClick={() => setDefault(addr.id)}>Set Default</Button>
              )}
              <Button size="sm" variant="ghost" className="gap-1">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(addr.id)} className="text-red-500 hover:bg-red-50 gap-1">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-5 font-bold text-gray-800 dark:text-white">New Address</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full Name *" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
            <Input label="Phone *" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
            <div className="sm:col-span-2">
              <Input label="Address Line 1 *" value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <Input label="Address Line 2" value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
            </div>
            <Input label="City *" value={form.city} onChange={(e) => set("city", e.target.value)} required />
            <Select label="State *" value={form.state} onChange={(e) => set("state", e.target.value)} options={[{ value: "", label: "Select State" }, ...STATES]} required />
            <Input label="PIN Code *" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} required maxLength={6} />
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Address</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
