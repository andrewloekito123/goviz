# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server at http://localhost:3000
- `npm run build` — production build
- `npm start` — run the built production server
- `npm run lint` — run ESLint (flat config, extends `eslint-config-next/core-web-vitals` + `/typescript`)

No test runner is configured.

## Project Overview

`goviz` is a marketing site for "govisualization", an architectural visualization studio. It is a Next.js 16 App Router project using React 19 and Tailwind CSS v4. Three pages exist: `/` (home), `/about`, `/contact` — all are client components.

## Architecture

### Stack
- **Next.js 16 (App Router)** with TypeScript `strict: true`. Path alias `@/*` → `./src/*`.
- **Tailwind v4** via `@tailwindcss/postcss`, configured in `src/app/globals.css` using `@theme inline` and oklch CSS variables. A `.dark` variant is declared but no theme toggle is wired.
- **shadcn/ui** (`components.json`, style `new-york`, base color `zinc`) — only `src/components/ui/button.tsx` is generated so far. The shadcn registry `@react-bits` is configured, pointing at `https://reactbits.dev/r/{name}.json`.
- **3D / animation libraries**: `three` + `@react-three/fiber` + `@react-three/drei` (used by `Beams.jsx`), `framer-motion` / `motion`, `gsap` (used by `Masonry.jsx` / `MagicBento.jsx` / `TiltedCard.jsx`), and `aos` for scroll-triggered reveals.

### Component layout
- `src/app/layout.tsx` — root layout. Loads Geist fonts, renders `<Navbar />` over `<main>`. Pages render their own hero + `<Footer />`.
- `src/components/*.jsx` — react-bits-style visual components (`Beams`, `MagicBento`, `Masonry`, `TiltedCard`). These are untyped `.jsx` files.
- `src/components/*Wrapper.tsx` — thin `"use client"` TSX wrappers that import the `.jsx` components and pass concrete props (see `BeamsWrapper.tsx`, `MasonryWrapper.tsx`). When adding a new react-bits-style component, follow this pattern: keep the library-style source as `.jsx` and consume it from a typed `*Wrapper.tsx`.
- `src/components/AOSInit.tsx` — client-only `useEffect` that calls `AOS.init(...)`; must be mounted once on any page that uses `data-aos="..."` attributes.
- `src/lib/utils.ts` — `cn()` helper (`clsx` + `tailwind-merge`), the shadcn convention.

### Typing quirks
- `types/aos.d.ts` declares `aos` as untyped; `tsconfig.json` registers `./types` as a `typeRoots` entry — keep new ambient module declarations here, not under `src/`.
- `.jsx` component files are allowed (`allowJs: true`) and are intentionally untyped. Do not convert them to `.tsx` unless asked — they are treated as vendored/third-party-style code.

### Styling conventions
- Brand color is hardcoded as `#032bff` (primary) and `#3a488a` (secondary/darker) across pages. There is no Tailwind theme token for it yet — if adding a token, wire it through `@theme` in `globals.css`.
- Pages mix Tailwind utilities with inline `style={{ background: ... }}` for multi-stop radial/linear gradients — this is intentional for one-off hero backgrounds.

## Conventions

- **No `any`**: this is a Next.js project — do not introduce `any` types in `.ts`/`.tsx` files (global rule from user config).
- **Do not run git commands**: the user handles commits/pushes/deploys themselves. Never `git add`, `git commit`, or `git push`.
- Every page under `src/app/` is currently `"use client"`. If you add a Server Component page, be aware that the existing animation components (`framer-motion`, `gsap`, `three`) require client boundaries.
