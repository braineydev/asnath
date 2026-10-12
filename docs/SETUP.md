# Asnath setup guide

Status labels used below: **Implemented** (in the code), **Tested** (run in the build environment), **Manual** (you must do it).

## 1. What changed from the source project

Implemented: new Asnath branding and wordmark, ivory/charcoal/gold theme, display serif for headings, announcement bar, new hero, jewellery categories in the navigation and sitemap, new logo and favicon assets, rewritten About, Contact, Terms and Privacy copy, and removal of the previous shop's phone numbers, address, map and WhatsApp number.

Also changed, because they were not real data: the storefront, cart and product pages used to show star ratings and (in an unused card) "% OFF" badges generated from a hash of the product ID. Those are removed. Discount badges now appear only when a product has a stored `initial_price` higher than its `discounted_price`. The cart and checkout no longer say "Approx. KSh 200" for delivery; they say "Confirmed with your order".

Unchanged: all API routes, database access, authentication, cart, wishlist, checkout, WhatsApp order flow, M-Pesa reference submission, admin dashboard, image upload, internal identifiers (table and column names, route paths, the `shark_cart` and `shark_session` storage names).

## 2. Environment variables

Copy `frontend/.env.example` to `frontend/.env.local` (development) or add the variables in Vercel (production). Variables starting with `NEXT_PUBLIC_` end up in the browser, so never put secrets in them.

| Variable | Scope | Required | What it is and where to get it |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Server | Yes | Project URL. Supabase dashboard, Project Settings, API. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes | Privileged key, same page. Never expose it to the browser. |
| `NEXT_PUBLIC_SITE_URL` | Public | Yes in production | Canonical URL, for example `https://asnath.example`. Used for metadata, sitemap and robots. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | Recommended | Digits only, international format (`2547XXXXXXXX`). Receives WhatsApp order and enquiry messages. |
| `NEXT_PUBLIC_STORE_PHONE` | Public | Optional | Shown in footer and contact page. |
| `NEXT_PUBLIC_STORE_EMAIL` | Public | Optional | Shown in footer and contact page. |
| `NEXT_PUBLIC_STORE_ADDRESS` | Public | Optional | Address lines separated by `\|`. |
| `NEXT_PUBLIC_STORE_MAP_EMBED_URL` | Public | Optional | The `src` of a Google Maps "Embed a map" iframe. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Optional | Google Analytics 4 ID (`G-...`). |
| `AUTH_CALLBACK_URL` | Server | Optional | Explicit OAuth callback. Defaults to the request origin. |
| `DATABASE_URL` | Local shell | Only for `npm run migrate` | Postgres connection string. `SUPABASE_DB_URL` or `SUPABASE_DATABASE_URL` also work. Not used by the web app. |

The code also accepts `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_ANON_KEY` as fallbacks (`frontend/src/lib/supabase-server.js`). Leave them unset; the service-role key is the intended path.

If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing, the server throws "Missing Supabase configuration" and `/api/health` reports an error.

Provider settings (Google sign-in, SMS one-time codes) are configured in the Supabase dashboard. Steps are in `backend/PROVIDER_SETUP.md`.

## 3. Database setup

**Important: the source repository contains no base schema.** It has only incremental migrations. The code reads and writes these tables: `products`, `categories`, `profiles`, `orders`, `order_items`, `payments`, `cart_items`, `wishlists`, `delivery_zones`, plus the RPC `decrement_stock` and the storage bucket `product-images`. The tables themselves must already exist.

- **If you have the original Supabase project:** use the same project, or export its schema (`supabase db dump --schema public -f schema.sql`, or `pg_dump --schema-only --schema=public`) and run that in the new project first.
- **If you are starting from a blank project:** you need that exported schema. I did not invent one, because column types and constraints guessed from application code would risk silent data errors.

Then run the migrations in `backend/sql/`, in this order. All are written to be repeatable (`if not exists`, `on conflict`, `create or replace`).

| Order | File | Purpose |
| --- | --- | --- |
| 1 | `20260713_add_product_brand.sql` | Adds `products.brand` and an index. |
| 2 | `20260713_add_product_seo.sql` | Adds `slug`, `meta_title`, `meta_description`; back-fills slugs. |
| 3 | `20260715_add_product_pricing_and_image_fields.sql` | Adds `initial_price`, `discounted_price`, `image_name`. |
| 4 | `20260718_seed_store_categories.sql` | **Changed for Asnath.** Inserts the eight jewellery categories. Never deletes anything. |
| 5 | `20260721_reconcile_catalogue_categories.sql` | **Changed for Asnath.** Adds the category index only. |
| 6 | `20260729_create_public_product_images_bucket.sql` | Creates the public `product-images` bucket (4 MB, jpeg/png/webp/avif) and a public read policy. |
| 7 | `decrement_stock.sql` | Atomic stock decrement RPC used at checkout. |
| 8 | `fix-product-permissions.sql` | Grants for `service_role`. |
| 9 | `revoke_decrement_stock_execute.sql` | Stops anonymous callers running the stock RPC. Keep it. |

Run them with `cd backend && npm install && npm run migrate` (executes every top-level `*.sql` in filename order), or paste them into the Supabase SQL editor in the order above.

Optional: `backend/sql/optional/enable_rls_lockdown.sql` enables Row Level Security on the application tables so the public anon key cannot read orders, profiles or carts through the REST API. The app uses the service-role key, which bypasses RLS, so it should not change behaviour, but it has not been run against a live database. Review it first. It is not run by `npm run migrate`.

Existing project note: if the database already holds the previous shop's categories (Phones, Appliances, and so on), they are left in place. Products keep their category. Move or remove old categories yourself from the admin dashboard or SQL when ready.

Status: the scripts have **not** been executed against any Supabase project. They are waiting for you.

## 4. First administrator

The app treats a user as admin when `profiles.role` is `admin`. Safest route:

1. Sign up on the site with the owner's account.
2. In the Supabase SQL editor run (using the user's id from Authentication, Users):
   `update public.profiles set role = 'admin' where id = '<user uuid>';`
3. Sign in again and open `/admin`.

Security note carried over from the source: `buildAuthenticatedUser` uses `profiles.role`, and falls back to `user_metadata.role` only when the profile has no role. Supabase lets a signed-in user edit their own `user_metadata`. Make sure every user has a `profiles` row with a non-null `role` (default `customer`), or remove that fallback in `frontend/src/lib/auth-route-utils.js`. I left it unchanged to avoid altering behaviour for existing admins.

## 5. Adding products

1. Run the category migration so the eight categories exist.
2. Sign in as admin, open `/admin`, and create products (name, category, price, stock, images, optional brand and SEO fields). Images upload to the `product-images` bucket.
3. A discount badge appears only if you set an original price above the selling price.

The storefront shows an empty state until products exist. No demo products are bundled.

Navigation links come from `frontend/src/components/Navbar.js`. If you rename a category slug in the database, update that file and `frontend/src/app/sitemap.ts` too.

## 6. Payments and external integrations

The source application does not call a payment gateway. Checkout collects delivery details and opens a pre-filled WhatsApp message to your number; the API also has `/api/payments/submit` (a customer submits an M-Pesa reference) and `/api/payments/verify` (admin only). No page in the current UI calls those two endpoints. No payment keys are needed. Google sign-in and SMS one-time codes are configured in Supabase (`backend/PROVIDER_SETUP.md`).

## 7. Deployment

Follow `DEPLOYMENT.md`: Vercel project with root directory `frontend`, the variables above, and the production callback URL (`https://your-domain/auth/callback`) added to Supabase Auth redirect URLs. `render.yaml` and `backend/src/` belong to the legacy Express service and are not needed.

## 8. Testing

```bash
cd frontend
npm run lint
npm run build
node --test src/lib/auth-route-utils.test.js
```

### What was tested for this handover

| Check | Result |
| --- | --- |
| `next build --webpack` with fonts mocked (the build sandbox had no access to Google Fonts) | Passed, all routes compiled, type check passed |
| `node --test src/lib/auth-route-utils.test.js` | 3 of 3 passed |
| `npm run lint` | 13 errors, 5 warnings. The untouched source has the same 13 errors and 6 warnings, so none were introduced |
| `next start` smoke test, 200 on `/`, `/about`, `/contact`, `/terms`, `/privacy`, `/login`, `/signup`, `/cart`, `/checkout`, `/admin`, `/sitemap.xml`, `/robots.txt` | Passed |
| Rendered homepage contains Asnath wording and no previous brand, phone number or electronics categories | Passed |

### What was not tested

Everything that needs a live Supabase project: product listing, search, category filtering, product pages, cart persistence, wishlist, sign-up and sign-in, checkout and orders, M-Pesa reference submission, admin product, order and customer management, image upload. `/api/health` returned an error because only dummy credentials were available, which is expected. Visual appearance on desktop, tablet and phone was not checked in a browser. Please run through these on a staging project before launch.

## 9. Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Storefront empty, `/api/health` errors | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` missing or wrong. |
| Category links show nothing | Category migration not run, or products have no category. |
| Product page 404 | The product has no matching `slug` or id. |
| WhatsApp button opens without a recipient | `NEXT_PUBLIC_WHATSAPP_NUMBER` not set (rebuild after setting it, because it is embedded at build time). |
| Contact page says details will appear | Store details variables not set. |
| Google sign-in loops or fails | Callback URL missing from Supabase Auth redirect URLs. |
| Image upload fails | `product-images` bucket missing, or file over 4 MB. |
| Build fails fetching fonts | The build machine cannot reach fonts.googleapis.com. |
| `npm run migrate` fails | `DATABASE_URL` missing, or base tables not created yet. |
