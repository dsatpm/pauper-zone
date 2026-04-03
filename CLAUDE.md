# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Pauper Zone is a Magic: The Gathering application focused on the Pauper format, built with Next.js 15 (App Router) and React 19.

## Commands

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build with Turbopack
npm run lint      # ESLint
npm run pretty    # Format with Prettier
```

No test runner is configured yet.

## Architecture

**Next.js App Router** (`app/`) — all routing uses the App Router pattern. RSC (React Server Components) is enabled by default; use `'use client'` only when necessary.

**Shadcn/ui** — components are added via `npx shadcn@latest add <component>` and land in `components/ui/`. Style is "new-york", base color is neutral. Icons use Lucide React.

**Theming** — dark/light mode via `next-themes`. The `ThemeProvider` wraps the app in `app/layout.js`. CSS variables for all colors/radii are defined in `app/globals.css` using Tailwind v4 syntax.

**Styling** — Tailwind CSS v4 (configured via `@tailwindcss/postcss`, no `tailwind.config.js`). All theme tokens live as CSS variables in `app/globals.css`. Use `cn()` from `@/lib/utils` for conditional class merging.

**Path alias** — `@/` maps to the project root.

**MTG data** — `mtgsdk` package is available for Magic: The Gathering card data.

## Code Style

Prettier enforces: single quotes, no semicolons, trailing commas, 100-char line width, 2-space indent. ESLint uses `next/core-web-vitals` (flat config, ESLint 9).
