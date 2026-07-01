"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, Heart, User, Search, Menu, X,
  ChevronDown, LogOut, Package, Settings, Home,
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/products?category=ghee", label: "Ghee" },
  { href: "/products?category=honey", label: "Honey" },
  { href: "/products?category=oils", label: "Oils" },
  { href: "/products?category=spices", label: "Spices" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Must wait for client mount before reading localStorage-backed stores
  useEffect(() => { setMounted(true); }, []);

  const totalItems    = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  // Use 0 on server to avoid hydration mismatch — real values load after mount
  const cartCount     = mounted ? totalItems    : 0;
  const favCount      = mounted ? wishlistCount : 0;
  const { user, isAuthenticated, logout } = useAuthStore();

  // Hydration-safe derived values
  const authed = mounted ? isAuthenticated : false;

  // Search results
  const searchResults = searchQuery.length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md dark:bg-gray-900/95"
          : "bg-white dark:bg-gray-900"
      )}
    >
      {/* Top promo bar */}
      <div className="bg-[#1b4332] py-1.5 text-center text-xs font-medium text-white">
        🌿 Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code{" "}
        <span className="font-bold text-[#d4a373]">ORGANIC10</span> for 10% off
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🌿</span>
          <div>
            <span className="text-xl font-bold text-[#1b4332] dark:text-green-400">Aayug</span>
            <span className="text-xl font-bold text-[#d4a373]"> Organics</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#1b4332] dark:text-gray-300 dark:hover:text-green-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={`Wishlist (${favCount} items)`}
          >
            <Heart className="h-5 w-5" />
            {favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1b4332] text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Account menu"
              aria-expanded={userMenuOpen}
            >
              <User className="h-5 w-5" />
              {authed && (
                <span className="text-sm font-medium">{user?.firstName}</span>
              )}
              <ChevronDown className="h-3 w-3" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-gray-800"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                {authed ? (
                  <>
                    <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-700">
                      <Home className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-700">
                      <Package className="h-4 w-4" /> Orders
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-700">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    {user?.email === "admin@aayugorganics.com" && (
                      <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1b4332] hover:bg-green-50 dark:text-green-400">
                        🛡️ Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100 dark:border-gray-700" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-700">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-700">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search for ghee, honey, oils, spices…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
            {/* Suggestions */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 z-50">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-lg">{p.categorySlug === "ghee" ? "🥛" : p.categorySlug === "honey" ? "🍯" : p.categorySlug === "oils" ? "🫒" : "🌿"}</span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{p.name}</p>
                      <p className="text-xs text-gray-500">₹{p.price} · {p.category}</p>
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/products?search=${searchQuery}`}
                  onClick={() => setSearchOpen(false)}
                  className="block border-t border-gray-100 px-4 py-2.5 text-center text-xs font-medium text-[#1b4332] hover:bg-gray-50 dark:border-gray-700 dark:text-green-400"
                >
                  See all results for &ldquo;{searchQuery}&rdquo;
                </Link>
              </div>
            )}
            {searchQuery.length > 1 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-100 bg-white p-6 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500">No results for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1b4332] dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
            {authed ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300">Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth>Sign In</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <Button fullWidth>Create Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
