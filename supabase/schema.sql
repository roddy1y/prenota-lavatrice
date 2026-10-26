-- Esegui questo nello SQL Editor di Supabase (progetto nuovo).

create table if not exists public.bookings (
  id text primary key,
  name text not null,
  wash_id text not null,
  start_ms bigint not null,
  created_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

create index if not exists bookings_start_ms_idx on public.bookings (start_ms);

alter table public.bookings enable row level security;

-- App di casa (GitHub Pages): lettura/scrittura con la anon key.
-- Il progetto Supabase è dedicato solo a questa lavatrice.
drop policy if exists "casa read bookings" on public.bookings;
drop policy if exists "casa insert bookings" on public.bookings;
drop policy if exists "casa delete bookings" on public.bookings;

create policy "casa read bookings"
  on public.bookings for select
  to anon, authenticated
  using (true);

create policy "casa insert bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

create policy "casa delete bookings"
  on public.bookings for delete
  to anon, authenticated
  using (true);

-- Aggiornamenti live su tutti i telefoni
alter publication supabase_realtime add table public.bookings;
