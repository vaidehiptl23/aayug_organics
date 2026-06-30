"use client";
import { useState } from "react";
import { Search, Users, Mail, Phone } from "lucide-react";
import { CUSTOMERS } from "@/data/mock";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const filtered = CUSTOMERS.filter((c) => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" ? true : filter === "verified" ? c.verified : !c.verified;
    return ms && mf;
  });

  const totalSpent = CUSTOMERS.reduce((s, c) => s + c.spent, 0);
  const avgSpend   = Math.round(totalSpent / CUSTOMERS.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500">{CUSTOMERS.length} registered customers</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "Total",       value: CUSTOMERS.length,                            color: "text-gray-800"    },
          { label: "Verified",    value: CUSTOMERS.filter((c) => c.verified).length,  color: "text-green-600"   },
          { label: "Total Revenue", value: formatPrice(totalSpent),                   color: "text-[#1b4332]"   },
          { label: "Avg. Spend",  value: formatPrice(avgSpend),                       color: "text-purple-600"  },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1b4332]" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["all", "verified", "unverified"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all", filter === f ? "bg-white text-[#1b4332] shadow-sm" : "text-gray-500")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Customer", "Contact", "Orders", "Total Spent", "Joined", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332] font-bold text-sm shrink-0">
                      {c.name[0]}
                    </div>
                    <p className="font-medium text-gray-800">{c.name}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500"><Mail className="h-3 w-3" />{c.email}</span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500"><Phone className="h-3 w-3" />{c.phone}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-gray-700">{c.orders}</td>
                <td className="px-5 py-4 font-bold text-[#1b4332]">{formatPrice(c.spent)}</td>
                <td className="px-5 py-4 text-xs text-gray-500">
                  {new Date(c.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4">
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", c.verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                    {c.verified ? "✓ Verified" : "⏳ Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Users className="h-10 w-10 text-gray-200" />
            <p className="text-gray-400">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
