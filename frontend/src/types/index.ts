// ─── Product ────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  weight?: string;
  sku: string;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  emoji: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export type WishlistItem = Product;

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface TrackingEvent {
  status: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: Address;
  tracking: TrackingEvent[];
  paymentMethod: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinedDate: string;
}

// ─── Checkout ────────────────────────────────────────────────────────────────

export type CheckoutStep = "address" | "delivery" | "payment" | "review";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryMethod: "standard" | "express" | "overnight";
  paymentMethod: "card" | "upi" | "cod" | "netbanking";
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  upiId: string;
  saveAddress: boolean;
}
