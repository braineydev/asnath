# Asnath

Asnath is a Kenyan accessories and jewellery store. It is a rebrand and redesign of an existing Next.js and Supabase e-commerce platform: the shopping, account, checkout and admin functionality is unchanged, and the storefront now has an ivory, charcoal and champagne-gold look with jewellery categories.

## Stack

- Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript and JavaScript, in `frontend/`
- Server-side `/api` route handlers inside the Next.js app (no separate API server at runtime)
- Supabase for PostgreSQL, authentication and Storage
- Vercel for hosting (`DEPLOYMENT.md`)
- `backend/` holds the SQL migrations and the migration runner. The Express server in `backend/src/` is the legacy implementation retained from the source project and is not deployed.

## Quick start

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Other commands: `npm run build`, `npm start`, `npm run lint`, `node --test src/lib/auth-route-utils.test.js`.

The build downloads Google Fonts (Geist, Geist Mono, Cormorant Garamond), so it needs internet access.

Full instructions, including database setup, the first administrator, adding products, environment variables and troubleshooting, are in [docs/SETUP.md](docs/SETUP.md).

## Repository layout

| Path | Purpose |
| --- | --- |
| `frontend/` | Deployable Next.js application (storefront, admin dashboard, `/api`) |
| `backend/sql/` | Ordered SQL migrations run by `npm run migrate` in `backend/` |
| `backend/sql/optional/` | Optional scripts that are never run automatically |
| `docs/SETUP.md` | Setup, configuration and troubleshooting guide |
| `DEPLOYMENT.md` | Vercel deployment notes |
