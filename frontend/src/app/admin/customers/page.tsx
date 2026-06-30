"use client";
import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

const CUSTOMERS = [
  { id: "c-1", name: "Rahul Sharma",   email: "rahul@example.com",  phone: "9876543210", orders: 3, spent: 4200, joined: "2024-01-15", verified: true  },
  { id: "c-2", name: "Priya Mehta",    email: "priya@example.com",   phone: "9823456780", orders: 7, spent: 8900, joined: "2024-02-20", verified: true  },
  { id: "c-3", name: "Arjun Patel",    email: "arjun@example.com",   phone: "9812345678", orders: 2, spent: 1800, joined: "2024-03-05", verified: true  },
  { id: "c-4", name: "Sneha Nair",     email: "sneha@example.com",   phone: "9765432109", orders: 5, spent: 6500, joined: "2024-04-10", verified: false },
  { id: "c-5", name: "Rohit Gupta",    email: "rohit@example.com",   phone: "9754321098", orders: 1, spent: 899,  joined: "2024-05-15", verified: true  },
  { id: "c-6", name: "Anita Singh",    email: "anita@example.com",   phone: "9743210987", orders: 4, spent: 3600, joined: "2024-06-01", verified: true  },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <p className="text-sm text-gray-500">{CUSTOMERS.length} registered customers</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Customers", value: CUSTOMERS.length, color: "text-blue-600" },
          { label: "Verified",        value: CUSTOMERS.filter((c) => c.verified).length, color: "text-green-600" },
          { label: "Total Revenue",   value: formatPrice(CUSTOMERS.reduce((s, c) => s + c.spent, 0)), color: "text-[#1b4332]" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-5 dark:border-gray-700 dark:bg-gray-800">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Customer</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Phone</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Orders</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Total Spent</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Joined</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332] font-bold text-sm dark:bg-green-900/30 dark:text-green-400">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.phone}</td>
                <td className="px-5 py-4 font-semibold text-gray-700 dark:text-gray-300">{c.orders}</td>
                <td className="px-5 py-4 font-bold text-[#1b4332] dark:text-green-400">{formatPrice(c.spent)}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">{new Date(c.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {c.verified ? "✓ Verified" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Users className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
