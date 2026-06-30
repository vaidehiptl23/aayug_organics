# 🚀 Deploy Aayug Organics — Step by Step

This guide deploys:
- **Frontend** → Vercel (free) — https://your-app.vercel.app
- **Backend API** → Railway (free tier) — https://your-api.railway.app
- **Database** → Aiven MySQL (free tier) — already cloud-hosted

Total time: ~15 minutes

---

## STEP 1 — Push to GitHub

### 1a. Create a GitHub account
Go to https://github.com → Sign up (free)

### 1b. Create a new repository
1. Click **"+"** (top right) → **"New repository"**
2. Name it: `aayug-organics`
3. Set to **Public** (or Private)
4. Click **"Create repository"** — do NOT add README or .gitignore

### 1c. Push your code
Open a terminal in the project root folder and run:

```bash
git remote add origin https://github.com/YOUR-USERNAME/aayug-organics.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## STEP 2 — Set up Aiven MySQL (Database)

### 2a. Create free account
Go to https://aiven.io/free → Sign up with Google or email

### 2b. Create MySQL service
1. Click **"Create service"**
2. Choose **MySQL**
3. Choose **Free plan** (Hobbyist)
4. Pick region closest to you (e.g., `google-asia-south1` for India)
5. Click **"Create service"** — wait ~1 minute

### 2c. Get your connection string
1. Click your MySQL service
2. Go to **"Overview"** tab
3. Find **"Service URI"** — looks like:
   ```
   mysql://avnadmin:PASSWORD@mysql-xyz-abc.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED
   ```
4. Copy this — you'll need it in Steps 3 and 4

---

## STEP 3 — Deploy Backend to Railway

### 3a. Create Railway account
Go to https://railway.app → **"Login with GitHub"** → authorize

### 3b. Create new project
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select your `aayug-organics` repository
4. When asked, click **"Add service"** → select the repo

### 3c. Configure the backend service
1. Click on your service → **"Settings"** tab
2. Set **Root Directory** to: `backend`
3. Click **"Deploy"** (it will fail first time — that's fine, we need env vars)

### 3d. Add environment variables
Click your service → **"Variables"** tab → **"RAW Editor"** → paste ALL of this:

```
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1
FRONTEND_URL=https://your-app.vercel.app

DATABASE_URL=mysql://avnadmin:PASSWORD@HOST.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

JWT_ACCESS_SECRET=REPLACE-WITH-RANDOM-32-CHAR-STRING-1
JWT_REFRESH_SECRET=REPLACE-WITH-RANDOM-32-CHAR-STRING-2
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_EMAIL_SECRET=REPLACE-WITH-RANDOM-32-CHAR-STRING-3
JWT_EMAIL_EXPIRY=24h
JWT_RESET_SECRET=REPLACE-WITH-RANDOM-32-CHAR-STRING-4
JWT_RESET_EXPIRY=1h

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=Aayug Organics <noreply@aayugorganics.com>

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
RAZORPAY_WEBHOOK_SECRET=placeholder_webhook

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10

LOG_LEVEL=info
LOG_DIR=logs

FREE_SHIPPING_THRESHOLD=999
SHIPPING_CHARGE=99
TAX_RATE=0.18
BCRYPT_ROUNDS=12
```

**Important:** Replace:
- `DATABASE_URL` → your Aiven MySQL URI from Step 2
- `FRONTEND_URL` → your Vercel URL (you'll get this in Step 4 — update it after)
- `JWT_*_SECRET` → use https://generate-secret.vercel.app/32 to generate 4 random strings

### 3e. Redeploy
Click **"Deploy"** button. Wait 2-3 minutes. Check **"Logs"** tab for:
```
✅ Server running on port 5000
```

### 3f. Get your backend URL
Click **"Settings"** → **"Networking"** → **"Generate Domain"**
Your URL will be: `https://aayug-organics-XXXX.railway.app`

### 3g. Seed the database
In Railway → your service → **"Shell"** tab:
```bash
npm run prisma:seed
```

This loads all sample products, categories, and coupons.

---

## STEP 4 — Deploy Frontend to Vercel

### 4a. Create Vercel account
Go to https://vercel.com → **"Continue with GitHub"** → authorize

### 4b. Import your project
1. Click **"Add New Project"**
2. Click **"Import"** next to your `aayug-organics` repo
3. **IMPORTANT**: Set **Root Directory** to `frontend`
4. Expand **"Environment Variables"** and add:
   ```
   NEXT_PUBLIC_API_URL = https://aayug-organics-XXXX.railway.app/api/v1
   ```
   (Use your Railway URL from Step 3f)
5. Click **"Deploy"**

### 4c. Wait for deployment (~2 minutes)
Vercel will build and deploy automatically.
Your site will be live at: `https://aayug-organics.vercel.app`

### 4d. Update FRONTEND_URL in Railway
Go back to Railway → Variables → update:
```
FRONTEND_URL=https://aayug-organics.vercel.app
```
Trigger a redeploy (make any small change or click "Redeploy").

---

## ✅ You're Live!

| Service | URL |
|---------|-----|
| 🌐 Website | https://aayug-organics.vercel.app |
| ⚙️ API | https://aayug-organics-XXXX.railway.app/api/v1 |
| 📚 API Docs | https://aayug-organics-XXXX.railway.app/api-docs |
| ❤️ Health | https://aayug-organics-XXXX.railway.app/api/v1/health |

Share `https://aayug-organics.vercel.app` with anyone — it works from anywhere in the world!

---

## 🔑 Generate secure JWT secrets

Go to https://generate-secret.vercel.app/32 four times and use each output for:
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EMAIL_SECRET`
- `JWT_RESET_SECRET`

---

## 📧 Gmail SMTP setup

1. Gmail account → **Manage your Google Account**
2. **Security** tab → Turn on **2-Step Verification**
3. Search for **"App passwords"**
4. Select app: **Mail**, device: **Windows Computer**
5. Copy the 16-character password → use as `SMTP_PASS`

---

## 🔄 Auto-deploys

Every time you push to GitHub:
- Vercel **automatically rebuilds** the frontend
- Railway **automatically redeploys** the backend

---

## 💰 Cost

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | FREE |
| Railway | Starter ($5 credit/mo) | FREE for small projects |
| Aiven MySQL | Hobbyist | FREE |
| **Total** | | **₹0 / $0** |
