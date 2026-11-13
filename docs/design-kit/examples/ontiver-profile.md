# Example profile: Ontiver

Identity-verification product, individual and enterprise audiences. Editorial and calm. This is the worked example behind the base tokens and the fintech niche.

Source: `joinverza/ontiver_landing`, branch `startup`, commit 1623194 (3 Nov 2026), cloned 12 Nov 2026. Every value below is [OWN] unless marked. Ratios computed from token hex.

## 1. Stack

| Item | Value |
|---|---|
| Build | Vite 8, React 19.2, react-router-dom 7, prerendered to static HTML (`scripts/prerender.mjs`) |
| Styling | Tailwind 4.3 via `@tailwindcss/vite`, CSS-first `@theme`, no config file |
| Motion | Plain CSS keyframes + IntersectionObserver runtime; no animation library |
| Scroll | `lenis` ^1.3.24 |
| Icons | Custom `createIcon` factory |
| Component library | None |

## 2. Exact tokens

### Colour

| Token | Value | Ratio on page |
|---|---|---|
| `--surface-page` | `#e9ebe5` | |
| `--surface-raised` | `#f3f4ef` | |
| `--surface-muted` | `#e0e4dc` | |
| Body ink (`--color-dark-primary`) | `#002d0e` | 12.65:1 |
| Muted text | `#526058` | 5.51:1 |
| `--ink-accent` | `#006b1d` | 5.6:1 |
| `--color-green` | `#007d21` | |
| `--color-light-primary` | `#009311` | **3.37:1: fails as text** |
| `--color-border` | `#05150e` | |
| Card border | `#dde6dc` | |
| Grid gap background | `#dce4d9` | |
| `--section-divider` | `rgb(114 148 117 / 24%)` | |
| FAQ rules | `1px rgb(0 45 14 / 22%)` | |
| Dark CTA surface | `#002d0e` | |
| Spotlight hover fill | `#004917` | |
| Icons on dark | `#c7e6b5` | 11.16:1 on `#002d0e` |
| Selection | `#d2edcc` background, `#002d0e` text | |
| Focus | `3px solid rgba(0,125,33,0.28)`, offset 3px | ring ≈1.47:1 on page [SYN computation] |

### Type

| Item | Value |
|---|---|
| Family | Bricolage Grotesque only; self-hosted variable WOFF2 (weight 200–800, opsz 12–96), preloaded; `font-optical-sizing: auto`, `text-rendering: geometricPrecision`, antialiased |
| `--text-hero` | `clamp(2.125rem, 4.722vw, 6.5rem)`, lh 1.2, tracking −0.04em, `text-wrap: pretty` |
| `--text-section` / `--text-panel` | `clamp(2rem, 3.334vw, 4.5rem)`, lh 1.15 |
| `.section-heading` | weight 500, −0.035em, `text-wrap: balance` |
| `--text-subtitle` | `clamp(1.25rem, 1.597vw, 1.917rem)`, lh 1.55 |
| `--text-card-title` | `clamp(1.375rem, 1.667vw, 2rem)`, lh 1.25 |
| `--text-body` | `clamp(1rem, 1.25vw, 1.5rem)`, lh 1.65 |
| `--text-meta` | `clamp(0.8125rem, 0.972vw, 1.167rem)`, lh 1.4 |
| Fixed sizes | xs 0.875, sm 1, base 1.125, lg 1.25, xl 1.5, 2xl 1.75rem |
| `.eyebrow` | 700, uppercase, 0.13em, accent colour |
| Buttons | 600, uppercase, 0.15em |

### Layout

| Variable | Mobile | ≥640px | ≥1024px |
|---|---|---|---|
| `--site-gutter` | 12px | 24px | `clamp(24px, 2.222vw, 64px)` |
| `--section-padding` | 3rem | 4.5rem | `clamp(4.5rem, 6.667vw, 7rem)` |
| `--section-padding-compact` | 2rem | 2.5rem | `clamp(2.5rem, 3.334vw, 3.5rem)` |
| `--site-header-height` | 85px | 85px | `clamp(85px, 5.9vw, 128px)` |

| Item | Value |
|---|---|
| Container | `.site-container` max-width 2400px; text capped at 720px or 520px |
| Breakpoints | xss 450, xs 550, sm 640, md 768, lg **1000**, lgg 1250, xl 1280px |
| Grids | `.editorial-links`, `.spotlight-grid`: 1 col → 3 at ≥768 → 4 at ≥1280 (`--four`) |

### Shape and depth

| Item | Value |
|---|---|
| Radii | 0 (grids, 21 uses), 999px (15), 20px image/story cards, 1.5rem `.surface-card` with `1px solid #dde6dc`, buttons `clamp(0.5rem, 0.556vw, 0.75rem)` |
| Shadows | About 9 in total, e.g. `0 1px 0 #cbd6c9`, `0 4px 14px #002d0e0d`, `0 8px 24px #001b1426` |
| Dividers | `border-block-start: 1px solid var(--section-divider)` between sibling sections in `#main-content` and before the footer |
| Grid lines | `gap: 1px` on `#dce4d9`; "Fine rules define the columns without adding separate card backgrounds." |

### Icons

24×24 viewBox, `fill="none"`, stroke `currentColor`, `strokeWidth` 1.65, round caps and joins, `aria-hidden` unless labelled.

### Motion

| Item | Value |
|---|---|
| Curve | `cubic-bezier(0.22,1,0.36,1)` (38 uses); secondary `cubic-bezier(0.2,0.8,0.2,1)` (5) |
| Common durations | 260ms (24), 180ms (17), 220ms (12), 200ms (10) |
| Reveals | default 18px/680ms; heading 28px/850ms; action 12px/600ms; card 24px/800ms; media 20px/1000ms scale 0.985 |
| Stagger | `min(index, 4) × 65ms`; observer `rootMargin: "0px 0px -24px 0px"` |
| Parallax | clamped ±22px |
| Hero | children 850ms, translateY 32px, delays 0/100/180/260ms; media 1100ms from `inset(42% 38% round 16px)` + scale 1.045 to `inset(0 round 20px)`; rotating phrase 650ms with 4px blur |
| Marquee | 36s linear, gap 48px, edge mask 10%/90%, pauses on hover or focus |
| Button | `clip-path: circle(0%)` → `circle(150%)` 650ms; arrow slides through 260ms; colour 180ms |
| Image cards | scale 1.04 over 700ms |
| Lenis | `lerp: 0.085`, `wheelMultiplier: 0.58`, `syncTouch: false`, off under reduced motion |
| Controls | `html[data-motion="paused"]` user toggle; reduced motion → 0.01ms durations, marquee becomes a static row |

## 3. Structure and copy

| Page | Sections |
|---|---|
| `/` | IndividualHero, HowItWorks, InYourControl, AboutTheApp, FAQ, PageFooter |
| `/enterprise` | Hero, Modules, Solution, UseCase, TrustSection, CertificationStrip, RegulatoryCredentials, PilotResults, EvidenceCards, FAQ, Footer |

| Copy | Text |
|---|---|
| Hero eyebrow | "Your identity. Your credentials. Your choice." |
| Hero H1 | "Verify once. / Approve every share." |
| Enterprise H1 | "Verify people. / Connect every step." |
| Microcopy | "Preparing for focused pilots. Checks and integrations are agreed for each workflow." |
| Section H2s | "Three steps. No more repeat paperwork."; "You decide what leaves your hands." |
| Promises | "Nothing leaves without your approval"; "Only what's needed"; "Change your mind any time" |
| CTAs | "Join the Waitlist", "See How It Works", "Get a Demo", "Explore Platform", "Request Enterprise Demo", "Start Sandbox", "How we protect your data" |
| Closing | "Ready to verify once and stay in control?" |
| Spelling | British |

Code comment that states the page strategy: "The home page explains one idea: verify once, then approve each share."

## 4. What to copy

| Move | Why it works |
|---|---|
| One hue family: tinted canvas, hue-tinted ink, one accent | Calm, coherent, nothing off-palette |
| Fluid clamp type scale with tight display tracking | Scales from phone to 2400px without breakpoints |
| Layout variables for gutter and section padding | One place to tune rhythm |
| Hairline section dividers and 1px-gap grids | Structure without boxes or shadows |
| Almost no shadows | Depth from tone, not blur |
| Reveal system with distance/duration per element kind and capped stagger | Consistent, cheap, no library |
| Radial-fill button with slide-through arrow | One signature interaction |
| Motion pause toggle + full reduced-motion path | Goes further than libraries do by default |
| Proof policy: "Only complete, approved records render ... No competitor or proposed-customer logos are used as filler." Pilot metrics show "—" and "Awaiting pilot results". | Honest restraint reads as confidence |
| Reference notes that record what was adapted (Trustly's editorial layouts) and what was kept (own palette and font) | The model for `references.md` |
| Photo direction: "soft natural light and warm neutral surroundings; keep the people and their task legible when cropped", 14-photo library with sources | One grade |
| Navbar that computes the luminance of the section behind it to switch light/dark styling | Detail that reads as craft |
| Loader with an 8s fail-safe | Never traps the user |

## 5. What to avoid

| Defect | Evidence | Kit fix |
|---|---|---|
| Raw hex instead of tokens | `#002d0e` 167× and `#526058` 102× as raw hex (e.g. `text-[#526058]`), >260 total | Gate 5.1, 5.2 |
| Near-duplicate colours | ~40 single-use greens (`#dce4d9`, `#dce5d8`, `#dce6d9`, `#526052` …) | Palette reset + `color-mix` derivation |
| Accent tint used as text | `#009311` on page 3.37:1 (24 uses of the hex) | Use `#006b1d` (5.6:1) for text |
| Faint focus ring | 28% alpha ring ≈1.47:1 | Solid brand ring |
| `lg` breakpoint at 1000px | Differs from Tailwind's 1024 | Kit keeps Tailwind defaults + `xs` 450 |
| Em dash in hero subtitle | "... for how long — instead of uploading ..." | Comma or new sentence |
| Uppercase Title Case CTAs everywhere | "Join the Waitlist" set uppercase | Sentence case in content; uppercase by CSS only if the niche allows |
| Hero line-height 1.2 at 6.5rem | Loose for display | Kit template uses 1.1 |
| No dark theme or `prefers-color-scheme` | Dark sections only | Kit dark block, opt-in |
