# Ummie's Essence — Development Rules & Priority Roadmap

> **Project:** Ummie's Essence
> **Stack:** Next.js (App Router) · Convex (Backend & Database) · M-Pesa Daraja API
> **Design:** Luxury cinematic UI with heavy scroll-triggered & 3D animations
> **Reference Docs:** `prd.md` · `designdoc.md` · `techstack.md` · `prompts.md`

---

## How to Use This File

- Each **Phase** is listed in priority order — complete them top-to-bottom.
- `[ ]` = not started · `[/]` = in progress · `[x]` = completed
- The **Prompts to Follow** column tells you which engineering directives from `prompts.md` apply to each task.

---

## Phase 1 — Project Setup & Foundation

> **Goal:** Get the project scaffolded, tooling configured, and running locally.
> **Prompts to Follow:** 🔐 1 (Global Engineering) · 🏗 3 (Architecture Consistency) · 🔄 9 (Deployment & Environment)

- [x] 1.1 Initialize Git repository with `.gitignore`
- [x] 1.2 Scaffold **Next.js** app (App Router, TypeScript strict mode)
- [x] 1.3 Install and initialize **Convex** (`npx convex dev`) — backend + real-time database
- [x] 1.4 Configure **TailwindCSS** + **shadcn/ui** in the frontend
- [x] 1.5 Create `.env.local` with Convex deployment URL and any API keys (no secrets committed)
- [x] 1.6 Set up **ESLint**, **Prettier**, and **Husky** pre-commit hooks
- [x] 1.7 Confirm the app runs locally (`npm run dev` + `npx convex dev`)

---

## Phase 2 — Database Schema & Models (Convex)

> **Goal:** Define every table your app needs before writing business logic.
> **Prompts to Follow:** 🧾 8 (Database Safety) · 🏗 3 (Architecture Consistency)

- [x] 2.1 Define Convex schema (`convex/schema.ts`) with all tables:
  - `users` (email, hashedPassword, role, createdAt, updatedAt)
  - `products` (name, slug, description, price, discount, stock, categoryId, images[], createdAt, updatedAt)
  - `categories` (name, slug)
  - `orders` (userId, status, totalAmount, shippingAddress, createdAt, updatedAt)
  - `orderItems` (orderId, productId, quantity, unitPrice)
  - `payments` (orderId, method, mpesaReceiptNumber, status, rawCallback, createdAt)
  - `cartItems` (userId, productId, quantity)
  - `wishlistItems` (userId, productId)
  - `reviews` (userId, productId, rating, comment, createdAt)
  - `coupons` (code, discountType, discountValue, expiresAt, usageLimit, usedCount)
- [x] 2.2 Add Convex indexes on: email, product slug, order status, payment transaction ID
- [x] 2.3 Push schema to Convex (`npx convex dev` auto-migrates)
- [ ] 2.4 Seed database with sample categories & test products (via Convex mutation)

---

## Phase 3 — Authentication & Security Layer

> **Goal:** Users can register, log in, and be authenticated. Admin role exists.
> **Prompts to Follow:** 🛡 2 (Security Enforcement) · 🔐 1 (Global Engineering) · 🧪 6 (Code Quality)

- [x] 3.1 Set up **Convex Auth** (or custom auth with JWT via Convex actions)
- [x] 3.2 Implement **registration** mutation (email + bcrypt-hashed password)
- [x] 3.3 Implement **login** mutation (verifies password, returns session/token)
- [x] 3.4 Implement **auth middleware** — helper to validate identity in Convex functions
- [x] 3.5 Implement **role-based access control** (Admin vs Customer checks in mutations/queries)

- [ ] 3.6 Implement **password reset** flow (token-based, via Convex action + email)
- [ ] 3.7 Add **rate limiting** logic on auth-related actions
- [ ] 3.8 Write unit tests for auth logic

---

## Phase 4 — Product Catalog (Convex Functions)

> **Goal:** Full CRUD for products and categories, with search & filtering.
> **Prompts to Follow:** ⚡ 4 (Performance) · 🏗 3 (Architecture) · 🧪 6 (Code Quality)

- [x] 4.1 Create product **queries** (list all with pagination, get by slug, filter by category/price/gender/popularity)
- [x] 4.2 Create product **mutations** (create, update, soft-delete — admin only)
- [x] 4.3 Implement **search with autocomplete** query
- [x] 4.4 Create category **queries** and **mutations** (CRUD, admin-only write)
- [x] 4.5 Add **image upload** using **Convex file storage** (or Cloudinary via action)
- [x] 4.6 Write unit tests for product query/mutation logic

---

## Phase 5 — Cart, Wishlist & Reviews (Convex Functions)

> **Goal:** Customers can manage their cart, wishlist, and leave reviews.
> **Prompts to Follow:** 🛡 2 (Security) · 🧾 8 (Database Safety)

- [x] 5.1 Cart **mutations** — add, remove, update quantity; **query** — get user's cart
- [x] 5.2 Wishlist **mutations** — add, remove; **query** — get user's wishlist
- [x] 5.3 Reviews **mutation** — create review (authenticated); **query** — get product reviews (public)
- [x] 5.4 Ensure all cart/wishlist functions validate the authenticated user
- [x] 5.5 Write unit tests

---

## Phase 6 — Order & Checkout System (Convex Functions)

> **Goal:** Create orders, deduct stock atomically, calculate totals, apply coupons.
> **Prompts to Follow:** 🧾 8 (Database Safety) · 🛡 2 (Security) · ⚡ 4 (Performance)

- [x] 6.1 Create order **mutation** (atomically: create order + create order items + deduct stock)
- [x] 6.2 Prevent negative stock (validation inside mutation before deducting)
- [x] 6.3 Implement **coupon application** mutation (percentage & fixed discount, expiry, usage limits)
- [x] 6.4 Implement order status update mutation (Pending → Paid → Shipped → Delivered)
- [x] 6.5 Admin: query all orders, filter by status (CSV export deferred to Dashboard)
- [x] 6.6 Customer: query own order history
- [x] 6.7 Write unit tests

---

## Phase 7 — M-Pesa Payment Integration (Convex Actions + HTTP Routes)

> **Goal:** Customers pay via M-Pesa STK Push. Secure webhook handles Safaricom callbacks.
> **Prompts to Follow:** 💳 5 (M-Pesa Safety) · 🛡 2 (Security) · 🧾 8 (Database Safety)

- [ ] 7.1 Create payments Convex **action** for Daraja API integration
- [ ] 7.2 Implement Daraja API **access token generation** (server-side Convex action only)
- [ ] 7.3 Implement **STK Push** trigger action (called from frontend after order creation)
- [ ] 7.4 Implement **Convex HTTP route** as the M-Pesa callback/webhook endpoint:
  - Validate Safaricom callback data
  - Log raw callback
  - Idempotency check (prevent duplicate processing)
  - Update order status only on verified success (via internal mutation)
- [ ] 7.5 Handle timeout & failure scenarios gracefully
- [ ] 7.6 Store all transaction logs in `payments` table
- [ ] 7.7 Write integration tests for the payment flow

---

## Phase 8 — Email System (Convex Actions)

> **Goal:** Automated transactional emails for order lifecycle.
> **Prompts to Follow:** 🔐 1 (Global Engineering) · 📊 10 (Analytics Safety)

- [ ] 8.1 Integrate **Resend** (or SendGrid) via Convex **actions** for email delivery
- [ ] 8.2 **Order confirmation** email on successful payment
- [ ] 8.3 **Shipping notification** email on status change
- [ ] 8.4 **Abandoned cart recovery** — Convex **scheduled function** (cron) to email users with items left in cart
- [ ] 8.5 Email templates (clean, branded HTML)
- [ ] 8.6 Write unit tests

---

## Phase 9 — Frontend: Design System & Layout

> **Goal:** Build the visual foundation — typography, colors, global layout, navigation.
> **Prompts to Follow:** 🎨 7 (Animation Control) · ⚡ 4 (Performance) · 🏗 3 (Architecture)

- [ ] 9.1 Define **luxury color palette** (neutrals, golds, dark tones) in Tailwind config
- [ ] 9.2 Set up **Google Fonts** (serif headline + clean sans-serif body)
- [ ] 9.3 Build **global layout**: Header (nav), main content area, Footer
- [ ] 9.4 Build **Navigation bar** component (Home, Shop, Categories, About, Contact, Cart, Account)
- [ ] 9.5 Build **Footer** component (newsletter signup, quick links, brand typography)
- [ ] 9.6 Add **`prefers-reduced-motion`** media query support globally
- [ ] 9.7 Configure `next/image` with Cloudinary/Convex file storage loader for optimized images

---

## Phase 10 — Frontend: Homepage (All Sections)

> **Goal:** Build the full cinematic homepage per the design doc.
> **Prompts to Follow:** 🎨 7 (Animation) · ⚡ 4 (Performance)

- [ ] 10.1 **Section 1 — Hero:** Full-screen image, serif headline, parallax, animated CTA, scroll-triggered reveal
- [ ] 10.2 **Section 2 — Editorial Banner:** Bold typography, inline product thumbnails, scroll reveal
- [ ] 10.3 **Section 3 — Featured Categories:** 2-column layout, hover 3D tilt, image zoom on hover
- [ ] 10.4 **Section 4 — Immersive Image Block:** Large model shot, slow fade-in, text overlay animation
- [ ] 10.5 **Section 5 — Popular Products:** Horizontal scroll carousel, smooth snap scrolling, hover elevation
- [ ] 10.6 **Section 6 — Featured Products Grid:** Animated entrance on scroll, add-to-cart micro-interaction
- [ ] 10.7 Install & configure **Framer Motion** + **GSAP** for scroll-based animation timelines
- [ ] 10.8 Performance audit — ensure Lighthouse > 90 after all animations

---

## Phase 11 — Frontend: Product Pages

> **Goal:** Browsable shop page, detailed product page with 3D interaction.
> **Prompts to Follow:** 🎨 7 (Animation) · ⚡ 4 (Performance) · 🏗 3 (Architecture)

- [ ] 11.1 **Shop page** — product grid with filters (price, brand, gender, popularity), search bar with autocomplete
- [ ] 11.2 **Product detail page:**
  - High-res image gallery
  - 3D interactive rotation (Three.js, optional, graceful degradation)
  - Scroll-triggered animations
  - Stock availability indicator
  - Reviews section
  - Related products carousel
- [ ] 11.3 Add-to-cart & add-to-wishlist buttons with micro-animations (bounce, heart)
- [ ] 11.4 Connect pages to Convex queries/mutations via `useQuery` and `useMutation` hooks

---

## Phase 12 — Frontend: Cart, Checkout & Payment UI

> **Goal:** Cart page, checkout form, M-Pesa STK Push UI, order confirmation.
> **Prompts to Follow:** 💳 5 (M-Pesa) · 🛡 2 (Security) · ⚡ 4 (Performance)

- [ ] 12.1 **Cart page** — item list, quantity adjustment, remove, coupon code input, auto-totals
- [ ] 12.2 **Checkout page:**
  - Shipping info form (React Hook Form + Zod)
  - M-Pesa phone number input
  - "Pay Now" → triggers Convex action for STK Push
  - Loading/waiting state while user confirms on phone
  - Success / failure feedback (real-time via Convex subscription)
- [ ] 12.3 **Order confirmation page** — summary + receipt
- [ ] 12.4 Connect everything to Convex functions
- [ ] 12.5 Handle edge cases: timeout, failure, duplicate submission

---

## Phase 13 — Frontend: Auth Pages & Account

> **Goal:** Login, register, password reset, order history, wishlist views.
> **Prompts to Follow:** 🛡 2 (Security) · 🏗 3 (Architecture)

- [ ] 13.1 **Login page** (email + password)
- [ ] 13.2 **Register page** (email + password + confirmation)
- [ ] 13.3 **Password reset** page flow
- [ ] 13.4 **Account dashboard** — order history, wishlist, profile edit
- [ ] 13.5 Set up **Convex React hooks** for auth state management (or Zustand if needed)
- [ ] 13.6 Implement guest checkout flow (no account required)

---

## Phase 14 — Admin Dashboard

> **Goal:** Business owner can manage everything from a web interface.
> **Prompts to Follow:** 🛡 2 (Security) · 🏗 3 (Architecture) · 📊 10 (Analytics)

- [ ] 14.1 **Dashboard overview** — total revenue, daily/weekly/monthly sales, conversion rate, top products, low stock alerts
- [ ] 14.2 **Product management** — add/edit/delete products, upload images, set price/discount/stock/category
- [ ] 14.3 **Inventory management** — stock levels, manual adjustments, low-stock threshold alerts
- [ ] 14.4 **Order management** — view all orders, filter by status, update status, export CSV
- [ ] 14.5 **Coupon management** — create/edit coupons (percentage, fixed, expiry, usage limit)
- [ ] 14.6 All admin routes protected by role-based checks (Convex auth guard + frontend redirect)

---

## Phase 15 — SEO & Metadata

> **Goal:** Every page is search-engine optimized.
> **Prompts to Follow:** ⚡ 4 (Performance)

- [ ] 15.1 Configure **Next.js Metadata API** — title tags, meta descriptions on every page
- [ ] 15.2 Add **structured data** (JSON-LD) for products (schema.org Product markup)
- [ ] 15.3 Ensure proper heading hierarchy (`<h1>` per page)
- [ ] 15.4 Generate `sitemap.xml` and `robots.txt`
- [ ] 15.5 Open Graph + Twitter card meta for social sharing

---

## Phase 16 — Analytics & Monitoring

> **Goal:** Track user behavior and system health.
> **Prompts to Follow:** 📊 10 (Analytics Safety) · 🔄 9 (Deployment)

- [ ] 16.1 Integrate **Google Analytics 4** (privacy-respecting, toggleable via env var)
- [ ] 16.2 Build custom **admin analytics** via Convex queries (real-time dashboard metrics)
- [ ] 16.3 Integrate **Sentry** for production error monitoring
- [ ] 16.4 (Optional) Add **Hotjar** heatmaps

---

## Phase 17 — CI/CD & Deployment

> **Goal:** Ship to production with confidence.
> **Prompts to Follow:** 🔄 9 (Deployment & Environment) · 🔐 1 (Global Engineering)

- [ ] 17.1 Set up **GitHub Actions** CI pipeline (lint, test, build)
- [ ] 17.2 Deploy frontend to **Vercel** (connect repo, set env vars)
- [ ] 17.3 Deploy Convex to **Convex Cloud** (production deployment: `npx convex deploy`)
- [ ] 17.4 Configure environment variables in Convex dashboard (Daraja keys, Resend API key, etc.)
- [ ] 17.5 Environment validation on app startup (fail fast on missing env vars)
- [ ] 17.6 Remove all `console.log` from production builds
- [ ] 17.7 Final security audit: HTTPS, secure cookies, no exposed secrets

---

## Phase 18 — Testing & Performance Audit

> **Goal:** Validate everything works and meets targets.
> **Prompts to Follow:** 🧪 6 (Code Quality) · ⚡ 4 (Performance)

- [ ] 18.1 Run full **unit test** suite (Convex functions)
- [ ] 18.2 Run **end-to-end** tests for critical flows (register → browse → add to cart → checkout → pay)
- [ ] 18.3 **Lighthouse audit** on all major pages — Score > 90
- [ ] 18.4 **TTFB** < 500ms check
- [ ] 18.5 Mobile responsiveness testing (especially animations)
- [ ] 18.6 Accessibility audit (WCAG AA, keyboard nav, alt text, reduced motion)

---

## Phase 19 — Polish & Launch Prep

> **Goal:** Final touches before going live.

- [ ] 19.1 Populate real product catalog content (images, descriptions, prices)
- [ ] 19.2 Verify all email templates with live sends
- [ ] 19.3 Test M-Pesa in Safaricom sandbox then go live
- [ ] 19.4 Create **About** and **Contact** static pages
- [ ] 19.5 Final cross-browser testing (Chrome, Safari, Firefox, mobile)
- [ ] 19.6 Write README.md with setup instructions
- [ ] 19.7 🚀 **Launch**

---

## Future Phases (Post-Launch — from PRD Phase 2)

- [ ] Loyalty points system
- [ ] Subscription refills
- [ ] Mobile app (React Native)
- [ ] AI fragrance recommendation engine
- [ ] WhatsApp order notifications
- [ ] Stripe card payment (secondary)
- [ ] International shipping support
