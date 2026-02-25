# Ummie's Essence — Build Journal 🧴✨

> **What is this file?**
> This is a step-by-step record of how the Ummie's Essence website was built. It's written in simple language so anyone — even without technical knowledge — can understand what was done, why it matters, and how all the pieces fit together.

---

## 🏗 What Are We Building?

**Ummie's Essence** is an online store for selling perfumes and cosmetics in Kenya. Think of it like a luxury shopping website — similar to how big brands sell their products online, but designed specifically for Kenyan customers who pay with **M-Pesa** (the mobile money service everyone in Kenya uses).

The website has two sides:
1. **The Customer Side** — where shoppers browse products, add items to their cart, and pay
2. **The Admin Side** — where the business owner manages products, tracks orders, and sees sales reports

### 🧰 Our Main Tools

| Tool | What It Does | Simple Analogy |
|------|-------------|----------------|
| **Next.js** | Builds the website pages customers see | The storefront — walls, shelves, windows |
| **Convex** | Handles all data, logic, and real-time features | The back office — filing cabinets, cash register, stockroom, all in one |
| **M-Pesa (Daraja API)** | Processes mobile money payments | The payment terminal |
| **TailwindCSS** | Makes things look beautiful | The paint, lighting, and decoration |
| **Framer Motion & GSAP** | Creates smooth animations | The moving displays and dynamic window presentations |

---

## 📋 Build Log

### Phase 1 — Setting Up the Foundation

**Status:** ✅ Completed

**What we did:**
1. **Next.js & Git Setup**: We initialized the project with Next.js 15+, TypeScript, and Git.
2. **Convex Initialization**: We linked the project to a new Convex backend and database. We installed the Convex client and configured the app to communicate with the cloud database.
3. **Database Schema**: We defined the initial structure for all our tables so Convex knows exactly how to store our data.
4. **App Integration**: We added a "Provider" to the website, allowing our pages to talk to the database in real-time.
5. **Design System Setup**: We installed shadcn/ui and configured our custom luxury color palette (warm neutrals, dark charcoal, and soft gold) along with our elegant fonts.
6. **Environment Finalization**: We fully built the `.env.local` file with placeholders for M-Pesa and Resend, and checked `.gitignore` for security.

**Why we did it:**
By defining the structure now, we ensure our data remains organized and safe from the very first day. Real-time integration means that the site stays updated instantly without refreshing.

**How we did it:**
- **Convex Dev**: We ran `npx convex dev` to provision the cloud database.
- **Provider Pattern**: We created a `ConvexClientProvider` component so every page can access data.
- **Environment Safety**: We stored the secret keys in `.env.local` to keep the database connection secure.
- **Tailwind & shadcn**: We used `npx shadcn@latest init` to set up beautiful UI components.

**Next Steps:**
We've completed the environment setup and are now ready to start Phase 2.

---

### Phase 2 — Designing the Data Storage

**Status:** ⏳ Not started yet

**Simple Analogy:**
Before a shop can operate, you need systems: a product catalog binder, a customer list, an order book. This step creates all those "binders" digitally inside Convex.
