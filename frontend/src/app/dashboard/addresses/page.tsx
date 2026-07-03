"use client";
import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { Address } from "@/types";
import { userApi, ApiError } from "@/lib/api";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
].map((s) => ({ value: s, label: s }));

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    fullName: "", 
    phone: "", 
    addressLine1: "", 
    addressLine2: "", 
    city: "", 
    state: "", 
    postalCode: "" 
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAddresses();
      const mapped = (res.data ?? []).map((addr: any) => ({
        id: addr.id,
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country || "India",
        isDefault: addr.isDefault,
      }));
      setAddresses(mapped);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.addAddress({
        fullName: form.fullName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: "India",
      });
      toast.success("Address added successfully! 🌿");
      setShowForm(false);
      setForm({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" });
      loadAddresses();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to add address";
      toast.error(msg);
    }
  };

  const setDefault = async (id: string) => {
    try {
      await userApi.setDefaultAddress(id);
      toast.success("Default address updated");
      loadAddresses();
    } catch {
      toast.error("Failed to set default address");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      await userApi.deleteAddress(id);
      toast.info("Address removed");
      loadAddresses();
    } catch {
      toast.error("Failed to remove address");
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-gray-500 text-sm">Loading addresses...</p>
      </div>
    );
  }

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

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
          <p className="text-gray-500 text-sm mb-4">No addresses saved yet.</p>
          <Button size="sm" onClick={() => setShowForm(true)}>Add Address</Button>
        </div>
      ) : (
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
                <Button size="sm" variant="ghost" onClick={() => remove(addr.id)} className="text-red-500 hover:bg-red-50 gap-1">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

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
