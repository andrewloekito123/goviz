-- GOVIZ — Supabase schema (run once in Supabase SQL editor)
-- Idempotent: safe to re-run.

-- ─────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  year           text not null default extract(year from now())::text,
  location       text not null default '',
  category       text not null default '',
  description    text not null default '',
  tags           text[] not null default '{}',
  pattern_angle  int  not null default 0,
  pattern_color  text not null default '#bcc5e8',
  bg_color       text not null default '#1a1d2e',
  cover_url      text,
  model_url      text,
  meta_title     text,
  meta_desc      text,
  published      boolean not null default false,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  num          text not null,
  title        text not null,
  description  text not null default '',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.site_settings (
  id               int primary key default 1,
  contact_email    text default '',
  contact_phone    text default '',
  contact_address  text default '',
  studio_name      text default 'GOVIZ',
  studio_tagline   text default 'Architecture & Visualisation',
  studio_founded   text default '2012',
  studio_city      text default 'Copenhagen',
  studio_country   text default 'Denmark',
  updated_at       timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- ─────────────────────────────────────────────
-- Updated-at trigger
-- ─────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at before update on public.services
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_settings_updated_at on public.site_settings;
create trigger trg_settings_updated_at before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────
-- Row-level security
-- ─────────────────────────────────────────────
alter table public.projects      enable row level security;
alter table public.services      enable row level security;
alter table public.site_settings enable row level security;

-- PROJECTS
drop policy if exists projects_public_select  on public.projects;
drop policy if exists projects_authed_select  on public.projects;
drop policy if exists projects_authed_insert  on public.projects;
drop policy if exists projects_authed_update  on public.projects;
drop policy if exists projects_authed_delete  on public.projects;

create policy projects_public_select on public.projects
  for select to anon using (published = true);
create policy projects_authed_select on public.projects
  for select to authenticated using (true);
create policy projects_authed_insert on public.projects
  for insert to authenticated with check (true);
create policy projects_authed_update on public.projects
  for update to authenticated using (true) with check (true);
create policy projects_authed_delete on public.projects
  for delete to authenticated using (true);

-- SERVICES (public read, auth write)
drop policy if exists services_public_select  on public.services;
drop policy if exists services_authed_insert  on public.services;
drop policy if exists services_authed_update  on public.services;
drop policy if exists services_authed_delete  on public.services;

create policy services_public_select on public.services
  for select to anon, authenticated using (true);
create policy services_authed_insert on public.services
  for insert to authenticated with check (true);
create policy services_authed_update on public.services
  for update to authenticated using (true) with check (true);
create policy services_authed_delete on public.services
  for delete to authenticated using (true);

-- SETTINGS (public read singleton, auth update only)
drop policy if exists settings_public_select  on public.site_settings;
drop policy if exists settings_authed_update  on public.site_settings;

create policy settings_public_select on public.site_settings
  for select to anon, authenticated using (true);
create policy settings_authed_update on public.site_settings
  for update to authenticated using (true) with check (true);

-- ─────────────────────────────────────────────
-- Seed (no-op if already populated)
-- ─────────────────────────────────────────────
insert into public.site_settings (id) values (1) on conflict do nothing;

update public.site_settings set
  contact_email   = 'studio@goviz.dk',
  contact_phone   = '+45 33 12 34 56',
  contact_address = E'Vesterbrogade 44\n1620 Copenhagen, DK'
where id = 1
  and contact_email is distinct from 'studio@goviz.dk';

insert into public.projects
  (slug, title, year, location, category, description, tags,
   pattern_angle, pattern_color, bg_color, published, sort_order)
values
  ('meridian-house', 'Meridian House', '2024', 'Copenhagen, Denmark', 'Residential',
   'A study in light, threshold, and materiality. Meridian House explores the dialogue between solid and void through a sequence of carefully calibrated spaces that shift with the arc of the sun. Concrete, glass, and raw timber define a language of honest construction.',
   ARRAY['Residential','Concrete','Net Zero'], 45, '#bcc5e8', '#1a1d2e', true, 1),
  ('axis-cultural-center', 'Axis Cultural Center', '2023', 'Oslo, Norway', 'Cultural',
   'A civic landmark designed around the concept of convergence — where public life, art, and urban infrastructure intersect in a single cohesive gesture. The building folds inward to create a sheltered public plaza, blurring the boundary between inside and out.',
   ARRAY['Cultural','Public','Urban'], 0, '#c8b8e0', '#1e1a2d', true, 2),
  ('parallax-tower', 'Parallax Tower', '2023', 'Berlin, Germany', 'Commercial',
   'A mixed-use high-rise that challenges the static tower typology. Each floor plate is slightly rotated, creating a continuous twist that animates the facade while optimising daylight penetration to every workspace.',
   ARRAY['Commercial','High-rise','Mixed-use'], 90, '#b8d4c0', '#1a2520', true, 3),
  ('ground-pavilion', 'Ground Pavilion', '2022', 'Stockholm, Sweden', 'Public',
   'A temporary installation that became permanent. The Ground Pavilion mediates between a historic waterfront and a new urban park, offering a porous structure that serves as stage, shelter, and observatory simultaneously.',
   ARRAY['Public','Pavilion','Landscape'], 30, '#e0d0a8', '#2a2410', true, 4),
  ('threshold-residence', 'Threshold Residence', '2022', 'Helsinki, Finland', 'Residential',
   'Sited on the edge of a boreal forest, this private residence negotiates between domesticity of the interior and wildness of the landscape through threshold spaces — covered terraces, screened rooms, and framed vistas.',
   ARRAY['Residential','Timber','Landscape'], 60, '#d0c0b8', '#251e1a', true, 5),
  ('node-research-hub', 'Node Research Hub', '2021', 'Amsterdam, Netherlands', 'Research',
   'A collaborative research facility conceived as a network of interlocking volumes. Each node is purpose-designed for a specific mode of thinking — from focused solitary work to spontaneous cross-disciplinary collision.',
   ARRAY['Research','Academic','Modular'], 15, '#b8ccd8', '#151e28', true, 6)
on conflict (slug) do nothing;

insert into public.services (num, title, description, sort_order) values
  ('01','Concept Design','From brief to bold proposition — spatial strategy, massing, and narrative.', 1),
  ('02','Architectural Design','Full RIBA Stage 1–5 delivery, coordinated across all disciplines.', 2),
  ('03','Interior Architecture','Material palettes, furniture strategy, and experiential sequencing.', 3),
  ('04','3D Visualisation','Immersive renders and interactive 3D models for client communication.', 4),
  ('05','Masterplanning','Urban-scale thinking — site strategy, phasing, and public realm design.', 5),
  ('06','Heritage & Adaptive Reuse','Sensitive interventions within historic fabric, unlocking new life.', 6)
on conflict do nothing;
