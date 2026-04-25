# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
```

**TypeScript check** (not in package.json scripts):
```bash
npx tsc --noEmit
```

**Cache reset on build errors:**
```bash
rm -rf .next && npm run dev
```

No automated test framework — manual testing via browser at localhost:3000.

## Architecture

**Next.js 15 App Router SPA** for the thesolution.at IT consulting homepage.

### Key architectural decisions

- **Server vs Client split**: Pages are server components by default. Add `"use client"` only when state/interactivity is needed. For routes that need both (e.g. `app/team/`), split into a server `page.tsx` and a client `TeamContent.tsx`.
- **Styling system**: Dual approach — custom CSS variables + utility classes in `app/globals.css` (`.glass`, `.gradient-text`, `.btn`, `.grid-2/3/4`, `.container`) alongside Tailwind CSS 4.1. Use the custom variables (`var(--accent-blue)`, `var(--accent-teal)`, `var(--glass-bg)`) for brand consistency.
- **No state management library**: React `useState` only. Lifting state to page level where multiple sections share it (e.g. `showDiagnostic` in `app/page.tsx` passed down to `AISection` → `TerminalWindow`).
- **Glassmorphism design system**: All cards use `.glass` class (`backdrop-filter: blur(12px)`, semi-transparent border). Hover effects animate scale, color, and glow via inline styles + `isHovered` state.

### Route structure

```
app/
  page.tsx              # Homepage: Hero + ServicesSection + AISection
  layout.tsx            # Root layout: Navbar + main + Footer + CookieBanner
  team/
    page.tsx            # Server wrapper
    TeamContent.tsx     # Client component with team cards
  tools/solution/
    page.tsx            # Solution hub listing 4 tools
    openclaw-iac/       # Oracle Cloud IaC tool
    coolify-iac/        # Coolify on OCI tool
    databricks-iac/     # Databricks IaC tool
    personal-security/  # Security checklist tool
    web-check/          # Web check tool
  ebook/                # Ebook page
  impressum/            # Legal notice
  datenschutz/          # Privacy policy
components/
  Navbar.tsx            # Navigation (client component)
  Footer.tsx
  CookieBanner.tsx
  ui/
    button.tsx          # shadcn button
    aurora-flow.tsx     # Animated background component
lib/
  utils.ts              # cn() helper (clsx + tailwind-merge)
```

### TypeScript config

- `strict: true`, `noUnusedLocals`, `noUnusedParameters`
- Path alias: `@/` → project root
- Prefix unused vars with `_` to suppress errors

### Dependencies of note

- `@react-three/fiber` + `@react-three/drei` + `three` — 3D rendering (used in some tool pages)
- `simplex-noise` — noise-based animations (aurora-flow component)
- `@sentry/nextjs` — error tracking; global error boundary in `app/global-error.tsx`
- `prismjs` — syntax highlighting in IaC tool pages
- `@base-ui/react` — unstyled UI primitives

## Design conventions

- Fonts: Inter (body), Outfit (headings), Geist (code) — loaded via `app/fonts.css`
- Color palette: dark navy background (`#0a0f1a`), teal (`#7dd3c0`), blue (`#5b9bd5`), purple (`#9b8fb8`)
- Animations: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` as standard; entrance via Tailwind's `animate-in fade-in slide-in-from-top-4`
- Icons: Lucide React exclusively — `<Icon size={48} strokeWidth={1.5} />`
