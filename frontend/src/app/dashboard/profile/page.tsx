"use client";
import { useState } from "react";
import { User, Camera } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser(form);
    setLoading(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <User className="h-6 w-6 text-[#1b4332]" /> My Profile
      </h1>

      {/* Avatar */}
      <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1b4332] text-2xl font-bold text-white">
            {form.firstName[0]}{form.lastName[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#d4a373] text-white shadow-md hover:bg-[#c9a85c] transition-colors" aria-label="Change avatar">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white">{form.firstName} {form.lastName}</p>
          <p className="text-sm text-gray-500">{form.email}</p>
          <p className="mt-1 text-xs text-gray-400">Member since {new Date(user?.joinedDate ?? "").toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-5 font-bold text-gray-800 dark:text-white">Personal Information</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          <Input label="Last Name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          <Input label="Email Address" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9876543210" />
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" loading={loading}>Save Changes</Button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-900 dark:bg-red-900/10">
        <h2 className="mb-2 font-bold text-red-700 dark:text-red-400">Delete Account</h2>
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data. This action cannot be undone.</p>
        <Button variant="danger" size="sm" onClick={() => toast.error("Contact support to delete your account")}>Delete Account</Button>
      </div>
    </div>
  );
}
