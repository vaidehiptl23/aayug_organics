import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { PromoBanners } from "@/components/home/PromoBanners";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Aayug Organics – Pure. Natural. Organic.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <PromoBanners />
      <BestSellers />
      <NewsletterSection />
    </>
  );
}
