# Design system (base layer)

Every project inherits this file. A niche profile in `niches/<niche>/design-system.md` overrides a small, named set of values (canvas, accent strategy, radius, display face, icon weight). Everything else stays as written here.

The source of truth for values is `core/tokens/tokens.json` (DTCG 2025.10, a Community Group Report, not a W3C Standard), mirrored into `core/tokens/theme.css`. If this file and the token files disagree, the token files win and this file gets fixed.

Provenance labels: **[OWN]** from Ontiver or QuickBite source (12 Nov 2026 clones); **[DOC]** primary design-system or standards doc; **[3P]** third-party extraction from a live site, indicative only; **[SYN]** synthesis or practitioner convention, not verified.

## 1. Principles

| # | Principle | What it means in practice |
|---|---|---|
| 1 | Constraint over effects | Most of the clean look comes from removing options: palette reset, no arbitrary values, one signature effect per page. [SYN] |
| 2 | Visual weight matches role | "Don't compete for attention you haven't earned." Chrome recedes, content leads. [DOC: Linear] |
| 3 | Structure felt, not seen | Hairlines and tone shifts instead of boxes and shadows. [DOC: Linear] |
| 4 | Expression in one or two channels | Pick type, colour, material or motion. Hold the rest still. [SYN from 3P] |
| 5 | Specific beats pretty | The hero opens with the most characteristic thing in the subject's world. [DOC: Anthropic frontend-design skill] |

## 2. Colour roles

### 2.1 Roles

| Token | Role | Base value (Ontiver example) | Rule |
|---|---|---|---|
| `canvas` | Page background | `#e9ebe5` [OWN] | Hue-tinted off-white. Never `#fff`. |
| `canvas-raised` | Elevation level 1 (cards, panels) | `#f3f4ef` [OWN] | Tone shift, not shadow |
| `canvas-muted` | Wells, inputs, alternate sections | `#e0e4dc` [OWN] | |
| `ink` | Primary text | `#002d0e` [OWN], 12.65:1 | Near-black tinted toward brand hue. Aim 12–18:1. |
| `ink-muted` | Secondary text | `#526058` [OWN], 5.51:1 | Aim 5.5–6:1. Never below 4.5:1. |
| `brand` | The one accent: eyebrows, accent headline line, links, active state | `#006b1d` [OWN], 5.6:1 | Must pass 4.5:1 on canvas if used as text |
| `brand-strong` | Fill behind light labels (primary button) | `color-mix(brand 78%, black)` = `#005317` [OWN method: QuickBite] | Label on it must pass 4.5:1 |
| `on-brand` | Label on `brand-strong` | `#e9ebe5`, 7.77:1 | |
| `brand-wash` | Tinted fill, selection | `color-mix(brand 7%, canvas)` = `#d9e2d7` | Never text |
| `inverse` / `on-inverse` | Dark bands (closing CTA, footer) | `#002d0e` / `#e9ebe5` [OWN] | |
| `line` | Hairline borders, dividers | `rgb(114 148 117 / 24%)` [OWN] | 10–24% ink |
| `line-strong` | Accordion and table rules | `rgb(0 45 14 / 22%)` [OWN] | |
| `focus` | Focus ring | solid `brand` | See 2.4 |
| `success` / `warning` / `danger` | Status | `#1c6e34` / `#9a5b00` / `#b42318` [SYN] | Checked: 5.25 / 4.52 / 5.47:1 on canvas. Warning fails on `canvas-muted` (4.21:1). |

### 2.2 Palette rules

- `--color-*: initial` in `@theme static` removes every Tailwind default colour. `bg-indigo-500` cannot compile. [OWN: QuickBite] [DOC: Tailwind]
- Declare 4–6 named brand colours, plus status. [DOC: Anthropic skill]
- Derive shades from one brand hex with `color-mix()`. Do not hand-pick a second near-duplicate. [OWN: QuickBite] Ontiver has about 40 near-duplicate greens; that is the defect this rule prevents.
- When you need a full scale, generate it in OKLCH and record step distances. In a perceptual scale, colours 5 steps apart pass 4.5:1 and 4 steps apart pass 3:1. [DOC: Stripe]
- Accent coverage: roughly 2–5% of the page. It appears on one primary CTA per view, plus active and focus states. [SYN]
- Pick one accent strategy per project and do not blend them: **quiet tool** (Linear, Vercel) or **signature colour** (Wise lime, Ramp yellow, Mercury purple). [SYN from 3P]
- Take the accent hue from the subject's world (key art, material, place), never from a previous project.

### 2.3 Contrast table (fill in per project)

Compute every pair from hex before building. Record it here.

| Pair | Ratio | Needed | Pass |
|---|---|---|---|
| ink on canvas | | 4.5:1 | |
| ink-muted on canvas | | 4.5:1 | |
| ink-muted on canvas-raised | | 4.5:1 | |
| brand on canvas (text) | | 4.5:1 | |
| on-brand on brand-strong | | 4.5:1 | |
| status colours on canvas and canvas-muted | | 4.5:1 | |
| line against canvas (only if it carries meaning, e.g. input border) | | 3:1 | |
| focus ring against canvas | | 3:1 | |

Known failures from the reference sites, kept here so they are never repeated:

| Pair | Ratio | Why it fails |
|---|---|---|
| Ontiver `#009311` text on `#e9ebe5` | 3.37:1 | Body text needs 4.5:1 [OWN] |
| QuickBite white on `#FF4D1D`, 16px semibold | 3.32:1 | 16px semibold is not large text [OWN] |
| QuickBite `#FF4D1D` text on paper `#fffaf5` | 3.2:1 | Below 4.5:1 [OWN] |
| Ontiver focus ring `rgba(0,125,33,0.28)` on canvas | 1.47:1 | Ring is barely visible; kit uses solid brand instead [SYN] |

### 2.4 Focus

`outline: 3px solid var(--color-focus); outline-offset: 3px` on `:focus-visible`. [OWN: 3px/3px geometry] The colour is solid brand, not Ontiver's 28% tint. `scroll-padding-top` keeps focused elements clear of the sticky header (WCAG 2.4.11).

### 2.5 Data and chart colour

| Rule | Source |
|---|---|
| Separate chart token set: 5–6 ordered categorical colours, used in order | [DOC: Atlassian] |
| A single series uses the single brand colour | [DOC: Atlassian] |
| Each chart colour ≥3:1 against the surface | [DOC: Atlassian, WCAG 1.4.11] |
| Gaps or borders between adjacent marks (colours do not contrast with each other) | [DOC: Atlassian] |
| No text on chart fills | [DOC: Atlassian] |
| Never colour alone: add direct labels, shapes, or a table | [DOC: Atlassian] |
| Title and legend use `ink`; ticks use `ink-muted`; gridlines use `line` | [DOC: Atlassian] |
| Hover fades unselected marks | [DOC: Atlassian] |
| Chart tokens remap in dark mode | [DOC: Atlassian] |

## 3. Typography

### 3.1 Families

- At most 2 families plus 1 mono. One family is fine (Ontiver uses only Bricolage Grotesque). [DOC: Anthropic skill] [OWN]
- Two families must be clearly distinct. Do not pair a display and a body face by default.
- Niche profile picks the faces. Base default: Aspekta display, Onest body, Geist Mono for figures.
- Self-host as subset WOFF2, preload only the critical face, `font-display: swap`. [OWN: Ontiver] [SYN]
- Load only the weights you use. Never set a weight that is not loaded (QuickBite sets `font-black` 900 on a Sora load that stops at 800: 21 places). [OWN]
- Test the ₦ glyph (U+20A6) and any other currency glyph in every face. [SYN]

### 3.2 Scale (fluid) [OWN: Ontiver tokens.css]

| Token | Size | Line-height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-hero` | `clamp(2.125rem, 4.722vw, 6.5rem)` | 1.1 (Ontiver ships 1.2) | −0.04em | 500 [SYN] | H1 only |
| `text-section` | `clamp(2rem, 3.334vw, 4.5rem)` | 1.15 | −0.035em | 500 | H2 |
| `text-subtitle` | `clamp(1.25rem, 1.597vw, 1.917rem)` | 1.55 | not set | 400 | Hero and section lead |
| `text-card` | `clamp(1.375rem, 1.667vw, 2rem)` | 1.25 | not set | 500 [SYN] | H3, card titles |
| `text-body` | `clamp(1rem, 1.25vw, 1.5rem)` | 1.65 | not set | 400 | Paragraphs |
| `text-meta` | `clamp(0.8125rem, 0.972vw, 1.167rem)` | 1.4 | eyebrow 0.13em | 500–700 | Eyebrows, captions, labels |
| `text-ui-xs` … `text-ui-lg` | 0.75 / 0.875 / 1 / 1.125rem | 1.4 [SYN] | not set | 400–500 | Product UI, tables, forms |

Rules:
- **Floor: 12px.** Nothing smaller ships (QuickBite has `text-[0.6rem]` = 9.6px). [OWN defect]
- Headings: `text-wrap: balance`. Paragraphs: `text-wrap: pretty`.
- Line length: text blocks capped at `--measure` (45rem ≈ 720px) or `--measure-narrow` (32.5rem ≈ 520px). Under 80 characters. [OWN] [DOC: Anthropic skill]
- Body copy on marketing pages: 16–18px minimum. In product UI: 13–14px for tables, 14–16px elsewhere. [SYN]
- Numbers that are compared or that update: `font-variant-numeric: tabular-nums`, right-aligned in columns. [DOC: Alberta DS]

### 3.3 Eyebrow

| Property | Value |
|---|---|
| Size / weight | `text-meta`, 700 |
| Case / tracking | uppercase, 0.13em [OWN: Ontiver]; QuickBite uses 0.22em [OWN] |
| Colour | `brand` (must pass 4.5:1) |
| When | Only where it names the section. On by default for finance and playful; optional for B2B; replaced by bracketed labels for studio; uppercase-tracked small caps for gaming. |

## 4. Spacing

4px base, Tailwind's default `--spacing: 0.25rem`. [DOC: Tailwind]

| Allowed step (px) | Tailwind | Typical use |
|---|---|---|
| 4 | `1` | Icon-to-label gap |
| 8 | `2` | Inline gaps, chip padding |
| 12 | `3` | Mobile gutter |
| 16 | `4` | Control padding, card inner gap |
| 24 | `6` | Card padding, tablet gutter |
| 32 | `8` | Card padding (large), block gaps |
| 48 | `12` | Group spacing |
| 64 | `16` | Sub-section spacing |
| 96 | `24` | Large block gaps |

Section rhythm uses variables, not steps:

| Variable | Mobile | ≥640px | ≥1024px |
|---|---|---|---|
| `--gutter` | 12px | 24px | `clamp(24px, 2.222vw, 64px)` |
| `--section-y` | 3rem | 4.5rem | `clamp(4.5rem, 6.667vw, 7rem)` |
| `--section-y-compact` | 2rem | 2.5rem | `clamp(2.5rem, 3.334vw, 3.5rem)` |

[OWN: Ontiver viewport.css]. Desktop section padding lands around 72–112px.

Vary spacing to show hierarchy. Identical padding everywhere reads as a template. [3P: 925 Studios]

## 5. Layout and grid

| Item | Value | Source |
|---|---|---|
| Breakpoints | `xs` 450px, then Tailwind `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 | [OWN: Ontiver xss] [DOC: Tailwind] |
| Container | `--container-max` 150rem (2400px) for editorial; 75rem (1200px) left-aligned for B2B; 80rem (`max-w-7xl`) for playful | [OWN] [3P: Ramp] |
| Text cap | 45rem / 32.5rem | [OWN] |
| Section dividers | `border-block-start: 1px solid var(--color-line)` between sibling sections | [OWN: Ontiver base.css] |
| Hairline grid | `gap: 1px` on a `line`-coloured background; cells sit on canvas so gaps read as rules | [OWN: Ontiver section-grids.css] |
| Grid columns | 1 col → 3 at ≥768px → 4 at ≥1280px for four-up variants | [OWN] |
| Alignment | Choose left, centre or justified per section and write it in `wireframes.md`. Default left for B2B and finance. | [DOC: Anthropic skill] |
| Page length | About 6–9 sections; one primary CTA per section | [OWN] |

Avoid: centred hero followed by three icon boxes. Use an editorial split, a product screenshot or owned photo, and numbered items only for real sequences. Bento only when the content has a real hierarchy. [3P: StudioMeyer]

## 6. Radii

Three meaningful steps plus pill. Never one radius everywhere.

| Token | Base | Meaning |
|---|---|---|
| `radius-control` | 0.625rem (10px) | Buttons, inputs, chips |
| `radius-card` | 1.25rem (20px) | Cards, media [OWN: Ontiver 20px media] |
| `radius-panel` | 1.5rem (24px) | Large surfaces [OWN: Ontiver `.surface-card`] |
| `radius-pill` | 9999px | Tags, toggles, pill buttons if the niche uses them |

Grids drawn with hairlines use 0 radius. [OWN] Every radius in components comes from these tokens; `rounded-[2.35rem]` is a lint failure. [OWN defect: QuickBite]

Niche overrides (control / card / panel):

| Niche | Values |
|---|---|
| Fintech | 8–10 / 12–16 / 20–24px |
| B2B | 6 / 10–12 / 16px |
| Gaming | 0 / 0 / 0 (pill only for tags) |
| Playful | 16 / 20–32 / 40px + pill |
| Studio | 0 or full; pick one |

## 7. Borders vs shadows (elevation)

| Level | Treatment | Use |
|---|---|---|
| 0 | 1px hairline (`line`) | Default for cards, sections, tables, grids |
| 1 | Tone shift to `canvas-raised` | Raised cards, sticky header, panels |
| 2 | One shadow, `--shadow-overlay: 0 8px 24px #001b1426` | Menus, popovers, dialogs, toasts only |

[OWN: Ontiver has about 9 shadows in the whole codebase; QuickBite disables `box-shadow` globally] [3P: Ramp, Wise "hairline-and-tone"]

- `--shadow-*: initial` removes Tailwind's shadow scale.
- No soft grey shadow on every card. That is the "SaaS-card kit" tell. [DOC: Anthropic skill]
- Playful niche may use solid, unblurred offset shadows ("stickers", 3D buttons) in a darker paired shade. Never blurred. [OWN: QuickBite] [3P: Duolingo]
- Hairlines everywhere with nothing else reads as the "broadsheet" template. Pair hairlines with photography and at least two radius steps. [DOC: Anthropic skill]

## 8. Icons

| Rule | Value |
|---|---|
| Families per project | One. Set the shadcn preset's icon library to it so generated components do not import lucide alongside. |
| Default family | Phosphor (MIT) |
| Style | Outline. Stroke about 1.5–1.75 at 20–24px. Ontiver custom 1.65, QuickBite lucide 1.75. [OWN] |
| Colour | `currentColor` |
| Sizes | 16px dense UI, 20px controls, 24px nav and empty states [SYN] |
| Chips | Optional 32px round chip, `line` border, `canvas-muted` fill, `brand-strong` icon [OWN: QuickBite chip `size-8`] |
| Filled or duotone | Only for active or selected state |
| Decorative icons | `aria-hidden="true"` [OWN: Ontiver createIcon] |
| Icon-only buttons | Must have `aria-label` |
| Do not | Put an icon on every button; use generic shield/lock icons as "security" proof [SYN] |

## 9. Imagery and illustration

| Rule | Detail |
|---|---|
| Photography first | Owned or curated real photography, one grade per site (e.g. Ontiver: "soft natural light and warm neutral surroundings; keep the people and their task legible when cropped"). [OWN] |
| Provenance ledger | `sources.json` in every image folder: source URL, author, licence, date, edits. [OWN: QuickBite] |
| Product UI | Real screenshots, not mockups. [SYN] |
| Illustration | unDraw only for empty, onboarding and 404 states, recoloured to tokens, downloaded into the repo. Never in the hero. [DOC: unDraw licence] [SYN] |
| Mascot | Playful niche only, as SVG or Rive, `aria-hidden` when decorative. [3P: Duolingo] |
| 3D | Only when it shows the product. One material. [3P: Muzli, StudioMeyer] |
| Banned | Stock people at laptops, handshake photos, plastic AI illustration, abstract floating blobs and orbs. [3P: 925 Studios, Muzli] |
| Technical | Explicit `width`/`height` or `aspect-ratio`; AVIF/WebP via `srcset`/`sizes`; `loading="lazy"` below the fold; `fetchpriority="high"` on the LCP image. [SYN] |
| Alt text | Written in `text-copy.md`. Decorative images get `alt=""`. |

## 10. Component behaviour (summary; full specs in `components.md`)

- Every interactive element has default, hover, focus-visible, active, disabled and (where relevant) loading and error states.
- Hover must do something visible. A hover state that does nothing is a tell. [3P: 925 Studios]
- `button` for actions, `a` for navigation. Native form controls with `<label>`.
- Disabled buttons stay visible and readable; explain why they are disabled when it is not obvious. [3P: Duolingo]
- No hover-only reveals of information. [3P: gaming-patterns]
- Variants map props to token classes (cva or equivalent). No one-off values.

## 11. States matrix (required for every data-bearing view)

| State | What to show |
|---|---|
| Empty | One sentence on what will appear, one primary action |
| Loading | Skeleton matching the final layout (no CLS). Name what is loading if >1s. |
| Partial | Loaded rows plus an inline notice for what failed |
| Error | What happened, what to do next, a way to dismiss or retry |
| Pending | Expected time (finance: required) |
| Success | Past-tense confirmation that mirrors the action verb |
| Offline | What still works, what will sync |
| Finance adds | Reversed, failed (and whether money moved) |

## 12. Dark mode

- Opt-in via `data-theme="dark"`, only when the PRD asks for it. The OS setting does not flip a page with no designed dark theme. [SYN]
- Dark mode swaps the semantic layer only. Components never reference primitives. [SYN]
- Dark canvas is tinted (brand hue), never `#000`. Text is off-white ("bone"), never `#fff` for body. [OWN] [3P: Valorant]
- Use 2–3 stepped dark surfaces for elevation instead of shadows. [3P: Valorant, Mercury]
- Desaturate status colours for dark (Mercury: credit `#34D399`, debit `#F87171`, pending `#FBBF24`). [3P]
- Re-declare every derived token in the dark block: CSS variables resolve where they are declared, so a `color-mix()` defined in `:root` will not follow a changed `--color-brand`.
- Recheck the contrast table in dark mode.

Base dark values (from Ontiver's dark bands) are in `theme.css` section 4.

## 13. Accessibility (design-side; gates in `qa-gates.md`)

| Requirement | Value |
|---|---|
| Text contrast | 4.5:1 body; 3:1 large (≥24px or ≥18.66px bold) [WCAG 1.4.3] |
| Non-text contrast | 3:1 for UI components, focus rings, meaningful icons and chart marks [WCAG 1.4.11] |
| Target size | ≥24×24 CSS px (2.5.8 AA); kit default 44px for primary controls; 44–48px for touch-first gaming and playful |
| Focus | Visible ring, not hidden by sticky header (2.4.11) |
| Colour-only meaning | Forbidden; add sign, icon, label or shape |
| Dragging | Single-pointer alternative (2.5.7) |
| Help | Same place on every page (3.2.6) |
| Forms | No redundant entry (3.3.7); no cognitive tests for login, allow paste and password managers (3.3.8) |
| Structure | Landmarks, one `h1`, no skipped heading levels |
| Motion | Reduced-motion path for everything; pause control for loops and video; ≤3 flashes/s |

## 14. Do / don't

| Do | Don't |
|---|---|
| Tinted canvas, one accent, hue-tinted ink | Pure white page, pure black text, a second "just for this" colour |
| Hairlines and tone shifts | Same soft shadow on every card |
| Three radius steps tied to meaning | One radius everywhere; arbitrary `rounded-[…]` |
| A display face from the niche profile, tuned tracking | Untuned Inter/Roboto/Arial as the only face |
| Accent on a whole second headline line | Accent on a single word |
| Precise figures with a source | "200+" bands, logo walls without numbers |
| Owned photography with a ledger | Stock laptops, unDraw in the hero |
| One signature effect | Gradients, blobs, glass and parallax together |
