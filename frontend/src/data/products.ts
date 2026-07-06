import { Product, Category, Review } from "@/types";

// ─── Categories ───────────────────────────────────────────────

export const categories: Category[] = [
  { id: "cat-1", name: "Salt",  slug: "salt",  description: "Premium Himalayan Crystal Salt", image: "", productCount: 1, emoji: "🧂" },
  { id: "cat-2", name: "Honey", slug: "honey", description: "Raw unprocessed natural honey",  image: "", productCount: 1, emoji: "🍯" },
  { id: "cat-3", name: "Hing",  slug: "hing",  description: "Pure Asafoetida",                image: "", productCount: 1, emoji: "🌿" },
  { id: "cat-4", name: "Ghee",  slug: "ghee",  description: "Pure A2 Gir Cow Ghee",           image: "", productCount: 1, emoji: "🥛" },
];

// ─── Products ─────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: "p-1",
    name: "Premium Himalayan Crystal Salt",
    slug: "premium-himalayan-crystal-salt",
    description: "Harvested from ancient Himalayan salt mines, our Premium Himalayan Crystal Salt is 100% pure, unrefined and free from additives. Packed with 84+ natural trace minerals including calcium, magnesium, potassium and iron. A healthier alternative to processed table salt.",
    category: "Salt", categorySlug: "salt", brand: "Aayug Organics",
    price: 199, originalPrice: 249,
    images: [
      { id: "s1", url: "/products/salt/salt.jpg", alt: "Premium Himalayan Crystal Salt" },
      { id: "s2", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.14 PM (1).jpeg", alt: "Premium Himalayan Crystal Salt Image 2" },
      { id: "s3", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.14 PM.jpeg", alt: "Premium Himalayan Crystal Salt Image 3" },
      { id: "s4", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.15 PM (1).jpeg", alt: "Premium Himalayan Crystal Salt Image 4" },
      { id: "s5", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.15 PM (2).jpeg", alt: "Premium Himalayan Crystal Salt Image 5" },
      { id: "s6", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.15 PM.jpeg", alt: "Premium Himalayan Crystal Salt Image 6" },
      { id: "s7", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.16 PM (1).jpeg", alt: "Premium Himalayan Crystal Salt Image 7" },
      { id: "s8", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.16 PM.jpeg", alt: "Premium Himalayan Crystal Salt Image 8" },
      { id: "s9", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.17 PM.jpeg", alt: "Premium Himalayan Crystal Salt Image 9" },
      { id: "s10", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.44 PM (1).jpeg", alt: "Premium Himalayan Crystal Salt Image 10" },
      { id: "s11", url: "/products/salt/WhatsApp Image 2026-07-05 at 1.48.44 PM.jpeg", alt: "Premium Himalayan Crystal Salt Image 11" },
    ],
    badge: "Bestseller", rating: 4.8, reviewCount: 312,
    inStock: true, stockCount: 100, weight: "500g", sku: "SAL-HIM-001",
    tags: ["himalayan", "pink-salt", "mineral-rich"], isFeatured: true, isBestSeller: true,
  },
  {
    id: "p-2",
    name: "Raw Forest Honey",
    slug: "raw-forest-honey",
    description: "Pure raw honey collected from wild forest hives. Unheated, unfiltered and unpasteurised — retaining all natural enzymes, pollen, propolis and antioxidants. Rich floral aroma with a naturally thick texture. No sugar added, no preservatives.",
    category: "Honey", categorySlug: "honey", brand: "Aayug Organics",
    price: 549, originalPrice: 649,
    images: [
      { id: "h1", url: "/products/honey/honey.jpg", alt: "Raw Forest Honey jar" },
      { id: "h2", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.17 PM.jpeg", alt: "Raw Forest Honey Image 2" },
      { id: "h3", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.19 PM.jpeg", alt: "Raw Forest Honey Image 3" },
      { id: "h4", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.20 PM.jpeg", alt: "Raw Forest Honey Image 4" },
      { id: "h5", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.21 PM (1) - Copy.jpeg", alt: "Raw Forest Honey Image 5" },
      { id: "h6", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.21 PM.jpeg", alt: "Raw Forest Honey Image 6" },
      { id: "h7", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.22 PM (1).jpeg", alt: "Raw Forest Honey Image 7" },
      { id: "h8", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.22 PM.jpeg", alt: "Raw Forest Honey Image 8" },
      { id: "h9", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.23 PM.jpeg", alt: "Raw Forest Honey Image 9" },
      { id: "h10", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.24 PM (1).jpeg", alt: "Raw Forest Honey Image 10" },
      { id: "h11", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.25 PM (1).jpeg", alt: "Raw Forest Honey Image 11" },
      { id: "h12", url: "/products/honey/WhatsApp Image 2026-07-05 at 2.00.25 PM.jpeg", alt: "Raw Forest Honey Image 12" },
    ],
    badge: "Organic", rating: 4.9, reviewCount: 428,
    inStock: true, stockCount: 75, weight: "500g", sku: "HON-RAW-001",
    tags: ["raw", "forest-honey", "unfiltered", "organic"], isFeatured: true, isBestSeller: true,
  },
  {
    id: "p-3",
    name: "Pure Hing (Asafoetida)",
    slug: "pure-hing-asafoetida",
    description: "Sourced directly from Afghanistan — the finest quality compounded Hing (Asafoetida). Pure resin with no added starch or artificial fillers. Strong, authentic aroma with powerful digestive and anti-bloating properties. Just a pinch transforms any dal or sabzi.",
    category: "Hing", categorySlug: "hing", brand: "Aayug Organics",
    price: 299, originalPrice: 349,
    images: [
      { id: "hi1", url: "/products/hing/hing_1.jpg", alt: "Pure Hing Asafoetida Pouch" },
      { id: "hi2", url: "/products/hing/hing_2.jpg", alt: "Pure Hing Asafoetida Ingredients" },
      { id: "hi3", url: "/products/hing/hing_3.jpg", alt: "Pure Hing Asafoetida Banner" },
      { id: "hi4", url: "/products/hing/hing_4.jpg", alt: "Pure Hing Asafoetida Cooking" },
      { id: "hi5", url: "/products/hing/hing_5.jpg", alt: "Pure Hing Asafoetida Dish Delicious" },
      { id: "hi6", url: "/products/hing/hing_6.jpg", alt: "Pure Hing Asafoetida Comparison" },
      { id: "hi7", url: "/products/hing/hing_7.jpg", alt: "Pure Hing Asafoetida Pinnacle Taste" },
      { id: "hi8", url: "/products/hing/hing_8.jpg", alt: "Pure Hing Asafoetida Pinch Brings Life" },
      { id: "hi9", url: "/products/hing/hing_9.jpg", alt: "Pure Hing Asafoetida Health Benefits" },
      { id: "hi10", url: "/products/hing/hing_10.jpg", alt: "Pure Hing Asafoetida Directions" },
      { id: "hi11", url: "/products/hing/hing_11.jpg", alt: "Pure Hing Asafoetida Quality" },
    ],
    badge: "New", rating: 4.7, reviewCount: 189,
    inStock: true, stockCount: 60, weight: "50g", sku: "HNG-PUR-001",
    tags: ["hing", "asafoetida", "digestive", "ayurvedic"], isFeatured: true,
  },
  {
    id: "p-4",
    name: "A2 Gir Cow Ghee",
    slug: "a2-gir-cow-ghee",
    description: "Pure A2 Gir Cow Ghee made using the traditional Vedic Bilona method — hand-churned from curd set from A2 milk of indigenous Gir cows. Rich golden colour, grainy texture, and an irresistible nutty aroma. Loaded with vitamins A, D, E, K, Omega-3 fatty acids and CLA. No preservatives, no additives. Ideal for cooking, tempering, and Ayurvedic use.",
    category: "Ghee", categorySlug: "ghee", brand: "Aayug Organics",
    price: 899, originalPrice: 1099,
    images: [
      { id: "g1", url: "/products/ghee/ghee-front.jpeg",      alt: "A2 Gir Cow Ghee - Front View" },
      { id: "g2", url: "/products/ghee/ghee-back.jpeg",       alt: "A2 Gir Cow Ghee - Back Label" },
      { id: "g3", url: "/products/ghee/ghee-banner.jpeg",     alt: "A2 Gir Cow Ghee - Benefits" },
      { id: "g4", url: "/products/ghee/ghee-bilona.jpeg",     alt: "Bilona Method" },
      { id: "g5", url: "/products/ghee/ghee-why.jpeg",        alt: "Why Aayug Ghee is Better" },
      { id: "g6", url: "/products/ghee/ghee-choose.jpeg",     alt: "Why Choose Aayug" },
      { id: "g7", url: "/products/ghee/ghee-nutrition.jpeg",  alt: "Nutrition Facts" },
      { id: "g8", url: "/products/ghee/ghee-process.jpeg",    alt: "Traditional Process" },
      { id: "g9", url: "/products/ghee/ghee-benefits.jpeg",   alt: "Health Benefits" },
    ],
    badge: "Bestseller", rating: 4.9, reviewCount: 567,
    inStock: true, stockCount: 50, weight: "500ml", sku: "GHE-A2G-001",
    tags: ["a2-ghee", "bilona", "gir-cow", "vedic", "organic"], isFeatured: true, isBestSeller: true,
  },
];

// ─── Reviews ──────────────────────────────────────────────────

export const reviews: Review[] = [
  { id: "r-1", userId: "u-1", userName: "Priya Mehta",  rating: 5, title: "Best A2 Ghee ever!", body: "The aroma and flavour are incredible. You can immediately tell the difference from store-bought ghee.", date: "2024-11-15", verified: true  },
  { id: "r-2", userId: "u-2", userName: "Arjun Patel",  rating: 5, title: "Authentic Bilona ghee", body: "The grainy texture confirms it's made the right way. Worth every rupee.", date: "2024-10-28", verified: true  },
  { id: "r-3", userId: "u-3", userName: "Sneha Nair",   rating: 4, title: "Good quality", body: "Quality is excellent and packaging is great. Slightly expensive but worth it.", date: "2024-09-12", verified: true  },
  { id: "r-4", userId: "u-4", userName: "Rohit Sharma", rating: 5, title: "Pure and natural", body: "Kids love it on chapati. Will keep buying from Aayug Organics.", date: "2024-08-20", verified: false },
];

export const featuredProducts = products.filter((p) => p.isFeatured);
export const bestSellers      = products.filter((p) => p.isBestSeller);

export function getProductBySlug(slug: string)                   { return products.find((p) => p.slug === slug); }
export function getProductsByCategory(slug: string)              { return products.filter((p) => p.categorySlug === slug); }
export function getRelatedProducts(product: Product, limit = 3)  { return products.filter((p) => p.id !== product.id).slice(0, limit); }
