# Design system: core

Every value is a token. Niche packs override specific tokens. FRONTIER's implementation source of truth remains `apps/game/app/globals.css`.

## 1. Color

Use 60-30-10: neutral, secondary surfaces and text, then accent. One accent hue is allowed; extra hues are semantic states or data. Neutrals should be tinted toward the brand hue. Use 12-step scales by role: steps 1-2 page backgrounds, 3-5 component backgrounds, 6-8 borders and focus, 9-10 solid fills, 11-12 text.

Core warm neutral proposal:

| Token | Light | Dark |
|---|---|---|
| `--background` | `#FAFAF7` | `#11100E` |
| `--surface` | `#FFFFFF` | `#1A1916` |
| `--surface-2` | `#F2F1EC` | `#23211D` |
| `--border` | `#E4E2DA` | `#34312B` |
| `--border-strong` | `#CFCBC0` | `#4A463E` |
| `--foreground` | `#1A1814` | `#F4F2EC` |
| `--muted-foreground` | `#5E5A52` | `#A9A498` |

If no brand color exists, use ink `#1A1814` for primary controls and orange signal `#E4572E` for the accent. Avoid hue 260-300 unless it is the brand. Semantic proposals: success `#15803D` / `#4ADE80`, warning `#B45309` / `#FBBF24`, destructive `oklch(0.577 0.245 27.325)` / `#F87171`, info `#1D4ED8` / `#60A5FA`.

Dark mode is optional and only ships when the PRD asks for it. Use lighter surfaces and borders for elevation, not heavy shadows.

## 2. Typography

Self-host licensed woff2 where possible, subset, preload only the above-fold font, and use `font-display: swap` with size-adjusted fallbacks.

| Pairing | Display | Body | When |
|---|---|---|---|
| A | General Sans 600 | Satoshi 400/500 | Most landing pages |
| B | Fraunces or Instrument Serif | Satoshi | Food and editorial |
| C | Geist Sans 600 | Geist Sans and Geist Mono | SaaS and dev tools |

Proposed scale, base 16px: xs 12/1.5, sm 14/1.5, base 16/1.6, lg 18/1.6, xl 20/1.5, 2xl 24/1.35, 3xl `clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)`, 4xl `clamp(2.25rem, 1.7rem + 2vw, 3rem)`, 5xl `clamp(2.75rem, 1.9rem + 3.2vw, 4.5rem)`.

Body text is at least 16px on mobile. Keep prose 60-75ch, use tabular numbers for metrics, and balance headings.

## 3. Spacing, grid, breakpoints

Use the 4px scale: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160px. Inside components use 4-24px; between blocks 24-48px. Default containers are 1120px, maximum 1280px, and prose is 720px. Side padding is 20/32/48px. Use 4/8/12-column grids with 16/24/32px gutters. Breakpoints: 640, 768, 1024, 1280, 1536px.

## 4. Shape and elevation

Pick one radius personality. FRONTIER uses restrained sharp-soft shapes, with existing framed tools at 8px or less. Use a border or shadow at full strength, not both. Reserve z-index tokens for sticky navigation, overlays, modals, and toasts.

## 5. Icons

Use one icon family. Lucide is the default: 16, 20, and 24px on a 24px grid with 2px stroke. Icon-only buttons need an accessible name and a 44px hit area. Never use emoji as interface icons.

## 6. Imagery

Use real, owned or licensed media where imagery is needed. Give meaningful images descriptive alt text, explicit dimensions or aspect ratio, AVIF/WebP formats, and lazy loading below the fold. Pinterest is direction only, never an asset source.

## 7. Components and states

All interactive components define default, hover, focus-visible, active, disabled, loading, and relevant selected/error/success states. Buttons use 36/44/52px heights, inputs use 44px, focus rings are visible, and press feedback is subtle.

## 8. Existing-stack note

The supplied standard assumes shadcn/ui and Tailwind v4 for new projects. FRONTIER is an existing Next.js MVP with a small CSS system and no Tailwind dependency. Do not add a framework migration during gameplay work. Apply these token, accessibility, copy, and QA rules to the existing stylesheet.
