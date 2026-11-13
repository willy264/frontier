# QA gates

A build is done only when every gate below passes. Each item is pass/fail. Record the result and the evidence (tool output, screenshot, ratio) in the PR description. A failed gate blocks the merge; the agent fixes it or asks the human for an explicit, written exception.

## Gate 0: before writing components

| # | Check | Pass when |
|---|---|---|
| 0.1 | Brief exists | `brief.md` has subject, audience, moment of use, primary job, tone and anti-tone words, niche profile, overrides |
| 0.2 | Tokens written | `theme.css` has `--color-*: initial`, the project palette, type, radius, motion tokens |
| 0.3 | Contrast table | Every pair in `design-system.md` §2.3 computed and passing |
| 0.4 | Self-review | Agent listed every token or layout choice that matches an AI default and said what it changed |
| 0.5 | Copy | `text-copy.md` covers every section, or gaps are marked `DRAFT` |
| 0.6 | Licences | Every planned dependency has a row in the toolkit licence register |

## Gate 1: accessibility (WCAG 2.2 AA)

| # | Check | Threshold | How to test |
|---|---|---|---|
| 1.1 | Text contrast | 4.5:1 normal; 3:1 large (≥24px or ≥18.66px bold) | Compute from tokens; axe; spot-check over photos |
| 1.2 | Non-text contrast | 3:1 for input borders, focus rings, icons that carry meaning, chart marks | Compute |
| 1.3 | Target size | ≥24×24 CSS px (2.5.8); 44–48px on touch-first gaming and playful | DevTools |
| 1.4 | Focus visible | Every interactive element shows the ring on keyboard focus | Tab through every page |
| 1.5 | Focus not obscured | Sticky header never fully hides the focused element (2.4.11) | Tab through with header pinned |
| 1.6 | Keyboard | All actions reachable and operable; no traps; Esc closes overlays; focus returns to trigger | Manual |
| 1.7 | Dragging | Every drag has a single-pointer alternative (2.5.7) | Manual |
| 1.8 | Consistent help | Help/contact link in the same place on every page (3.2.6) | Manual |
| 1.9 | Redundant entry | No re-entering data already given in the same flow (3.3.7) | Manual |
| 1.10 | Accessible auth | No cognitive test; paste and password managers allowed (3.3.8) | Manual |
| 1.11 | Colour-only meaning | None; sign, icon, label or shape added | Grayscale screenshot |
| 1.12 | Structure | Landmarks; one `h1`; no skipped heading levels; `button` for actions, `a` for navigation | axe, headings list |
| 1.13 | Forms | Every input has a label; errors linked with `aria-describedby`; required marked | axe, manual |
| 1.14 | Images | Meaningful images have alt from `text-copy.md`; decorative `alt=""` | Manual |
| 1.15 | Zoom/reflow | Usable at 200% zoom and 320px width without horizontal scroll | Browser |
| 1.16 | Automated | axe (or Lighthouse accessibility) reports zero violations | CI output |

## Gate 2: performance (Core Web Vitals)

| # | Check | Threshold | Source |
|---|---|---|---|
| 2.1 | LCP | ≤2.5s at p75, mobile and desktop | [DOC: web.dev] |
| 2.2 | INP | ≤200ms at p75 | [DOC: web.dev] |
| 2.3 | CLS | ≤0.1 at p75 | [DOC: web.dev] |
| 2.4 | Fonts | Self-hosted subset WOFF2; only the critical face preloaded; only used weights loaded | [OWN: Ontiver] [SYN] |
| 2.5 | Images | Explicit dimensions or `aspect-ratio` on every image; AVIF/WebP; lazy below the fold; `fetchpriority="high"` on the LCP image | [SYN] |
| 2.6 | JS motion | Motion and GSAP not both shipped without a written reason | [SYN] |
| 2.7 | Lenis | Marketing pages only | [SYN] |
| 2.8 | WebGL | Measured on a named low-end device; frame rate and load recorded | [DOC: igloo case study] |
| 2.9 | Hero | LCP text visible in the first rendered frame (not waiting on JS reveal) | [SYN] |

Lab check: Lighthouse mobile run on the production build. Field data replaces lab once available.

## Gate 3: responsive

| # | Check | Pass when |
|---|---|---|
| 3.1 | Widths | Screenshots at 360, 450, 768, 1024, 1280, 1536 and 1920px show no overflow, overlap or orphaned single words in headings |
| 3.2 | Mobile first | Single column on mobile unless `wireframes.md` says otherwise |
| 3.3 | Touch | No hover-only information; hover effects wrapped in `@media (hover: hover)` |
| 3.4 | Measure | Body text ≤ `--measure` at every width |
| 3.5 | Type | Fluid clamps never drop text below 12px |
| 3.6 | Gutters | `--gutter` and `--section-y` used for every section; no ad-hoc section padding |
| 3.7 | Orientation | Works in portrait and landscape on phone |

## Gate 4: motion

| # | Check | Pass when |
|---|---|---|
| 4.1 | Reduced motion | With OS reduced motion on: no translate/scale, no loops, no parallax, no Lenis, video shows poster |
| 4.2 | Pause control | Visible control for every ambient loop, marquee and background video |
| 4.3 | Flashing | ≤3 flashes per second |
| 4.4 | Properties | Only `transform`, `opacity`, `clip-path` animated |
| 4.5 | Durations | Interaction feedback ≤400ms; reveals and showpiece within `motion.md` tiers |
| 4.6 | One showpiece | Exactly one orchestrated moment per page, named in `wireframes.md` |
| 4.7 | No blanket reveals | Not every section fades up; not every card lifts on hover |
| 4.8 | Easing | Only kit easing tokens used |
| 4.9 | Imported effects | Reduced-motion guard added to each |
| 4.10 | Sound | Off by default |

## Gate 5: tokens and code

| # | Check | How to test |
|---|---|---|
| 5.1 | No hex in components | `grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.tsx --include=*.ts` returns only token files and content data |
| 5.2 | No arbitrary values | `grep -rnE "\b[a-z-]+-\[[^]]+\]" src --include=*.tsx` returns nothing (or only listed exceptions) |
| 5.3 | No default palette | Build fails if a default colour is used (palette reset makes it a no-op; also grep `(indigo|violet|purple|slate|gray|zinc)-[0-9]`) |
| 5.4 | No unloaded weights | Every `font-*` weight class maps to a loaded weight |
| 5.5 | Text floor | No `text-[…]` below 0.75rem; no `text-[10px]` |
| 5.6 | Radii | Only `rounded-control`, `rounded-card`, `rounded-panel`, `rounded-pill`, `rounded-none` |
| 5.7 | Shadows | Only `shadow-overlay`, and only on overlays |
| 5.8 | One icon family | Only the chosen package imported (`grep -rn "lucide-react"` empty if Phosphor chosen) |
| 5.9 | tokens.json ↔ theme.css | Values match |
| 5.10 | Lint/types | `pnpm lint` and `pnpm tsc --noEmit` pass |

## Gate 6: copy

| # | Check | Pass when |
|---|---|---|
| 6.1 | Source of strings | Every visible string is in `text-copy.md` or flagged `DRAFT` and listed for the human |
| 6.2 | Humanizer scan | Zero banned words (list in `text-copy.md` §8); no "not X but Y"; no em-dash connectors; no reflexive triads |
| 6.3 | Headline | H1 names what the product is or does |
| 6.4 | CTAs | Verb + object, 1–3 words; one primary per section |
| 6.5 | Errors, empty, loading, success | Follow `text-copy.md` §5 |
| 6.6 | Proof | Every claim and testimonial has a row in the claims register with a source; no filler logos |
| 6.7 | House style permissions | Fragments, accent lines, eyebrows, numbering and arrows meet the conditions |
| 6.8 | Locale | One spelling standard throughout |

Quick scan:

```bash
grep -rniE "delve|tapestry|testament|pivotal|seamless|elevate|unlock|leverage|robust|landscape|foster|crucial|enhance|showcase|best-in-class|revolutioni[sz]e|fast-paced|not just|—" src/content
```

## Gate 7: anti-patterns

Scan screenshots and code. Any hit fails.

| # | Anti-pattern | Replace with |
|---|---|---|
| 7.1 | Purple or indigo-to-blue gradients; gradient text | One accent from the subject's world on a tinted neutral |
| 7.2 | Untuned Inter, Roboto or Arial as the only face | Niche display face, tuned tracking, tabular numerals |
| 7.3 | SaaS-card kit: identical cards, one radius, same soft shadow | Hairline grids, 3-step radius, varied scale |
| 7.4 | Centred hero followed by three icon boxes | Editorial split, real screenshot or owned photo |
| 7.5 | Hero built as big number + small label + stats + gradient | Hero opens with the most characteristic thing in the subject's world |
| 7.6 | Rounded "200+" bands; logo walls without numbers; unsourced testimonials | Precise figures; proof policy |
| 7.7 | Floating blobs, orbs; blurry glassmorphism; neumorphism | One material motif; glass only on nav and modals |
| 7.8 | Fade-up on every section; hover lift on every card; stacked background effects | One orchestrated moment |
| 7.9 | Effect library left in demo styling | Rethemed to tokens |
| 7.10 | Stock people at laptops; plastic AI illustration; unDraw in hero | Owned photography with ledger; unDraw in empty states only |
| 7.11 | Missing validation, error states, required markers | States matrix built |
| 7.12 | Overcorrection: gradients, parallax and custom cursor everywhere | Fix the copy first |
| 7.13 | AI default palettes: cream ~#F4F1EA + terracotta ~#D97757; near-black + one acid-green or vermilion; #0B0B0B/#111 as black | Canvas and accent from the subject's world |
| 7.14 | Template chrome: "A · B · C" meta strings, "WORD — fragment" labels, trailing → on links | Plain labels |
| 7.15 | Hairlines everywhere with no other variation | Add photography and at least two radius steps |
| 7.16 | Hover states that do nothing | Real hover/focus/press |

## Gate 8: screenshot critique (last step)

| # | Check |
|---|---|
| 8.1 | Full-page screenshots at 390px and 1440px reviewed against `brief.md` tone and anti-tone words |
| 8.2 | One element removed that did not earn its place; say which |
| 8.3 | Could this page be mistaken for another company's? If yes, name what is generic and change it |
| 8.4 | Compare against `references.md`: took what was listed, avoided what was listed |

## Sign-off

| Gate | Result | Evidence | Exception (who approved) |
|---|---|---|---|
| 0 Before build | | | |
| 1 Accessibility | | | |
| 2 Performance | | | |
| 3 Responsive | | | |
| 4 Motion | | | |
| 5 Tokens | | | |
| 6 Copy | | | |
| 7 Anti-patterns | | | |
| 8 Screenshot critique | | | |
