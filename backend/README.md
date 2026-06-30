# 🌿 Aayug Organics – Backend API

Production-ready REST API using **Node.js + Express + TypeScript + Prisma**.  
Database: **Supabase** (free hosted PostgreSQL — works in dev AND production without any changes).

---

## ⚡ Quick Start (5 minutes)

### Step 1 — Create a free Supabase database

1. Go to **https://supabase.com** → Sign up (free)
2. Click **"New project"** → fill in name, strong password, choose nearest region
3. Wait ~1 minute for the project to provision
4. Go to **Project Settings → Database → Connection string**
5. Copy two URLs:

| URL | Where to find it | Use for |
|-----|-----------------|---------|
| **Transaction pooler** | Connection string tab → `Transaction pooler` mode (port **6543**) | `DATABASE_URL` |
| **Direct connection** | Connection string tab → `Direct connection` mode (port **5432**) | `DIRECT_URL` |

### Step 2 — Configure environment

```bash
cd backend
cp .env.example .env
```

Open `.env` and paste the two URLs:

```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

> Replace `[ref]` and `[password]` with your actual project values.

### Step 3 — Install and migrate

```bash
npm install
npm run prisma:migrate      # Creates all tables in Supabase
npm run prisma:seed         # Inserts sample products, categories, coupons
```

### Step 4 — Start the server

```bash
npm run dev
```

| URL | Description |
|-----|-------------|
| http://localhost:5000/api/v1/health | Health check ✅ |
| http://localhost:5000/api-docs | Swagger UI 📚 |

---

## 🚀 Going Live

Because the database is already on Supabase, **deploying is just setting env vars**.

### Deploy to Railway (recommended — free tier available)

1. Push your code to GitHub
2. Go to **https://railway.app** → New Project → Deploy from GitHub
3. Select your repo, set these environment variables (same as your `.env`):
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_ACCESS_SECRET` (use a strong random value)
   - `JWT_REFRESH_SECRET`
   - ... (all other env vars)
4. Railway auto-detects Node.js and runs `npm start`
5. Done — your API is live 🎉

### Deploy to Render (also free tier)

1. New Web Service → connect GitHub repo
2. Build command: `npm install && npm run build && npm run prisma:migrate:prod`
3. Start command: `node dist/server.js`
4. Add environment variables

### Deploy to Vercel (serverless)

Not recommended for this Express API — use Railway or Render instead.  
The Next.js frontend deploys perfectly to Vercel.

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Runtime | Node.js 20 |
| Framework | Express.js 4 |
| Language | TypeScript 5 |
| ORM | Prisma 5 |
| Database | **Supabase** (hosted PostgreSQL) |
| Cache | Redis / Upstash (optional) |
| Auth | JWT (access + refresh tokens) |
| Email | Nodemailer / Gmail SMTP |
| Payments | Razorpay (provider pattern) |
| Validation | Zod |
| Docs | Swagger / OpenAPI 3 |
| Testing | Jest + Supertest |

---

## Optional: Free hosted Redis (for caching)

1. Go to **https://upstash.com** → New Database → free tier
2. Copy the Redis URL
3. Add to `.env`:
   ```env
   REDIS_HOST=your-host.upstash.io
   REDIS_PORT=6380
   REDIS_PASSWORD=your-token
   ```

Without Redis, the app works fine — caching is simply skipped.

---

## Project Structure

```
backend/src/
├── config/
│   ├── env.ts          # Typed env validation (Zod)
│   ├── database.ts     # Prisma client (Supabase-optimised)
│   └── redis.ts        # Redis client + cache helpers
├── controllers/        # Route handlers (thin layer)
├── services/           # Business logic
├── repositories/       # Database queries
├── routes/             # Express routers
├── middlewares/        # Auth, validate, rate-limit, upload
├── validators/         # Zod schemas
├── payments/           # Razorpay + COD provider pattern
├── emails/             # Nodemailer templates
├── swagger/            # OpenAPI spec
├── tests/              # Jest + Supertest
├── app.ts              # Express app setup
└── server.ts           # Entry point + graceful shutdown
```

---

## Default Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aayugorganics.com | Admin@123 |
| Customer | rahul@example.com | Customer@123 |

---

## API Endpoints (Summary)

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/products          ?category=ghee&sort=price_asc&page=1
GET    /api/v1/products/:id
GET    /api/v1/products/slug/:slug
GET    /api/v1/categories

GET    /api/v1/cart
POST   /api/v1/cart
PATCH  /api/v1/cart/:productId
DELETE /api/v1/cart/:productId

POST   /api/v1/orders/checkout
POST   /api/v1/orders/verify-payment
GET    /api/v1/orders/my-orders
PATCH  /api/v1/orders/my-orders/:id/cancel

GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/me/addresses
POST   /api/v1/users/me/addresses

GET    /api/v1/wishlist
POST   /api/v1/wishlist/:productId
DELETE /api/v1/wishlist/:productId

POST   /api/v1/coupons/validate

GET    /api/v1/admin/dashboard/stats    (Admin only)
```

Full docs at: **http://localhost:5000/api-docs**
