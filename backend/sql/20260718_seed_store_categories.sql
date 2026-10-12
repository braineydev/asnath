-- Asnath catalogue categories. Safe to run repeatedly: it only inserts missing
-- categories or refreshes the display name of an existing slug. It never deletes
-- categories or touches products, so existing products keep their category_id.
-- The storefront navigation (frontend/src/components/Navbar.js) and sitemap use
-- these same slugs; keep them in sync if you add or rename a category.
insert into public.categories (name, slug)
values
  ('Earrings', 'earrings'),
  ('Necklaces', 'necklaces'),
  ('Rings', 'rings'),
  ('Bracelets & Bangles', 'bracelets-bangles'),
  ('Watches', 'watches'),
  ('Handbags', 'handbags'),
  ('Sunglasses', 'sunglasses'),
  ('Hair Accessories', 'hair-accessories')
on conflict (slug) do update set name = excluded.name;
