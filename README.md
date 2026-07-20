# Ummies Essence — Perfumes E-Commerce Store

A full-stack e-commerce platform for **Ummies Essence**, a perfume and fragrance brand. Built as a turborepo monorepo with Next.js 16, Convex backend, and GSAP/Framer Motion animations.

---

## Apps

This is a **npm workspaces monorepo** with two Next.js applications:

| App | Port | Description |
|---|---|---|
| **web** (`apps/web`) | 3001 | Customer-facing storefront |
| **admin** (`apps/admin`) | 3000 | Admin dashboard for product and order management |

---

## Features

### Storefront
- Product catalogue with category and filter browsing
- Product detail pages with fragrance notes and descriptions
- Cart and wishlist management
- Customer authentication via Convex Auth
- Order placement and history
- Address book management

### Admin Dashboard
- Product management — create, edit, delete with image uploads
- Order management and status updates
- Category management
- Customer management
- Coupon and discount code creation
- Site settings (banners, featured products)
- Analytics overview
- AI chatbot supervisor
- Export functionality

### Platform
- Real-time data via Convex subscriptions
- Cron jobs for automated tasks (email reminders, stock checks)
- Review and rating system
- Search functionality
- Preference management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | npm workspaces + Turborepo |
| Framework | Next.js 16 (App Router) + TypeScript |
| Backend / DB | Convex (real-time, serverless) |
| Auth | Convex Auth |
| Styling | Tailwind CSS |
| UI components | Radix UI, shadcn/ui |
| Animations | GSAP, Framer Motion |
| Forms | React Hook Form + Zod |
| Shared package | `@ummies/ui` — shared component library |

---

## Project Structure

```
perfumes-ecommerce-store/
├── apps/
│   ├── admin/           # Admin dashboard (port 3000)
│   └── web/             # Customer storefront (port 3001)
├── packages/
│   └── ui/              # Shared component library (@ummies/ui)
└── convex/              # Shared Convex backend
    ├── schema.ts        # Full data schema
    ├── products.ts      # Product queries and mutations
    ├── orders.ts        # Order management
    ├── cart.ts          # Cart operations
    ├── categories.ts    # Categories
    ├── payments.ts      # Payment processing
    ├── reviews.ts       # Review system
    ├── chatbot.ts       # AI chatbot
    └── crons.ts         # Scheduled background tasks
```

---

## Prerequisites

- **Node.js** 18+
- A **Convex** account — [convex.dev](https://convex.dev)

---

## Getting Started

```bash
npm install

# Start Convex dev server
npx convex dev

# Start all apps
npm run dev

# Or start individually
npm run dev --workspace=apps/web
npm run dev --workspace=apps/admin
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `CONVEX_DEPLOYMENT` | Convex deployment name |
| `NEXT_PUBLIC_CONVEX_URL` | Convex URL for the frontend |

---

## Deployment

Both apps deploy independently to **Vercel**. The `vercel.json` at the root handles configuration.
