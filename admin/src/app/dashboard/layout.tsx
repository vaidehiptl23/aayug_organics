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

const navItems = [
  { href: "/dashboard",           label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products",  label: "Products",  icon: Package },
  { href: "/dashboard/orders",    label: "Orders",    icon: ShoppingBag },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/coupons",   label: "Coupons",   icon: Tag },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [mobile, setMobile]    = useState(false);
  const [session, setSession]  = useState<{ email: string } | null>(null);

  useEffect(() => {
    const s = getAdminSession();
    if (!s) { router.push("/auth"); return; }
    setSession(s);
  }, [router]);

  const handleLogout = () => {
    clearAdminSession();
    router.push("/auth");
  };

  if (!session) return null;

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#1b4332]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Aayug Organics</p>
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobile(false)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {active && <ChevronRight className="h-3 w-3" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-[#d4a373] flex items-center justify-center text-[#1b4332] font-bold text-xs">
            A
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold">Administrator</p>
            <p className="text-white/50 text-[10px] truncate">{session.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col fixed inset-y-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setMobile(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="h-8 w-8 rounded-full bg-[#1b4332] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
