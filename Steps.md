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

> **Why Convex instead of a traditional backend?**
> Normally you'd need three separate things: a server (NestJS), a database (PostgreSQL), and a connector between them (Prisma). Convex bundles all of that into one tool. It's faster to build with, gives us real-time updates automatically (so the admin dashboard refreshes live when an order comes in), and we don't need to manage servers ourselves. Think of it like using a modern all-in-one kitchen appliance instead of separate pots, pans, and a stove.

---

## 📋 Build Log

> Each entry below is added as we complete a section. We explain **what was done**, **why**, and **what it means in simple terms**.

---

### Phase 1 — Setting Up the Foundation

**Status:** ✅ Completed

**What we did:**
We initialized the project directory with Git for version control and scaffolded a modern Next.js 15+ application. This setup includes the App Router, TypeScript for type safety, TailwindCSS for styling, and ESLint for code quality.

**Why we did it:**
Next.js provides the "storefront" framework that allows for high-performance, SEO-friendly pages. TypeScript ensures our code is robust and less prone to errors as the project grows. Setting up Git right away ensures we can track every change we make from the very beginning.

**How we did it:**
1. **Git Init**: We ran `git init` to turn the folder into a repository.
2. **.gitignore**: We added a file to tell Git to ignore "noise" files like `node_modules`.
3. **Scaffolding**: We used `npx create-next-app` to automatically generate the project structure, including the `src` directory for our code and configuration files for Tailwind and TypeScript.
4. **Cleanup**: We moved the files into the root directory to keep the project structure clean and simple.
5. **GitHub Push**: We used the GitHub CLI (`gh`) to create a new public repository and pushed our code to the `main` branch. This makes the project available online for collaboration and backup.

**What was created:**
- `src/app/`: The home for our website pages and layouts.
- `package.json`: The manifest for all our project dependencies.
- `tsconfig.json`: Configuration for our TypeScript "strict mode" setup.
- `tailwind.config.ts`: Our design system foundation.

---

### Phase 2 — Designing the Data Storage

**Status:** ⏳ Not started yet

**What we'll do:**
We'll design exactly how information is organized in Convex — like creating the right folders in a filing cabinet.

**Simple Analogy:**
Before a shop can operate, you need systems: a product catalog binder, a customer list, an order book, a payment ledger. This step creates all those "binders" digitally inside Convex.

**What gets created:**
- Product records (name, price, images, stock count)
- Customer accounts (email, password)
- Order records (what was bought, how much, delivery address)
- Payment logs (M-Pesa transaction details)
- Shopping cart storage
- Wishlist storage
- Product reviews
- Discount coupons

---

### Phase 3 — User Accounts & Security

**Status:** ⏳ Not started yet

**What we'll do:**
We'll build the system that lets customers create accounts, log in, and stay secure. We'll also make sure the business owner has a special admin account with extra powers.

**Simple Analogy:**
This is like installing locks on the doors, giving keys to the right people, and hiring a security guard. Customers get regular keys; the owner gets the master key.

**What gets created:**
- Sign up / login system (using Convex Auth)
- Password protection (passwords are scrambled so even we can't read them)
- A security "badge" system (so the system knows who you are on every action)
- The difference between a regular customer and the admin/owner

---

### Phase 4 — Product Catalog

**Status:** ⏳ Not started yet

**What we'll do:**
We'll build the Convex functions for adding, editing, and displaying products. Customers will be able to search, filter, and browse everything.

**Simple Analogy:**
This is like stocking the shelves, putting price tags on everything, and organizing products into sections (Perfumes, Body Mist, Cosmetics, etc.).

---

### Phase 5 — Shopping Cart, Wishlist & Reviews

**Status:** ⏳ Not started yet

**What we'll do:**
Customers can add products to their cart, save favorites to a wishlist, and leave reviews after purchasing.

**Simple Analogy:**
The cart is like a physical shopping basket. The wishlist is like circling items in a magazine to buy later. Reviews are like asking a friend "is this perfume good?"

---

### Phase 6 — Orders & Checkout

**Status:** ⏳ Not started yet

**What we'll do:**
When customers are ready to buy, the system creates an official order, subtracts the purchased quantity from stock, and applies any discount coupons — all in one atomic step (meaning it either all works or none of it happens, to prevent errors).

**Simple Analogy:**
This is the moment you walk to the cash register. The cashier rings up your items, checks for any coupons, and the shelves get restocked to reflect what was sold.

---

### Phase 7 — M-Pesa Payments

**Status:** ⏳ Not started yet

**What we'll do:**
We'll connect the website to Safaricom's M-Pesa system using a Convex action. When customers tap "Pay," a prompt appears on their phone asking them to enter their M-Pesa PIN. Convex also sets up a special webhook URL that Safaricom calls to confirm the payment.

**Simple Analogy:**
Instead of swiping a credit card, the customer gets a text message on their phone saying "Pay KES 2,500 to Ummie's Essence?" They enter their PIN, and the payment is done. Our system then waits for Safaricom to confirm the money arrived before marking the order as paid.

**Why this is important:**
M-Pesa is the most common way people in Kenya pay for things online. Without it, the store won't work for most customers.

---

### Phase 8 — Email Notifications

**Status:** ⏳ Not started yet

**What we'll do:**
The system will automatically send emails using Convex scheduled actions when important things happen — like when an order is confirmed, when it ships, or if customers leave items in their cart without buying.

**Simple Analogy:**
Think of the emails you get from Amazon — "Your order is confirmed," "Your package has shipped." We're building the same thing.

---

### Phase 9 — Building the Store's Look & Feel

**Status:** ⏳ Not started yet

**What we'll do:**
We'll design the visual identity — the colors (luxury golds, rich neutrals), the fonts (elegant serif for headlines), the overall layout (header, navigation, footer).

**Simple Analogy:**
This is like painting the walls, choosing the lighting, and setting up the display window to make the shop feel premium and inviting.

---

### Phase 10 — Building the Homepage

**Status:** ⏳ Not started yet

**What we'll do:**
We'll build the full homepage with cinematic animations — a large hero image, scrolling product showcases, category sections, and an immersive visual experience.

**Simple Analogy:**
Imagine walking into a luxury perfume store. There's dramatic lighting, beautiful displays, and everything flows as you walk through. The homepage recreates that experience digitally — with smooth animations as you scroll down the page.

---

### Phase 11 — Product Browsing Pages

**Status:** ⏳ Not started yet

**What we'll do:**
We'll build the shop page (browse all products with filters) and the individual product page (detailed view with images, price, reviews, and even a 3D spinning bottle view). Data comes live from Convex using real-time queries.

---

### Phase 12 — Cart & Payment Pages

**Status:** ⏳ Not started yet

**What we'll do:**
We'll build the visual pages for the cart (see your items, adjust quantities) and the checkout page (enter delivery info, pay via M-Pesa). The payment status updates in real-time thanks to Convex subscriptions.

---

### Phase 13 — Account & Auth Pages

**Status:** ⏳ Not started yet

**What we'll do:**
We'll build the login, register, and account pages where customers can see their past orders and manage their wishlist.

---

### Phase 14 — Admin Dashboard

**Status:** ⏳ Not started yet

**What we'll do:**
We'll build a private admin area for the business owner. Because Convex provides real-time data, the dashboard updates live — when a new order comes in, the revenue number updates instantly without refreshing the page.

**Simple Analogy:**
This is like the back office of the store — where the owner reviews the day's sales, checks inventory, and makes business decisions. But instead of checking a paper ledger, everything updates in real-time on their screen.

---

### Phase 15 — SEO (Search Engine Optimization)

**Status:** ⏳ Not started yet

**What we'll do:**
We'll make sure Google can find and display the website properly in search results.

**Simple Analogy:**
If someone Googles "buy perfume in Kenya," we want Ummie's Essence to show up. This step makes that possible.

---

### Phase 16 — Analytics & Monitoring

**Status:** ⏳ Not started yet

**What we'll do:**
We'll add tools that track how many people visit the site, what they click on, and alert us if something breaks.

**Simple Analogy:**
It's like having a counter at the shop entrance that tracks foot traffic, plus a camera that shows which displays people are drawn to.

---

### Phase 17 — Putting It Online (Deployment)

**Status:** ⏳ Not started yet

**What we'll do:**
We'll deploy the frontend to Vercel and the Convex backend to Convex Cloud. No need to manage our own servers — both services handle hosting for us.

**Simple Analogy:**
We've built the shop in a warehouse. Now we're moving it to the high street and turning on the "OPEN" sign. The best part? Someone else maintains the building for us.

---

### Phase 18 — Testing Everything

**Status:** ⏳ Not started yet

**What we'll do:**
We'll walk through every feature as if we're a customer — browsing, adding to cart, paying, receiving emails — to make sure nothing is broken.

**Simple Analogy:**
Before a restaurant opens, the staff does a "soft launch" for friends and family to test the food, service, and ordering. This is the same idea.

---

### Phase 19 — Final Polish & Launch 🚀

**Status:** ⏳ Not started yet

**What we'll do:**
We'll add real product content (photos, descriptions, prices), do final checks, test M-Pesa with real money, and flip the switch to go live.

---

## 🔮 Future Plans

After the store launches successfully, there are exciting features planned:
- **Loyalty points** — reward repeat customers
- **Subscription refills** — auto-reorder favorite products monthly
- **Mobile app** — a dedicated phone app
- **AI fragrance recommendations** — "You liked this perfume? Try this one!"
- **WhatsApp notifications** — get order updates on WhatsApp
