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
      { id: "s1", url: "https://placehold.co/600x600/e8b4b8/1b4332?text=Himalayan+Salt", alt: "Premium Himalayan Crystal Salt" },
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
      { id: "h1", url: "https://placehold.co/600x600/d4a373/1b4332?text=Forest+Honey", alt: "Raw Forest Honey jar" },
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
