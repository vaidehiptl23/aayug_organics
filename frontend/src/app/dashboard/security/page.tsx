"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

export default function SecurityPage() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k: keyof typeof show) => setShow((s) => ({ ...s, [k]: !s[k] }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.current) e.current = "Enter current password";
    if (form.newPwd.length < 8) e.newPwd = "Must be at least 8 characters";
    if (!/[A-Z]/.test(form.newPwd)) e.newPwd = "Must contain an uppercase letter";
    if (!/\d/.test(form.newPwd)) e.newPwd = "Must contain a number";
    if (form.newPwd !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setForm({ current: "", newPwd: "", confirm: "" });
    toast.success("Password changed successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Lock className="h-6 w-6 text-[#1b4332]" /> Change Password
      </h1>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <Input
            label="Current Password"
            type={show.current ? "text" : "password"}
            value={form.current}
            onChange={(e) => set("current", e.target.value)}
            error={errors.current}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={<button type="button" onClick={() => toggle("current")} aria-label="Toggle">{show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
          />
          <Input
            label="New Password"
            type={show.new ? "text" : "password"}
            value={form.newPwd}
            onChange={(e) => set("newPwd", e.target.value)}
            error={errors.newPwd}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={<button type="button" onClick={() => toggle("new")} aria-label="Toggle">{show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
            hint="Min. 8 chars, 1 uppercase, 1 number"
          />
          <Input
            label="Confirm New Password"
            type={show.confirm ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            error={errors.confirm}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={<button type="button" onClick={() => toggle("confirm")} aria-label="Toggle">{show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
          />

          {/* Strength indicator */}
          {form.newPwd && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => {
                  const strength = [form.newPwd.length >= 8, /[A-Z]/.test(form.newPwd), /\d/.test(form.newPwd), /[!@#$%^&*]/.test(form.newPwd)].filter(Boolean).length;
                  return <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? strength <= 1 ? "bg-red-400" : strength <= 2 ? "bg-amber-400" : strength <= 3 ? "bg-blue-400" : "bg-green-500" : "bg-gray-200"}`} />;
                })}
              </div>
              <p className="text-xs text-gray-500">Include uppercase, numbers & symbols for a stronger password</p>
            </div>
          )}

          <Button type="submit" loading={loading} className="mt-2">Update Password</Button>
        </form>
      </div>
    </div>
  );
}
