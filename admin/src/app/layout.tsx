import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aayug Organics — Admin Panel",
  description: "Admin dashboard for Aayug Organics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
