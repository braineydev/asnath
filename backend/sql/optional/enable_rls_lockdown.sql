-- OPTIONAL hardening. Not run by `npm run migrate` (that runner only reads the
-- top-level backend/sql folder).
--
-- Why: the Next.js app reaches Supabase only through server-side route handlers
-- that use SUPABASE_SERVICE_ROLE_KEY, which bypasses Row Level Security. No
-- browser code in this repository talks to Supabase tables directly. Enabling
-- RLS with no policies therefore blocks anyone holding only the public anon key
-- from reading orders, customer profiles or carts through the REST API, without
-- changing how the application behaves.
--
-- Review before running: if you added any client-side Supabase access of your
-- own, it will stop working until you add matching policies.
-- Safe to run repeatedly. Tables that do not exist in your project are skipped.
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'orders', 'order_items', 'payments',
    'cart_items', 'wishlists', 'delivery_zones'
  ]
  loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;

-- Catalogue tables are public by design (storefront data). Enable RLS and allow
-- read-only public access so the anon key can read but never change them.
do $$
declare
  t text;
begin
  foreach t in array array['products', 'categories']
  loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('drop policy if exists "Public can read %1$s" on public.%1$I', t);
      execute format('create policy "Public can read %1$s" on public.%1$I for select to anon, authenticated using (true)', t);
    end if;
  end loop;
end $$;
