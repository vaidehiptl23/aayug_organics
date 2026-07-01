"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Tag, LogOut, ChevronRight, Menu, X, Bell,
} from "lucide-react";
import { getAdminSession, clearAdminSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",           label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products",  label: "Products",  icon: Package },
  { href: "/dashboard/orders",    label: "Orders",    icon: ShoppingBag },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/coupons",   label: "Coupons",   icon: Tag },
];

const SIDEBAR_W = 240; // px — single source of truth

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen]       = useState(false);
  const [session, setSession] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const s = getAdminSession();
    if (!s) { router.push("/auth"); return; }
    setSession(s);
  }, [router]);

  if (!session) return (
    <div className="min-h-screen bg-[#1b4332] flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        maxWidth: SIDEBAR_W,
        background: "#1b4332",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🌿</span>
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Aayug Organics</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 2 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 10, marginBottom: 2, textDecoration: "none",
                background: active ? "rgba(255,255,255,0.18)" : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.55)",
                fontSize: 13, fontWeight: 500, transition: "all 0.15s",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <item.icon size={16} />
                  {item.label}
                </span>
                {active && <ChevronRight size={12} />}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "#d4a373",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#1b4332", fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}>A</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Administrator</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{session.email}</p>
            </div>
          </div>
          <button onClick={() => { clearAdminSession(); router.push("/auth"); }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500,
          }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 39 }}
        />
      )}

      {/* ── Main content area ──────────────────────────────── */}
      <div style={{
        marginLeft: SIDEBAR_W,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: "100vh",
      }}>

        {/* Top bar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "white", borderBottom: "1px solid #f1f5f9",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ position: "relative", padding: 8, borderRadius: 10, border: "none", background: "#f8fafc", cursor: "pointer", color: "#64748b" }}>
              <Bell size={18} />
              <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
            </button>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#1b4332",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 13,
            }}>A</div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 24, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
