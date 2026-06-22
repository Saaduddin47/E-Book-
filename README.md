# E Book Website

Minimal, polished, and built to sell a single eBook.

## What it does

- Modern landing page with smooth motion and responsive sections
- Passwordless login with secure sessions
- Ziina checkout for one-time purchases
- Protected reading and download access
- Admin area for content, users, and orders

## Stack

- Next.js 16
- TypeScript
- Prisma + Supabase Postgres
- Auth.js
- Resend
- Ziina
- Tailwind CSS + Framer Motion

## Quick Start

```bash
npm install
cp env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment

Set the values in `.env` from `env.example`, especially:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `ZIINA_API_TOKEN`
- `ZIINA_WEBHOOK_SECRET`
- `ADMIN_EMAIL`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run db:migrate`
- `npm run db:seed`

## Notes

The app works best once the auth, database, storage, email, and payment credentials are configured.
