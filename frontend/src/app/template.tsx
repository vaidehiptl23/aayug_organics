"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";

/**
 * Template wraps every page EXCEPT /admin/* routes.
 * Admin pages get their own isolated layout via app/admin/layout.tsx.
 */
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages: no header, no footer — admin/layout.tsx handles everything
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ToastContainer />
    </>
  );
}
