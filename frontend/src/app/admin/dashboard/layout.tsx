"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, LogOut, ChevronRight, Bell } from "lucide-react";
import { getAdminSession, clearAdminSession } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin/dashboard",            label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/products",   label: "Products",  icon: Package },
  { href: "/admin/dashboard/orders",     label: "Orders",    icon: ShoppingBag },
  { href: "/admin/dashboard/customers",  label: "Customers", icon: Users },
  { href: "/admin/dashboard/coupons",    label: "Coupons",   icon: Tag },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const s = getAdminSession();
    if (!s) { router.push("/admin/auth"); return; }
    setSession(s);
    setReady(true);
  }, [router]);

  if (!ready) return (
    <div style={{ minHeight: "100vh", background: "#1b4332", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: 220, minWidth: 220, background: "#1b4332", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40 }}>
        {/* Logo */}
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Link href="/" style={{ display: "block", textDecoration: "none", background: "white", padding: "6px", borderRadius: "8px" }}>
            <Image
              src="/logo.jpg"
              alt="Aayug Organics Logo"
              width={140}
              height={40}
              style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
              priority
            />
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 12px", borderRadius: 9, marginBottom: 2, textDecoration: "none",
                background: active ? "rgba(255,255,255,0.18)" : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.55)",
                fontSize: 13, fontWeight: active ? 600 : 400, transition: "all 0.15s",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <item.icon size={15} />
                  {item.label}
                </span>
                {active && <ChevronRight size={11} />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", marginBottom: 3 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#d4a373", display: "flex", alignItems: "center", justifyContent: "center", color: "#1b4332", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>A</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 11, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Administrator</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session?.email}</p>
            </div>
          </div>
          <button onClick={() => { clearAdminSession(); router.push("/admin/auth"); }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 9,
            padding: "8px 12px", borderRadius: 9, border: "none", cursor: "pointer",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500, fontFamily: "inherit",
          }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: "100vh" }}>
        {/* Topbar */}
        <header style={{ position: "sticky", top: 0, zIndex: 20, background: "white", borderBottom: "1px solid #f1f5f9", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontSize: 12, color: "#1b4332", textDecoration: "none", fontWeight: 500, padding: "5px 12px", background: "#f0fdf4", borderRadius: 8 }}>
              ← View Website
            </Link>
            <button style={{ position: "relative", padding: 8, borderRadius: 9, border: "none", background: "#f8fafc", cursor: "pointer", color: "#64748b" }}>
              <Bell size={16} />
              <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
            </button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1b4332", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12 }}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 24, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
