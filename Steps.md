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
7. **Code Quality Automation**: We set up Prettier (beauty) and ESLint (quality) to work together. We also added Husky "hooks," which act like a security checkpoint—every time we try to save a change (commit) to Git, the system automatically checks for errors and fixes formatting before allowing the change.
8. **Local Verification**: We confirmed that both the storefront (Next.js) and the back office (Convex) start correctly and talk to each other.

**Why we did it:**
By defining the structure now, we ensure our data remains organized and safe. The code quality tools ensure that our codebase remains clean and easy for other developers (or our future selves) to read, preventing small mistakes from becoming big bugs later.

**How we did it:**
- **Convex Dev**: We ran `npx convex dev` to provision the cloud database.
- **Environment Safety**: We stored the secret keys in `.env.local` to keep the database connection secure.
- **Tailwind & shadcn**: We used `npx shadcn@latest init` to set up beautiful UI components.
- **Husky & Lint-Staged**: We configured Git to run automated checks before every commit.
- **Local Run**: We verified the dev server and Convex sync were active simultaneously.

**Next Steps:**
We've completed the environment setup and are now ready to start Phase 2.

---

### Phase 2 — Designing the Data Storage

**Status:** ✅ Completed

**What we did:**
1. **Schema Definition**: We created 10 specialized tables in Convex: `users`, `products`, `categories`, `orders`, `orderItems`, `payments`, `cartItems`, `wishlistItems`, `reviews`, and `coupons`.
2. **Speed Optimization (Indexes)**: We added "indexes" (like a book's index) to all tables. This allows the database to find specific products by their name or find all orders for a specific customer in milliseconds, even as the shop grows.
3. **Smart Relations**: We linked the tables together—for example, a "Cart Item" is linked to both a "User" and a "Product."

**Why we did it:**
A shop is only as good as its organization. By building a solid database structure now, we ensure that as customers start browsing, the website remains fast, accurate, and ready for advanced features like search and complex order processing.

**Next Steps:**
Database is ready. Moving to secure login and user accounts.

---

### Phase 3 — Building the Security Gate (Authentication)

**Status:** ✅ Completed

**What we did:**
1. **Convex Auth Integration**: We set up `@convex-dev/auth` to handle secure logins using emails and passwords.
2. **Role Management**: We built a system that automatically distinguishes between a **Customer** (who can shop) and an **Admin** (who can manage the backend).
3. **Route Protection**: We added a "Security Guard" (Next.js Middleware) that automatically checks every visitor. If someone tries to visit their account page without logging in, or tries to access the Admin dashboard without permission, they are automatically bounced back to the login page.
4. **Build Safety**: We fixed a critical "pre-rendering" error that occurred during the website build process by ensuring the server correctly extracts security cookies even during the initial site setup.

**Why we did it:**
Trust is everything in e-commerce. We need to ensure that customer data is private, payments are secure, and only authorized managers can change product prices or see order histories.

---

### Phase 4 — Product Catalog & Catalog Management

**Status:** ✅ Completed

**What we did:**
1. **Product CMS**: We built the "Brain" of the shop—functions that allow an Admin to add, edit, or remove products securely.
2. **Smart Search**: We built a high-performance search index that allows customers to find perfumes by name, brand, or category instantly.
3. **Category System**: We added a category management system so products can be grouped into "Fragrances," "Body Care," etc.
4. **Image Storage**: We set up **Convex File Storage** to store high-resolution product images directly in our database system. This is faster and more reliable than linking to external image hosts.
5. **Quality Testing**: We wrote **12 automated tests** to verify that everything works perfectly. These tests act like a quality control team, checking every product function to ensure no bugs were introduced.

**Why we did it:**
The catalog is the heart of the storefront. It needs to be beautiful for customers and easy to manage for the business owner.

---

### Phase 5 — Shopping Cart, Wishlist & Reviews

**Status:** ✅ Completed

**What we did:**
1. **Smart Cart**: We built a shopping cart that "remembers" what a user has added across devices. It handles adding items, changing quantities, and calculating totals automatically.
2. **Wishlist System**: We implemented a "Toggle" feature so users can save their favorite perfumes for later with a single click.
3. **Review & Rating System**: We built a system where verified customers can leave star ratings and comments on products to build social proof.
4. **Full Test Suite**: Added **16 total tests** covering all customer interaction logic.

**Why we did it:**
These features turn a static catalog into an interactive shopping experience. They encourage customers to engage more with the brand and make the journey from "browsing" to "buying" much smoother.

---

### Phase 6 — Order & Checkout System

**Status:** ✅ Completed

**What we did:**
1. **Atomic Place Order**: We built a single powerful function that creates an order, links the items, deducts stock, and clears the cart all at once. Because it's "atomic," if any step fails (e.g., someone buys the last perfume a second before you), the whole process cancels automatically so your data never gets messy.
2. **Stock Protection**: Added strict checks to prevent the store from selling more items than it has in stock.
3. **Smart Coupons**: Created a discount engine that supports both % off and fixed KES amounts. It automatically checks for expiry dates and usage limits (e.g., "First 10 people get 10% off").
4. **Order History**: Customers can now view their historical orders and track their statuses from "Pending" to "Delivered."

**Why we did it:**
This is the machine that turns interest into revenue. It ensures inventory is accurate and gives the business owner the tools to run promotions and manage fulfillments.

---

### Phase 7 — M-Pesa Payment Integration (Daraja API)

**Status:** ✅ Completed

**What we did:**
1. **Daraja API Integration**: We built a secure bridge between Convex and Safaricom's Daraja API.
2. **STK Push**: Implemented the seamless "STK Push" feature where customers enter their phone number and receive a prompt on their phone to enter their M-Pesa PIN.
3. **Secure Webhooks**: Created a special "listening" endpoint (HTTP route) that Safaricom talks to when a payment is successful. We added security checks to ensure only Safaricom can trigger payment updates.
4. **Idempotency**: Ensured that a single payment can never be processed twice, protecting both the customer and the business.

**Why we did it:**
In Kenya, M-Pesa is the gold standard for payments. Providing a direct "Pay via M-Pesa" button reduces friction and builds immense trust with local shoppers.

---

### Phase 8 — Transactional Email System

**Status:** ✅ Completed

**What we did:**
1. **Email Integration**: Connected the shop to **Resend** for reliable email delivery.
2. **Lifecycle Emails**: Created automated emails for order confirmation and shipping updates.
3. **Abandoned Cart Recovery**: Set up a "Cron Job" (a timer) that periodically checks for users who left items in their cart and sends them a gentle reminder email.

**Why we did it:**
Emails keep customers informed and feeling valued. Abandoned cart recovery is a proven way to win back sales that might have otherwise been lost.

---

### Phase 9 — Frontend Design System

**Status:** ✅ Completed

**What we did:**
1. **Luxury Palette**: Configured a custom TailwindCSS theme with deep charcoals, rich golds, and warm cream tones.
2. **Premium Typography**: Integrated the specific **Nebula** and **Monsta Fectro** fonts for a high-end editorial look.
3. **Layout Separation**: Restructured the app into "Main" and "Auth" sections so each can have its own tailored experience (e.g., no header/footer during login).

---

### Phase 10 — Building the Cinematic Homepage

**Status:** ✅ Completed

**What we did:**
1. **Immersive Hero Section**: Built a full-screen welcome experience with parallax effects.
2. **Editorial Banners**: Created bold typography-driven sections that tell the brand's story.
3. **Interactive Grids**: Features like 3D hover effects on categories and smooth reveal animations on products.
4. **GSAP & Framer Motion**: Used world-class animation libraries to make the scroll experience feel "fluid" and alive.

---

### Phase 11 & 12 — Product Catalog & Checkout UI

**Status:** ✅ Completed

**What we did:**
1. **Shop & Filters**: Built a high-performance shop page where users can filter by brand, price, or gender without page reloads.
2. **Product Detail Pages**: Created elegant product views with high-res galleries and related product carousels.
3. **Streamlined Checkout**: Built a single-page checkout form with real-time validation and M-Pesa integration.

---

### Phase 13 — Auth Features & Account Dashboard

**Status:** ✅ Completed

**What we did:**
1. **Premium Auth Experience**: Built a truly "WOW" authentication system with organic pulsing circles and glassmorphism (frosted glass) effects for Login and Registration.
2. **Password Reset Flow**: Implemented a secure "Forgot Password" system within the same premium UI, allowing users to safely reset their credentials via email links.
3. **Full Account Dashboard**: Built a luxury account center with a specialized sidebar layout. 
    - **Profile Management**: Users can now update their personal details and contact information.
    - **Order History**: A clean, detailed view of all past purchases with real-time status updates.
    - **Wishlist**: A dedicated space for users to save and manage their favorite fragrances.
4. **Data Sync**: Fully integrated the dashboard with our Convex backend database.

**Why we did it:**
Authentication and account management are the foundation of a personalized luxury experience. By providing a beautiful yet functional dashboard, we give customers a sense of ownership and convenience, making it easy for them to return and find their favorite products or track their latest orders.

**Next Steps:**
Site features are now complete for customers. Next is **Phase 14 — Admin Dashboard** to give the business owner full control over products, orders, and analytics. We are also finalizing the ingestion of the full product catalog! 🧴✨
