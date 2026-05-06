-- MCB Project Gallery: storage bucket + metadata table
-- Idempotent — safe to re-run.

-- ============================================================
-- Storage bucket: jobsite-images (public read)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jobsite-images',
  'jobsite-images',
  true,
  10485760, -- 10MB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read policy on the bucket
drop policy if exists "Public read jobsite-images" on storage.objects;
create policy "Public read jobsite-images"
  on storage.objects for select
  using (bucket_id = 'jobsite-images');

-- ============================================================
-- Table: public.mcb_projects
-- ============================================================
create table if not exists public.mcb_projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  category    text not null,
  product     text not null,
  description text not null,
  image_path  text not null, -- relative path inside the jobsite-images bucket
  width       int,
  height      int,
  sort_order  int not null default 0,
  is_featured boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists mcb_projects_sort_order_idx on public.mcb_projects (sort_order);
create index if not exists mcb_projects_category_idx   on public.mcb_projects (category);

alter table public.mcb_projects enable row level security;

drop policy if exists "Public read mcb_projects" on public.mcb_projects;
create policy "Public read mcb_projects"
  on public.mcb_projects for select
  to anon, authenticated
  using (true);

-- updated_at trigger
create or replace function public.set_mcb_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_mcb_projects_updated_at on public.mcb_projects;
create trigger trg_mcb_projects_updated_at
  before update on public.mcb_projects
  for each row
  execute function public.set_mcb_projects_updated_at();
