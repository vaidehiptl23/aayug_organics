# 🌿 Aayug Organics – Frontend

Modern, production-quality e-commerce frontend built with **Next.js 16 App Router**, **TypeScript**, and **Tailwind CSS 4**.

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (cart, wishlist, auth) |
| Icons | Lucide React |
| Animation | Framer Motion |
| UI Utils | clsx + tailwind-merge + class-variance-authority |

---

## Quick Start

```bash
cd frontend

# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start development server
npm run dev
```

App runs at: **http://localhost:3000**

---

## Pages Built

| Page | Route |
|------|-------|
| 🏠 Home | `/` |
| 🛍️ Products Listing | `/products` |
| 📦 Product Detail | `/products/[slug]` |
| 🛒 Cart | `/cart` |
| 💳 Checkout (multi-step) | `/checkout` |
| 🔐 Login | `/auth/login` |
| 📝 Register | `/auth/register` |
| 🔑 Forgot Password | `/auth/forgot-password` |
| 📊 Dashboard | `/dashboard` |
| 📋 Orders | `/dashboard/orders` |
| 📄 Order Detail + Tracking | `/dashboard/orders/[id]` |
| 👤 Profile | `/dashboard/profile` |
| 📍 Addresses | `/dashboard/addresses` |
| ❤️ Wishlist (dashboard) | `/dashboard/wishlist` |
| 🔒 Change Password | `/dashboard/security` |
| ❤️ Wishlist (public) | `/wishlist` |
| ❌ 404 | `/anything-else` |

---

## Folder Structure

```
frontend/src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (Header + Footer + Toast)
│   ├── page.tsx              # Home page
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── wishlist/page.tsx
│   ├── not-found.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── products/
│   │   ├── page.tsx          # Products listing (with Suspense)
│   │   ├── ProductsClient.tsx
│   │   └── [slug]/           # Product detail
│   └── dashboard/            # Protected user dashboard
│       ├── layout.tsx        # Sidebar navigation
│       ├── page.tsx          # Overview
│       ├── orders/           # Order history + detail + tracking
│       ├── profile/          # Profile management
│       ├── addresses/        # Address book
│       ├── wishlist/         # Wishlist management
│       └── security/         # Change password
│
├── components/
│   ├── layout/               # Header, Footer
│   ├── home/                 # HeroBanner, CategorySection, FeaturedProducts…
│   ├── products/             # ProductCard
│   └── ui/                   # Button, Input, Select, Badge, StarRating, Skeleton, Toast
│
├── data/                     # Dummy JSON data
│   ├── products.ts           # 16 products + 4 categories + reviews
│   └── orders.ts             # 3 sample orders with tracking
│
├── lib/
│   └── utils.ts              # cn(), formatPrice(), debounce(), getStars()…
│
├── store/
│   ├── cart.store.ts         # Zustand cart (persisted)
│   ├── wishlist.store.ts     # Zustand wishlist (persisted)
│   └── auth.store.ts         # Zustand auth (persisted)
│
└── types/
    └── index.ts              # Full TypeScript interfaces
```

---

## Features

- ✅ Sticky header with search, cart badge, wishlist badge, user dropdown
- ✅ Hero carousel with auto-play and manual controls
- ✅ Product listing with filters (category, price, rating, stock) + sorting + pagination
- ✅ Grid / List view toggle
- ✅ Active filter chips with individual clear
- ✅ Product detail with image gallery, tabs (description/reviews/shipping)
- ✅ Cart with quantity controls, coupon codes, full price breakdown
- ✅ 4-step checkout with form validation and order confirmation screen
- ✅ Auth pages (login, register, forgot password) with show/hide password
- ✅ Protected dashboard with sidebar navigation
- ✅ Order history with tracking timeline
- ✅ Profile, addresses, wishlist, and change password screens
- ✅ Wishlist page with move-to-cart
- ✅ Toast notifications for all user actions
- ✅ Skeleton loaders for products listing
- ✅ Empty states on all list pages
- ✅ Full dark mode support via CSS variables
- ✅ Mobile-first responsive layouts
- ✅ Persisted cart + wishlist via localStorage (Zustand persist)
- ✅ Semantic HTML and ARIA attributes throughout

---

## Connecting to Backend

All data in `src/data/` is static dummy data. To connect to the backend API:

1. **Set up Supabase** — see `backend/README.md` (5 min setup, free)
2. **Configure backend** — fill in `backend/.env` with your Supabase URLs
3. **Run migrations** — `cd backend && npm run prisma:migrate && npm run prisma:seed`
4. **Start backend** — `cd backend && npm run dev` (runs on port 5000)
5. **Frontend** auto-calls `http://localhost:5000/api/v1` — already configured in `frontend/.env.local`

The login/register pages already call the real API and fall back to demo mode if the backend isn't running.
