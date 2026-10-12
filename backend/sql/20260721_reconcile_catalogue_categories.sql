-- An index makes category filtering fast as the catalogue grows. It does not
-- change or delete any existing products or categories. Safe to run repeatedly.
-- (Category rows themselves are created by 20260718_seed_store_categories.sql.)
create index if not exists products_category_id_idx
  on public.products (category_id);
