# GOVIZ

Marketing site + admin CMS for GOVIZ, an architecture & visualisation studio.

Built with **Next.js 16 (App Router)**, **Supabase** (Postgres + Auth), **Vercel Blob** (3D model + cover image storage), **Three.js** (interactive model viewer), and **GSAP ScrollTrigger** (pinned scroll sections).

## Getting started (local dev)

### 1. Provision a Supabase project

1. Create a new project at https://supabase.com/dashboard.
2. In **SQL Editor**, paste the contents of `supabase/schema.sql` and run it. This creates the `projects`, `services`, and `site_settings` tables with RLS policies and seed data.
3. In **Authentication → Users**, click **Add user → Create new user** and create your single admin account (email + password). Flip **Auto Confirm User** on.
4. In **Project Settings → API Keys**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (safe to expose — used by the browser and SSR)
   - **Secret key** (`sb_secret_...`) → `SUPABASE_SECRET_KEY` (server-only — bypasses RLS)

   > These replace the legacy `anon` / `service_role` JWT keys. If your project still shows those, enable the new key type in the same settings panel.

### 2. Provision a Vercel Blob store

1. In the Vercel dashboard → **Storage → Create → Blob**.
2. Copy the `BLOB_READ_WRITE_TOKEN`. (When deployed to Vercel, this is injected automatically; set it manually only for local dev.)

### 3. Environment

Copy `.env.local.example` to `.env.local` and fill in your values.

### 4. Run

```bash
npm install
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin (redirects to `/admin/login` when signed out)

## Architecture

```
src/
  app/
    page.tsx                     — server component; reads published data from Supabase
    about,contact/               — redirect to / anchors
    admin/
      login/page.tsx             — Supabase email/password login
      (panel)/                   — route group, authed shell
        layout.tsx               — redirects to /admin/login when unauthed
        page.tsx                 — dashboard
        projects,services,contact,settings/page.tsx
    api/
      projects/[...],services/[...],settings/  — CRUD (RLS enforces auth for writes)
      upload/                    — Vercel Blob client-upload token (handleUpload)
      auth/logout                — signs out the server-side session
  components/
    *                            — public site sections (Nav, Hero, Projects, Viewer3D, …)
    admin/*                      — admin shell (Sidebar, Header, ProjectEditor, UploadDropzone, …)
  lib/
    supabase/{browser,server,admin,types}.ts   — three Supabase clients
    gsapInit.ts                  — ScrollTrigger setup
    useReveal.ts                 — intersection-observer reveal hook
    api.ts                       — requireAdmin + response helpers
middleware.ts                    — refreshes session cookie; gates /admin/**
supabase/schema.sql              — tables, RLS, seed
```

## Storage notes

- **Cover images** (JPG/PNG/WEBP) → Vercel Blob, cap 10 MB.
- **3D models** (`.glb`, `.gltf`) → Vercel Blob, cap 100 MB.
- The admin uploads files **directly from the browser to Blob** via `@vercel/blob/client`'s `upload()` + `/api/upload` token endpoint. This bypasses the 4.5 MB Vercel Functions request-body limit — essential for 50–100 MB models.
- `.skp` files: export as `.glb` from SketchUp first.

## Auth model

- Single admin. Create the user in Supabase dashboard.
- Row-level security:
  - `projects`: anon sees `published = true`; authenticated sees all and can write.
  - `services`, `site_settings`: anon reads; authenticated writes.
- Session is managed by `@supabase/ssr` cookies; `middleware.ts` refreshes the token on every request and redirects unauthenticated access to `/admin/**` to `/admin/login`.
- API routes double-check `requireAdmin()` on every write.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — run built server
- `npm run lint`

## Deploy

Push to a Vercel project. Add the three Supabase env vars in the dashboard; Vercel Blob auto-injects `BLOB_READ_WRITE_TOKEN`.
