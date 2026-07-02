import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel — Aayug Organics",
    template: "%s | Admin",
  },
};

/**
 * Admin layout — completely isolated from the main website.
 * Returns its own <html><body> so the root layout's Header/Footer
 * are NOT included for any /admin/* route.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#f8fafc" }}>
        {children}
      </body>
    </html>
  );
}
