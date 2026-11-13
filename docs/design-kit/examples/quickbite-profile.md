# Example profile: QuickBite

Food delivery, pre-launch waitlist, Nigeria (started in Ile-Ife). Warm, playful, local. The worked example behind the playful niche.

Source: `Qbyte-org/qb_landing_page`, branch `main`, commit 15cff8f (3 Nov 2026), cloned 12 Nov 2026. Every value below is [OWN] unless marked. Ratios computed from token hex.

## 1. Stack

| Item | Value |
|---|---|
| Framework | Next 16.2.7, React 19.2.4 |
| Styling | Tailwind 4 via `@tailwindcss/postcss` + `@tailwindcss/typography`; `@theme static` |
| Motion | `gsap` ^3.15 + `@gsap/react` (ScrollTrigger), `motion` ^12.40 |
| Scroll | `lenis` ^1.3.25 |
| Icons | `lucide-react` (MapPin 19, ArrowRight 16, ArrowUpRight 8 …), stroke often 1.75 or 2.35 |
| Other | `odometer`/`react-odometerjs`, `leaflet`/`react-leaflet`, `sonner`, `react-markdown` |
| Fonts | Inter (`--font-sans`) + Sora (`--font-display`, 600/700/800 only) via `next/font/google` |

## 2. Exact tokens

### Colour

| Token | Value | Ratio |
|---|---|---|
| Palette reset | `@theme static { --color-*: initial; … }` | |
| `--color-brand` | `#FF4D1D` | 3.2:1 on paper (**fails as text**); 5.54:1 on dark-ink |
| `--color-brand-light` | `color-mix(in srgb, var(--color-brand) 68%, white)` ≈ `#ff8665` | |
| `--color-brand-dark` | `color-mix(… 78%, black)` ≈ `#c73c17` | white on it 5.14:1; as text on paper 4.95:1 [computed] |
| `brand-50` / `brand-100` | 7% / 16% brand in paper | |
| `--color-paper` | `#fffaf5` | |
| `--color-cream` | `#fff7f0` | |
| `--color-cream-200` | `#fff0e4` | |
| `--color-ink` | `#2a211d` | 15.18:1 on paper [computed] |
| `--color-dark-ink` | `#1c120f` | 17.72:1 on paper [computed] |
| `--color-espresso` | `#241813` | |
| `--color-cocoa` (muted text) | `#6d5c52` | 6.13:1 on paper |
| `--color-navy` (default `--foreground`) | `#1a1a2e` | second text family (defect) |
| `--color-muted` | `#6b7280` | |
| `--color-border` | `#f0e6dc` | |
| Category tints | blush `#ffe8e0`, gold `#fff3e0`, yellow `#fff7e6`, sky `#e8f5ff`, peach `#ffeede`, rose `#fdeaf3` | |
| Theme sync | `src/generated/theme-colors.json` = `{"brand":"#FF4D1D","paper":"#FFFAF5"}` | |
| Body glow | `radial-gradient(circle at 18% 0%, color-mix(--page-glow 42%, transparent), transparent 34rem)` | |
| Borders in use | `border-ink/20` (36), `/15` (29), `/10` (20); on dark `border-paper/15–20` | |

### Type

| Item | Value |
|---|---|
| Hero H1 | `font-display` semibold, `leading-[1.03]`, `tracking-[0.01em]`; 2.7rem → 3.1rem (430px) → `text-5xl` → `text-6xl` → 5.2rem (lg) → 5.9rem (xl) |
| `section-heading` | display, 2.85rem (4rem from 640px), weight 600, lh 0.9, tracking 0.01em |
| Eyebrow | `text-xs font-extrabold uppercase tracking-[0.22em]`, `text-brand-dark` |
| SectionTag | `text-xs font-semibold uppercase tracking-[0.18em] text-cocoa`, preceded by an 8×1px brand rule |
| Subtitle | `mt-4 text-lg leading-relaxed`, muted or cocoa; heading block `max-w-2xl`, centred |

### Layout

| Item | Value |
|---|---|
| Container | `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`; hero `max-w-[103rem]`; final CTA `w-[90%] max-w-[1800px]` |
| Section padding | `py-16` / `sm:py-24` |
| Breakpoints | Tailwind defaults + ad-hoc `min-[430px]`, `[@media(640px<width<1024px)]` |

### Shape and depth

| Item | Value |
|---|---|
| Radius tokens | `--radius-card: 0.875rem`, `--radius-xl2: 1.25rem`, `--radius-pill: 9999px` ("Radius (12-16px brand)") |
| Radius in use | `rounded-full` 168, `rounded-pill` 43, `rounded-[2rem]` 18, `rounded-2xl` 15, `rounded-[2.5rem]` 13, `rounded-[2.35rem]` 9, `rounded-[1.35rem]` 7, `rounded-card` 3 |
| Shadows | Globally off: `*, *::before, *::after { --tw-shadow: 0 0 transparent !important; box-shadow: none !important; }` |
| Sticker depth | `filter: drop-shadow(0 0.4rem 0 …)` on map pins |
| Divider | `linear-gradient(to right, transparent, border 18%, border 82%, transparent)` |
| Cards | Testimonials `rounded-[2.35rem]`, dashed borders, grain overlay; final CTA `rounded-4xl bg-ink-soft` on `bg-dark-ink` with a 56s spinning sunburst paused until in view |
| Icon chip | `grid size-8 place-items-center rounded-full border border-ink/10 bg-cream-200 text-brand-dark`, icon `size-4 strokeWidth={1.75}` |

### Motion

| Item | Value |
|---|---|
| Tokens (`animation.ts`) | durations fast 0.25, base 0.5, slow 0.8; easings premium `power3.out`, smooth `power2.inOut`; `revealOffset: 28`; `premiumTransition` 0.5s `[0.22, 1, 0.36, 1]` |
| Spring | `tactileSpring` stiffness 420, damping 30, mass 0.6; `whileHover {y:-3, scale:1.015}`, `whileTap {scale:0.97}` |
| Reveal | GSAP 0.8s `power3.out`, y 18 or x 24, ScrollTrigger `start: "top 88%"`, once; image clip `inset(0 0 100% 0 round 1.75rem)` → `inset(0 0 0% 0 …)` |
| Easing counts | `[0.22,1,0.36,1]` 43, `power3.out` 29, `power2.inOut` 14, `power3.inOut` 11; common durations 0.28, 0.5, 0.42, 0.4s; staggers 0.04–0.25s |
| MagneticFillButton | fill from cursor entry, scale 0→1, 760ms in / 600ms out, `cubic-bezier(0.4,0,0.2,1)`; fill `bg-cream-200`, text → `text-ink` |
| Hero typewriter | Fresh./Fast./Local.; type 92, delete 58, pause 4200ms; photo synced |
| Marquee | 32s linear, duplicated track `translateX(-50%)`, pauses on hover, edge fades `w-16` |
| Ambient | float 7s, pulse-glow 9s |
| Odometer | 1.8s, `cubic-bezier(0.22,1,0.36,1)` |
| Lenis | `lerp: 0.12`, `wheelMultiplier: 1` (kit default) |
| Chrome | top-edge scrollbar 3px → 7px on hover, brand colour; native scrollbar hidden |

## 3. Structure and copy

Live page order: intro splash ("Skip intro", rotating taglines) → dark hero → "What are you craving?" (3 category cards) → "Your next bite. Right here." (app showcase, 2×2 grid) → "How It Works" ("Our process", stepper) → "Food by city" (map + restaurant cards) → "Good food. Better together." (audience tabs, testimonials) → FAQ "Good questions. Clear answers." → "Find, Order & Enjoy" (large "QUICKBITE" wordmark) → waitlist form → "Hungry right now?" banner.

| Copy | Text |
|---|---|
| Hero | "Real food, delivered [Fresh./Fast./Local.]", CTA "Order now" |
| Subtitle | "From smoky jollof to late-night small chops, pick a category and dig in." |
| Microcopy | "We started in Ile-Ife and we're just getting going. Don't see your city yet? It's probably next on the map." |
| CTAs | "Get launch updates", "Explore restaurants", "Become a partner", "Ride with us", "Talk to our team" |
| Steps | "Pick your meal", "Pay with Paystack", "Track to your door" |
| Storage | Typed `src/content/*.ts`, "apart from layout and animation code" |

## 4. What to copy

| Move | Why it works |
|---|---|
| `--color-*: initial` palette reset | Off-palette colours cannot exist |
| One brand hex + `color-mix()` shades | No near-duplicates; one change rethemes everything |
| Brand/paper hex synced to artwork via generated JSON | Art and UI never drift |
| Global no-shadow rule; solid sticker drop-shadows | Depth without blur |
| Copy in typed content modules | Copy is reviewable and separate from layout |
| `sources.json` per image folder + audit scripts | Provenance by default |
| Local, sensory copy | Specific beats generic |
| Tactile spring values | Good default for hover and tap |
| Sunburst paused until in view | Ambient motion that does not burn CPU off-screen |

## 5. What to avoid

| Defect | Evidence | Kit fix |
|---|---|---|
| **White on brand orange** | Hero CTA `bg-brand! text-white!`, 16px semibold: 3.32:1 (16px semibold is not large text) | White on `brand-strong` `#c73c17` (5.14:1), or `dark-ink` on `#FF4D1D` (5.54:1) |
| **Brand orange as text on paper** | 3.2:1 | Use `#c73c17` for text (4.95:1) |
| Radius drift | Tokens say 12–16px; components use `rounded-[2rem]`/`[2.35rem]`/`[2.5rem]`/`[1.35rem]`/`[1.4rem]`; `rounded-card` 3 uses | Make 2–2.5rem the tokens; lint arbitrary values |
| Text below 12px | `text-[0.65rem]` 20, `text-[0.6rem]` (9.6px) 11, `text-[0.68rem]` 9, `text-[10px]` 6 | 12px floor |
| Unloaded weight | 21 `font-display font-black` (900) on Sora 600–800; map labels `font-weight: 950` | Load what you use, use what you load |
| Two text colour families | `text-navy` (15) alongside `text-ink` (85); navy is the default foreground | One ink family |
| Palette sprawl | >80 colour tokens (tan, sand, linen, parchment …) | 4–6 named colours + ≤6 tints |
| Ad-hoc breakpoints and containers | `min-[430px]`, `max-w-[103rem]`, `w-[90%] max-w-[1800px]` | Tokens or layout variables |
| Testimonials of unknown origin | "Aisha Lawal, Customer • OAU Campus", "Bola Adeyemi, Kitchen Lead • Mayfair" with initials avatars on a waitlist product | Ask the owner; ship only sourced quotes |
| Hidden native scrollbar | Custom top bar replaces it | Keep the native scrollbar |
| Title-case triad headline | "Find, Order & Enjoy" | One concrete line |
| Closeness to an AI default | Cream paper + hot orange is near the named "cream + terracotta" default | New clients pick canvas and accent from their own world |
| Odometer 1.8s | Longer than the kit's 600–1200ms | Shorten |
