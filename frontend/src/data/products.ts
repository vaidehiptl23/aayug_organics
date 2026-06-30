import { Product, Category, Review } from "@/types";

// ─── Categories ───────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Salt",
    slug: "salt",
    description: "Premium Himalayan Crystal Salt — pure, mineral-rich, unrefined",
    image: "/images/categories/salt.jpg",
    productCount: 1,
    emoji: "🧂",
  },
  {
    id: "cat-2",
    name: "Honey",
    slug: "honey",
    description: "Raw, unprocessed natural honey straight from the hive",
    image: "/images/categories/honey.jpg",
    productCount: 1,
    emoji: "🍯",
  },
  {
    id: "cat-3",
    name: "Hing",
    slug: "hing",
    description: "Pure Asafoetida — the king of Indian spices",
    image: "/images/categories/hing.jpg",
    productCount: 1,
    emoji: "🌿",
  },
  {
    id: "cat-4",
    name: "Ghee",
    slug: "ghee",
    description: "Pure A2 Gir Cow Ghee made with traditional Bilona method",
    image: "/images/categories/ghee.jpg",
    productCount: 1,
    emoji: "🥛",
  },
];

// ─── Products ─────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: "p-1",
    name: "Premium Himalayan Crystal Salt",
    slug: "premium-himalayan-crystal-salt",
    description:
      "Harvested from ancient Himalayan salt mines, our Premium Himalayan Crystal Salt is 100% pure, unrefined and free from additives. Packed with 84+ natural trace minerals including calcium, magnesium, potassium and iron. The beautiful pink colour comes naturally from iron oxide. Perfect for cooking, seasoning, and Ayurvedic wellness rituals. A healthier alternative to processed table salt.",
    category: "Salt",
    categorySlug: "salt",
    brand: "Aayug Organics",
    price: 199,
    originalPrice: 249,
    images: [
      {
        id: "img-1a",
        url: "https://placehold.co/600x600/e8b4b8/1b4332?text=Himalayan+Salt",
        alt: "Premium Himalayan Crystal Salt",
      },
      {
        id: "img-1b",
        url: "https://placehold.co/600x600/f4c2c2/1b4332?text=Salt+Crystals",
        alt: "Pink salt crystals close up",
      },
      {
        id: "img-1c",
        url: "https://placehold.co/600x600/fce4ec/1b4332?text=84+Minerals",
        alt: "84 trace minerals",
      },
    ],
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    stockCount: 100,
    weight: "500g",
    sku: "SAL-HIM-001",
    tags: ["himalayan", "pink-salt", "mineral-rich", "unrefined", "organic"],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: "p-2",
    name: "Raw Forest Honey",
    slug: "raw-forest-honey",
    description:
      "Pure raw honey collected from wild forest hives deep in the Western Ghats. Unheated, unfiltered and unpasteurised — retaining all natural enzymes, pollen, propolis and antioxidants. Rich floral aroma with a naturally thick texture. No sugar added, no preservatives, no artificial flavours. A true farm-to-table honey that boosts immunity and energy naturally.",
    category: "Honey",
    categorySlug: "honey",
    brand: "Aayug Organics",
    price: 549,
    originalPrice: 649,
    images: [
      {
        id: "img-2a",
        url: "https://placehold.co/600x600/d4a373/1b4332?text=Forest+Honey",
        alt: "Raw Forest Honey jar",
      },
      {
        id: "img-2b",
        url: "https://placehold.co/600x600/c9a85c/ffffff?text=Honey+Pour",
        alt: "Honey dripping naturally",
      },
      {
        id: "img-2c",
        url: "https://placehold.co/600x600/e8c870/1b4332?text=Raw+Unfiltered",
        alt: "Raw unfiltered honey",
      },
    ],
    badge: "Organic",
    rating: 4.9,
    reviewCount: 428,
    inStock: true,
    stockCount: 75,
    weight: "500g",
    sku: "HON-RAW-001",
    tags: ["raw", "forest-honey", "unfiltered", "organic", "natural"],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: "p-3",
    name: "Pure Hing (Asafoetida)",
    slug: "pure-hing-asafoetida",
    description:
      "Sourced directly from Afghanistan — the finest quality compounded Hing (Asafoetida) available. Our Hing is made from pure resin with no added starch or artificial fillers. Strong, authentic aroma with powerful digestive and anti-bloating properties. Used in Ayurveda for centuries as a digestive aid. Just a pinch transforms any dal, sabzi or rice dish.",
    category: "Hing",
    categorySlug: "hing",
    brand: "Aayug Organics",
    price: 299,
    originalPrice: 349,
    images: [
      {
        id: "img-3a",
        url: "https://placehold.co/600x600/8b6914/ffffff?text=Pure+Hing",
        alt: "Pure Hing Asafoetida",
      },
      {
        id: "img-3b",
        url: "https://placehold.co/600x600/a0792e/ffffff?text=Hing+Resin",
        alt: "Hing resin close up",
      },
      {
        id: "img-3c",
        url: "https://placehold.co/600x600/c9a85c/1b4332?text=No+Fillers",
        alt: "No fillers pure hing",
      },
    ],
    badge: "New",
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    stockCount: 60,
    weight: "50g",
    sku: "HNG-PUR-001",
    tags: ["hing", "asafoetida", "digestive", "ayurvedic", "pure"],
    isFeatured: true,
    isBestSeller: false,
  },
  {
    id: "p-4",
    name: "A2 Gir Cow Ghee",
    slug: "a2-gir-cow-ghee",
    description:
      "Pure A2 Gir Cow Ghee made using the traditional Vedic Bilona method — hand-churned from curd set from A2 milk of indigenous Gir cows. Rich golden colour, grainy texture, and an irresistible nutty aroma confirm its authenticity. Loaded with vitamins A, D, E, K, Omega-3 fatty acids and CLA. No preservatives, no additives — just pure Bilona ghee. Ideal for cooking, tempering, and Ayurvedic use.",
    category: "Ghee",
    categorySlug: "ghee",
    brand: "Aayug Organics",
    price: 899,
    originalPrice: 1099,
    images: [
      {
        id: "img-4a",
        url: "https://placehold.co/600x600/1b4332/ffffff?text=A2+Gir+Ghee",
        alt: "A2 Gir Cow Ghee jar",
      },
      {
        id: "img-4b",
        url: "https://placehold.co/600x600/2d6a4f/ffffff?text=Bilona+Method",
        alt: "Bilona method ghee",
      },
      {
        id: "img-4c",
        url: "https://placehold.co/600x600/d4a373/1b4332?text=Golden+Ghee",
        alt: "Golden pure ghee",
      },
    ],
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 567,
    inStock: true,
    stockCount: 50,
    weight: "500ml",
    sku: "GHE-A2G-001",
    tags: ["a2-ghee", "bilona", "gir-cow", "vedic", "organic"],
    isFeatured: true,
    isBestSeller: true,
  },
];

// ─── Reviews ──────────────────────────────────────────────────

export const reviews: Review[] = [
  {
    id: "r-1",
    userId: "u-1",
    userName: "Priya Mehta",
    rating: 5,
    title: "Best A2 Ghee I have ever tasted!",
    body: "The aroma and flavour are incredible. You can immediately tell the difference from store-bought ghee. My entire family loves it. Will definitely reorder!",
    date: "2024-11-15",
    verified: true,
  },
  {
    id: "r-2",
    userId: "u-2",
    userName: "Arjun Patel",
    rating: 5,
    title: "Himalayan Salt is pure and authentic",
    body: "The pink colour and mineral taste confirms this is real Himalayan salt. No bitter aftertaste like regular salt. Switched completely to this.",
    date: "2024-10-28",
    verified: true,
  },
  {
    id: "r-3",
    userId: "u-3",
    userName: "Sneha Nair",
    rating: 5,
    title: "Honey is thick and pure",
    body: "The forest honey is exactly as described — raw, thick, and full of natural goodness. My kids love it on roti. No artificial sweetness.",
    date: "2024-09-12",
    verified: true,
  },
  {
    id: "r-4",
    userId: "u-4",
    userName: "Rohit Sharma",
    rating: 5,
    title: "Hing is extremely potent",
    body: "Just a tiny pinch is enough for an entire dal. Very strong and authentic. This is how hing used to smell and taste in my grandmother's kitchen.",
    date: "2024-08-20",
    verified: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────

export const featuredProducts = products.filter((p) => p.isFeatured);
export const bestSellers = products.filter((p) => p.isBestSeller);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}
