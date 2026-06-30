"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Tag, Settings, LogOut, ChevronRight, TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/products",  label: "Products",   icon: Package },
  { href: "/admin/orders",    label: "Orders",     icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers",  icon: Users },
  { href: "/admin/coupons",   label: "Coupons",    icon: Tag },
  { href: "/admin/settings",  label: "Settings",   icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Only admin can access
  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user?.email !== "admin@aayugorganics.com") { router.push("/"); }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.email !== "admin@aayugorganics.com") return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#1b4332] min-h-screen flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-white font-bold text-sm">Aayug Organics</p>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
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
            <div className="h-8 w-8 rounded-full bg-[#d4a373] flex items-center justify-center text-[#1b4332] font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-white/50 text-[10px]">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
