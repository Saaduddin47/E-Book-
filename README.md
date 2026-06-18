# eBook Platform

A production-ready eBook sales and delivery platform. The marketing page faithfully replicates the design, UX, animations, typography, and layout of [ddaura.com](https://ddaura.com/) (content swapped for your own eBook), and is backed by a complete commerce system: email authentication, Ziina one-time payments, paid-only eBook access, and a hidden admin dashboard.

---

## Features

- **Faithful landing page** – Long-form sales page rebuilt section-by-section (announcement bar, sticky nav, hero, pain points, pull-quote, solution, "what's inside", before/after, testimonials, FAQ accordion, final CTA). Fully responsive across mobile, tablet, and desktop with the same scroll-reveal and hover animations.
- **Email authentication** – Passwordless magic-link login (Auth.js + Resend), secure httpOnly database sessions.
- **Ziina payments** – One-time eBook purchase via Ziina hosted checkout, confirmed with a signed webhook.
- **Protected access** – The eBook is only readable/downloadable by users with a completed purchase, served through short-lived signed URLs from a private storage bucket.
- **Hidden admin dashboard** (`/admin`) – Manage users, orders/entitlements, all editable landing-page content, and the eBook PDF/cover. Role-gated and not linked publicly.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions) + TypeScript
- **Styling/Animation:** Tailwind CSS, Framer Motion, lucide-react
- **Database:** Postgres (Supabase) via Prisma ORM
- **Auth:** Auth.js (NextAuth v5) — email magic link, Prisma adapter, DB sessions
- **Email:** Resend (transactional)
- **Storage:** Supabase Storage (private bucket) for the eBook PDF + cover
- **Payments:** Ziina REST API + signed webhook
- **Validation:** Zod
- **Hosting:** Vercel

---

## Architecture Overview

```
Browser
  │
  ├── Landing page (ISR)  ──reads──►  SiteContent / Testimonials / FAQs (DB)
  │
  ├── Auth (magic link)   ──────────►  Auth.js + Resend
  │
  ├── Checkout            ──────────►  Ziina /payment_intent ──► hosted pay page
  │                                          │
  │                                          ▼
  │                            Webhook /api/webhooks/ziina (HMAC + IP verify)
  │                                          │
  │                                          ▼
  │                            Order COMPLETED + Entitlement created
  │
  └── /read (gated)       ──────────►  Entitlement check ──► signed PDF URL
```

### Payment flow

1. A logged-in user clicks **Buy**.
2. The server creates a `PENDING` `Order` and a Ziina **payment intent** (`amount`, `currency_code=AED`, `success_url`, `cancel_url`, `failure_url`).
3. The user is redirected to Ziina's hosted payment page.
4. Ziina sends a `payment_intent.status.updated` webhook (verified via `X-Hmac-Signature` HMAC and IP allowlist).
5. On success the `Order` is marked `COMPLETED` and an `Entitlement` is created, granting eBook access.

---

## Data Model (Prisma)

- `User` — id, email, name, role (`USER` | `ADMIN`), timestamps
- `Account` / `Session` / `VerificationToken` — Auth.js tables
- `Product` — eBook (slug, title, priceCents, compareAtCents, currency, pdfPath, coverPath, active)
- `Order` — userId, productId, ziinaPaymentIntentId, amountCents, currency, status (`PENDING` | `COMPLETED` | `FAILED`)
- `Entitlement` — userId, productId, orderId, grantedAt (drives paid access)
- `SiteContent` — singleton JSON for hero / solution / before-after / pricing / announcement
- `PainPoint`, `Feature`, `Testimonial`, `Faq` — list tables managed via the admin dashboard

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (Postgres + Storage)
- A Resend account (email)
- A Ziina business account (payments)

### Installation

```bash
npm install
```

### Environment variables

Copy the example file and fill in your credentials:

```bash
cp env.example .env
```

> Tip: For quick local previews you can run the app before configuring anything.
> The landing page falls back to built-in placeholder content if the database
> isn't reachable, magic-link URLs are printed to the server console when
> `RESEND_API_KEY` is missing, and (outside production) checkout simulates a
> successful purchase when `ZIINA_API_TOKEN` is missing so you can test the
> full flow end to end.

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres pooled connection string |
| `DIRECT_URL` | Supabase direct connection (for migrations) |
| `AUTH_SECRET` | Random secret for Auth.js sessions |
| `AUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY` | Resend API key for sending magic links |
| `EMAIL_FROM` | Verified sender address |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server-only) for storage signing |
| `SUPABASE_STORAGE_BUCKET` | Private bucket name for the eBook |
| `ZIINA_API_TOKEN` | Ziina API bearer token |
| `ZIINA_WEBHOOK_SECRET` | Secret used to verify webhook HMAC signatures |
| `ZIINA_TEST_MODE` | `true` to create test payment intents in development |
| `ADMIN_EMAIL` | Email seeded as the initial admin user |

### Database setup

```bash
npm run db:migrate   # create tables (or: npm run db:push)
npm run db:seed      # seed product, content, and the ADMIN_EMAIL admin user
```

### Storage setup (for the eBook file)

In Supabase, create a **private** Storage bucket whose name matches
`SUPABASE_STORAGE_BUCKET` (default `ebook`). The app uploads the PDF/cover there
from the admin dashboard and serves them only through short-lived signed URLs.

### Run locally

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Admin Dashboard

Visit `/admin` while signed in as the seeded admin user (`ADMIN_EMAIL`). From there you can:

- View revenue, order, and user stats
- Search users and toggle roles / manually grant or revoke access
- Inspect orders and entitlements (with Ziina IDs and statuses)
- Edit all landing-page copy and pricing
- Create/update/delete pain points, features, testimonials, and FAQs
- Upload or replace the eBook PDF and cover image

---

## Ziina Webhook Setup

Register your deployed webhook endpoint with Ziina, pointing to:

```
https://<your-domain>/api/webhooks/ziina
```

Use the same secret as `ZIINA_WEBHOOK_SECRET` so signatures can be verified. The endpoint only accepts requests from Ziina's IP allowlist:

```
3.29.184.186
3.29.190.95
20.233.47.127
13.202.161.181
```

For local testing, use the Ziina test mode (`ZIINA_TEST_MODE=true`) and a tunnel (e.g. ngrok) to receive webhooks.

---

## Security

- Passwordless auth with secure, httpOnly database sessions
- Role-based middleware protecting `/read`, `/account`, and `/admin`
- Webhook HMAC signature verification + IP allowlisting
- Private storage bucket; the eBook is only accessible via short-lived signed URLs
- Zod validation on all inputs; rate limiting on login and checkout
- All secrets kept server-side via environment variables

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import the project into Vercel and add all environment variables.
3. Set the production `AUTH_URL` to your deployed domain.
4. Run migrations against the production database (`prisma migrate deploy`).
5. Register the production webhook URL with Ziina.

---

## Project Status

See the project plan for the full implementation breakdown. Current scope: faithful landing-page replica, email auth, Ziina payments, protected eBook access, and the admin dashboard.
