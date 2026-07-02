import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aayug Organics – Pure. Natural. Organic.",
    template: "%s | Aayug Organics",
  },
  description:
    "Discover 100% pure, organic A2 Gir Cow Ghee, Raw Honey, Cold-Pressed Oils, and Organic Spices.",
  keywords: ["organic food", "A2 ghee", "raw honey", "organic spices", "ayurvedic"],
  openGraph: {
    siteName: "Aayug Organics",
    locale: "en_IN",
    type: "website",
  },
};

/**
 * Root layout — minimal wrapper.
 * The /admin route has its OWN layout (admin/layout.tsx) with its own
 * <html><body> which overrides this one completely for admin pages.
 * All other routes get Header + Footer via the template below.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#fcfbf7] antialiased dark:bg-gray-950">
        {children}
      </body>
    </html>
  );
}
