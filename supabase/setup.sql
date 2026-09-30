-- Yang's World — one-time Supabase setup.
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
--
-- What it creates:
--   * table  public.photos  — one row per picture (album, storage path, name)
--   * bucket photos         — public-read storage for the image files
--   * rules: anyone can VIEW; only a signed-in user (the shared uploader
--     login you create under Authentication → Users) can upload or rename.

create table if not exists public.photos (
  id         uuid primary key default gen_random_uuid(),
  album      text not null
             check (album in ('garden', 'about', 'family', 'portfolio', 'travel', 'friends')),
  path       text not null unique,
  caption    text not null default '' check (char_length(caption) <= 80),
  created_at timestamptz not null default now()
);

create index if not exists photos_album_created_idx on public.photos (album, created_at desc);

alter table public.photos enable row level security;

drop policy if exists "photos are public to view" on public.photos;
create policy "photos are public to view"
  on public.photos for select
  using (true);

drop policy if exists "uploader can add photos" on public.photos;
create policy "uploader can add photos"
  on public.photos for insert
  to authenticated
  with check (true);

drop policy if exists "uploader can rename photos" on public.photos;
create policy "uploader can rename photos"
  on public.photos for update
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for the image files (public URLs, 10 MB per file, images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "uploader can upload photo files" on storage.objects;
create policy "uploader can upload photo files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');
