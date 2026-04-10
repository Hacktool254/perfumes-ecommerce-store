Architecture Overview

Frontend (Next.js)
Backend (NestJS)
Database (PostgreSQL)
Payments (M-Pesa Daraja API)
Hosting (Vercel + Railway or DigitalOcean)

1️⃣ Frontend Stack
Framework

Next.js (App Router)

SSR for SEO

Static generation for performance

Styling

TailwindCSS

shadcn/ui (component system)

Animation

Framer Motion (advanced scroll animation)

GSAP (complex timeline control)

Three.js (3D bottle interaction)

State Management

Zustand

Forms

React Hook Form + Zod validation

SEO

Next SEO

Structured data (JSON-LD)

2️⃣ Backend Stack
Framework

NestJS (modular + scalable)

API Type

REST (simple for now)

Authentication

JWT

bcrypt password hashing

Database

PostgreSQL

ORM

Prisma

3️⃣ Payment Integration (Kenya Optimized)
M-Pesa

Daraja API (STK Push)

Secure webhook validation

Transaction logging

Automatic order confirmation

Flow:

User clicks Pay

Backend triggers STK Push

User confirms on phone

Safaricom sends callback

Backend verifies

Order marked as Paid

4️⃣ Infrastructure
Hosting

Frontend → Vercel
Backend → Railway or DigitalOcean
Database → Managed PostgreSQL
Images → Cloudinary
CDN → Vercel Edge Network

5️⃣ DevOps

GitHub Actions (CI/CD)

Docker (backend containerization)

Environment variable management

Production monitoring (Sentry)

6️⃣ Security

Helmet middleware

Rate limiting

Input validation (Zod)

Webhook signature validation

Admin role-based access

7️⃣ Email System

Resend or SendGrid

Automated:

Order confirmation

Shipping notification

Abandoned cart reminder

8️⃣ Analytics

Google Analytics 4

Custom admin dashboard metrics

Heatmap tool (Hotjar optional)

9️⃣ Performance Strategy

Image lazy loading

WebP images

Code splitting

Edge caching

Reduce animation on mobile

