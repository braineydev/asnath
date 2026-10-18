-- Add Brooches to existing Aseni catalogues. Safe to run repeatedly.
insert into public.categories (name, slug)
values ('Brooches', 'brooches')
on conflict (slug) do update set name = excluded.name;
