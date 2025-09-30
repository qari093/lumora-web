-- Enable extensions commonly available in Supabase
create extension if not exists pgcrypto;

-- Playlists (owned by user)
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,  -- auth.uid()
  name text not null,
  meta jsonb default {}::jsonb,
  created_at timestamptz default now()
);

-- Playlist items (one-to-many)
create table if not exists public.playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  track_id text,
  title text,
  artist text,
  url text,
  genre text,
  bpm int,
  lang text,
  niche text,
  position int default 0
);

-- Indexes
create index if not exists idx_playlist_items_playlist on public.playlist_items(playlist_id);
create index if not exists idx_playlist_items_sort on public.playlist_items(playlist_id, position);

-- Row Level Security
alter table public.playlists enable row level security;
alter table public.playlist_items enable row level security;

-- Policies: only owners can CRUD their playlists/items
drop policy if exists "own_playlists_select" on public.playlists;
drop policy if exists "own_playlists_crud" on public.playlists;
create policy "own_playlists_select" on public.playlists
  for select using (auth.uid() = user_id);
create policy "own_playlists_crud" on public.playlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own_playlist_items_select" on public.playlist_items;
drop policy if exists "own_playlist_items_crud" on public.playlist_items;
create policy "own_playlist_items_select" on public.playlist_items
  for select using (
    exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
  );
create policy "own_playlist_items_crud" on public.playlist_items
  for all using (
    exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
  );

-- OPTIONAL: Public storage bucket for tracks (listens/streaming)
-- (Run only if you want to let users upload/stream from Supabase Storage)
insert into storage.buckets (id, name, public)
values (tracks,tracks, true)
on conflict (id) do nothing;

-- Public read; authenticated write (tracks bucket)
drop policy if exists "Public can read tracks" on storage.objects;
create policy "Public can read tracks" on storage.objects
  for select using ( bucket_id = tracks );

drop policy if exists "Auth can upload tracks" on storage.objects;
create policy "Auth can upload tracks" on storage.objects
  for insert with check ( bucket_id = tracks and auth.role() = authenticated );

drop policy if exists "Owners can update/delete tracks" on storage.objects;
create policy "Owners can update/delete tracks" on storage.objects
  for all using ( bucket_id = tracks and owner = auth.uid() )
  with check ( bucket_id = tracks and owner = auth.uid() );

-- === Visibility & public browse ===============================
alter table if exists public.playlists
  add column if not exists visibility text not null default private
  check (visibility in (private,public));

-- Update policies to allow public read when visibility = public
drop policy if exists "own_playlists_select" on public.playlists;
drop policy if exists "own_playlists_crud" on public.playlists;

create policy "playlists_select_owner_or_public" on public.playlists
for select
using (
  auth.uid() = user_id
  or visibility = public
);

create policy "playlists_crud_owner" on public.playlists
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "own_playlist_items_select" on public.playlist_items;
drop policy if exists "own_playlist_items_crud" on public.playlist_items;

create policy "playlist_items_select_owner_or_public" on public.playlist_items
for select
using (
  exists (
    select 1 from public.playlists p
    where p.id = playlist_id
      and (p.user_id = auth.uid() or p.visibility = public)
  )
);

create policy "playlist_items_crud_owner" on public.playlist_items
for all
using (
  exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
)
with check (
  exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
);
