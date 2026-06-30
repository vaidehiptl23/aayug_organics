import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: {
    default: "Aayug Organics – Pure. Natural. Organic.",
    template: "%s | Aayug Organics",
  },
  description:
    "Discover 100% pure, organic A2 Gir Cow Ghee, Raw Honey, Cold-Pressed Oils, and Organic Spices. Farm-fresh, lab-tested products delivered to your doorstep.",
  keywords: ["organic food", "A2 ghee", "raw honey", "cold-pressed oil", "organic spices", "ayurvedic"],
  openGraph: {
    siteName: "Aayug Organics",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#fcfbf7] antialiased dark:bg-gray-950">
        <Header />
        <main>{children}</main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
