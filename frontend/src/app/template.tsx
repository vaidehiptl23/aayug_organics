"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth.store";

/**
 * Template wraps every page EXCEPT /admin/* routes.
 * Admin pages get their own isolated layout via app/admin/layout.tsx.
 */
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    if (mounted && !isAuthenticated && !isAuthPage && !isAdmin) {
      router.push("/auth/login");
    }
  }, [mounted, isAuthenticated, isAuthPage, isAdmin, router]);

  if (isAdmin) {
    // Admin pages: no header, no footer — admin/layout.tsx handles everything
    return <>{children}</>;
  }

  // Prevent rendering children of protected routes before client-side hydration or if not authenticated
  if (!mounted) return null;
  if (!isAuthenticated && !isAuthPage) return null;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ToastContainer />
    </>
  );
}
