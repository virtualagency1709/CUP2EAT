# CUP2EAT – E-Commerce Website & Brand Platform
> **Tagline:** Eat Your Drink!  
> **Instagram:** [https://www.instagram.com/cup2eat/](https://www.instagram.com/cup2eat/)  
> **Founder / Contact:** Varun Khera  
> **Contact Number:** +91 9818192575  
> **Email:** Varunkhera6@gmail.com  

---

## ☕ 1. Project Overview

**CUP2EAT** is a modern, premium, fully functional food & beverage e-commerce platform dedicated to revolutionary **edible cookie and wafer cups**. Customers pour their favourite coffee, espresso, hot chocolate, tea, or milkshake into the cup, sip for over 45 minutes without leakage or sogginess, and then crunch the delicious Belgian chocolate-glazed cup! 100% Zero Waste, 100% Edible.

This project is a **real, production-ready, full-stack application** built with **Next.js (App Router)**, **React**, **Tailwind CSS**, a native **relational SQLite database** (zero external dependencies), **JWT authentication**, **Razorpay payment gateway integration**, **real-time order tracking**, **automatic tax invoice generation**, and an **exclusive secure Admin Panel**.

---

## 🎨 2. Design System & Brand Identity

- **Color Palette:**
  - **Cream / Warm Background:** `#FFFDF9`, `#FFF8EB`, `#FAF5EB`
  - **Vibrant Brand Orange:** `#FF5E1E` (Hover: `#E2490C`)
  - **Rich Chocolate Brown:** `#331B10` (Dark: `#211008`)
  - **Golden Biscuit / Amber:** `#F59E0B`, `#D97706`
  - **Berry Glaze:** `#E11D48`
- **Personality:** Fun, youthful, energetic, eco-friendly, appetising, premium yet accessible.
- **Micro-Interactions:** Smooth card hover elevations, interactive cart drawer, live search modal, animated celebration confetti on order confirmation, floating WhatsApp customer support widget.

---

## 🚀 3. Features & Pages Checklist

| # | Page / Module | Route | Key Functionality |
|---|---|---|---|
| 1 | **Home** | `/` | Hero section, Shop by Flavour, How to CUP2EAT (4 steps), Featured Products, Best Sellers, Brand Promise, Customer Reviews, Instagram Grid, Newsletter |
| 2 | **Shop / Catalog** | `/shop` | Live search, Category filters, Flavour filters, Max price slider, Sort (Popularity, Price, Rating, Newest) |
| 3 | **Product Details** | `/product/[slug]` | Multi-image gallery, Pack size selector, Flavour selector, Thermal specs (85°C & 45+ mins), Ingredients & Nutritional facts, Verified Reviews & "Write a Review" form, Related products |
| 4 | **Shopping Cart** | `/cart` | Item list, Quantity adjuster, Free delivery progress bar, Coupon engine (`WELCOME10`, `CUPDELIGHT`, `EATYOURDRINK`), GST (5%) & delivery charge calculator |
| 5 | **Checkout** | `/checkout` | Contact details, Shipping address, Order notes, Payment option toggle (Razorpay Online vs Cash on Delivery), Demo 1-Click Fast Fill |
| 6 | **Order Confirmation** | `/order-confirmation/[orderNumber]` | Animated confetti, Order summary, Delivery timeline, 1-Click "Download Tax Invoice", "Track Order", and WhatsApp support button |
| 7 | **Order Tracking** | `/track-order` | Track by Order Number and phone, 6-step visual timeline (*Placed &rarr; Confirmed &rarr; Processing &rarr; Packed &rarr; Out for Delivery &rarr; Delivered*), courier AWB |
| 8 | **Customer Login** | `/login` | Email/password login, password toggle, 1-Click Demo Fill (`customer@cup2eat.com`), Forgot Password modal |
| 9 | **Customer Register** | `/register` | Full Name, Email, Phone, Password, Confirm Password |
| 10 | **Customer Dashboard** | `/account` | My Profile, Manage Saved Addresses, Order History with 1-click Invoice download, Wishlist manager, Change Password |
| 11 | **Wishlist** | `/wishlist` | Heart toggle on all cards, instant add to cart |
| 12 | **About Us** | `/about` | Story behind "Eat Your Drink!", environmental mission (eliminating single-use cups), founder profile, quality standards |
| 13 | **Contact Us** | `/contact` | Working contact form (saves to DB), WhatsApp chat link, direct phone and email |
| 14 | **FAQ** | `/faq` | Expandable accordions answering temperature, sogginess, vegetarian certification, shelf life, and bulk café orders |
| 15 | **Tax Invoice** | `/invoice/[orderNumber]` | Clean, professional printable/PDF invoice with CUP2EAT branding, GSTIN, itemized rates, taxes, and authorized signature |
| 16 | **Admin Login** | `/admin/login` | Secure portal login with 1-Click Seed Credentials fill (`admin@cup2eat.com` / `admin123`) |
| 17 | **Admin Dashboard** | `/admin` | Overview KPIs, Order status updater & courier assigner, Product CRUD with image upload, Real-time Inventory stock adjustment & audit logs, Coupon creator, Inquiries viewer, Store settings |
| 18 | **Policies** | `/privacy-policy`, `/terms`, `/refund-policy`, `/shipping-policy` | Compliant Indian F&B e-commerce policies |

---

## 🛠️ 4. Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React Icons, Canvas Confetti
- **Backend:** Next.js Server API Route Handlers
- **Database:** Native relational SQLite (`node:sqlite`) with automatic schema initialization and seeding in `cup2eat.db`
- **Authentication:** JWT sessions via HTTP-Only Cookies + bcryptjs password hashing
- **Payment Gateway:** Razorpay (Server-side order creation + HMAC SHA-256 signature verification)
- **WhatsApp Support:** Official Click-to-Chat deep links for number `9818192575`
- **SEO & Social:** XML Sitemap, Robots.txt, JSON-LD Organization Schema, OpenGraph meta tags

---

## 🗄️ 5. Relational Database Schema (25 Tables)

The database `cup2eat.db` is automatically created, indexed, and populated on first run:

1. `users` – Customer accounts (name, email, phone, password_hash, role)
2. `admin_users` – Secure administrative personnel
3. `products` – Edible cup catalog (name, slug, prices, sku, stock, specs)
4. `categories` – Product categories (Cookie cups, Wafer cups, Kits, etc.)
5. `flavours` – Signature flavours (Chocolate, Vanilla, Biscoff, etc.)
6. `product_images` – Multi-image gallery with sort order
7. `product_variants` – Pack sizes & flavour combinations
8. `carts` – Persistent user/session carts
9. `cart_items` – Line items in cart with unit prices
10. `orders` – Master order table (order number, customer details, totals, status)
11. `order_items` – Products included in an order
12. `payments` – Payment transactions, Razorpay IDs, and statuses
13. `invoices` – Legal tax invoices (GST, totals, JSON itemized list)
14. `addresses` – Customer saved delivery addresses
15. `coupons` – Promo codes, discount percentage/fixed, min order value
16. `coupon_usage` – History of coupon redemptions
17. `inventory` – Real-time stock levels and safety stock thresholds
18. `inventory_logs` – Audit trail for every restock and deduction
19. `order_tracking` – Step-by-step shipment timeline events
20. `reviews` – Customer star ratings and verified buyer feedback
21. `wishlists` – User wishlist container
22. `wishlist_items` – Saved product references
23. `newsletter_subscribers` – Email subscriber list
24. `contact_messages` – Inquiries submitted via Contact Us form
25. `site_settings` – Dynamic configuration (announcement bar, phone, email, rates)

---

## 🔑 6. Default Demo Credentials

For quick testing and evaluation, both customer and admin portals include **1-Click Fill** buttons:

### Admin Portal (`/admin/login`)
- **Email:** `admin@cup2eat.com`
- **Password:** `admin123`
- **Role:** Super Admin

### Customer Account (`/login`)
- **Email:** `customer@cup2eat.com`
- **Password:** `customer123`
- **Name:** Priya Sharma

### Active Promo Codes
- `WELCOME10` – 10% OFF on all orders (Min order ₹299)
- `CUPDELIGHT` – Flat ₹100 OFF (Min order ₹599)
- `EATYOURDRINK` – 15% OFF for orders above ₹899
- `FREESHIP` – Free delivery coupon

### Demo Order ID for Tracking
- `C2E-2026-1001` (Track on `/track-order`)

---

## ⚙️ 7. Installation & Local Setup

### Prerequisites
- Node.js version 18.17+ (Fully tested on Node v20 and v24)
- npm version 9+

### Step-by-Step Instructions

1. **Clone or Navigate to the Project:**
   ```bash
   cd CUP2EAT
   ```

2. **Environment Variables:**
   A pre-configured `.env` file is included. You can customize `.env` using `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Build the Application:**
   ```bash
   npm run build
   ```

5. **Start Production Server:**
   ```bash
   npm start
   ```
   Open your browser at [http://localhost:3000](http://localhost:3000).

6. **Development Mode (with Hot Reload):**
   ```bash
   npm run dev
   ```

---

## 💳 8. Razorpay Payment Gateway Setup

The application features full **server-side Razorpay order creation and payment verification**:

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Settings &rarr; API Keys** and generate your **Key ID** and **Key Secret**.
3. Add them to your `.env` file:
   ```env
   RAZORPAY_KEY_ID="rzp_live_your_actual_key_id"
   RAZORPAY_KEY_SECRET="your_actual_key_secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_your_actual_key_id"
   ```
4. **Sandbox / Simulation Mode:** When dummy or mock keys are present, the checkout process automatically switches to a safe sandbox simulation so the full purchasing workflow can be tested without needing real banking credentials.

---

## 🌐 9. Hosting & Deployment Instructions

### Vercel Deployment (Recommended)
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import this repository.
4. Add the Environment Variables from `.env` in the Vercel dashboard.
5. Click **"Deploy"**.

### Railway / Render / VPS (Docker / Node)
1. In Railway or Render, select **Deploy from GitHub repo**.
2. Set Build Command: `npm run build`
3. Set Start Command: `npm start`
4. Set Port: `3000`

---

## 📞 10. Official Brand Contact Information

- **Brand:** CUP2EAT  
- **Tagline:** Eat Your Drink!  
- **Founder:** Varun Khera  
- **Phone:** +91 9818192575  
- **Email:** Varunkhera6@gmail.com  
- **Instagram:** [https://www.instagram.com/cup2eat/](https://www.instagram.com/cup2eat/)  

