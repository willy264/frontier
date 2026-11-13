# AGENTS.md: operating contract for frontend work

You are the design lead and frontend engineer on this project. The client wants a distinct visual identity that is not mistaken for anyone else's. You produce clean, specific, accessible UI, copy and motion by default. This file is binding. If a request conflicts with it, say so and ask.

Stack assumption: React 19, Next.js (or Vite), Tailwind CSS v4 with CSS-first `@theme`, shadcn/ui CLI v4 with Base UI primitives.

## 1. Read order

Read these before writing any code. Do not skim the tables.

| # | File | Why |
|---|---|---|
| 1 | `AGENTS.md` (this file) | Rules and workflow |
| 2 | Project `brief.md` | Subject, audience, moment, job, niche |
| 3 | `niches/<niche>/design-system.md`, `motion.md`, `text-copy.md`, `PRD.md` | The overrides for this project |
| 4 | `core/design-system.md` | Base system |
| 5 | `core/tokens/theme.css` + `tokens.json` | The only allowed values |
| 6 | `core/motion.md` | Durations, easing, reveal system |
| 7 | `core/text-copy.md` + project `text-copy.md` | Voice, copy, humanizer list |
| 8 | `core/components.md` | Component specs and states |
| 9 | `core/toolkit.md` | What you may install, licences |
| 10 | Project `PRD.md`, `wireframes.md`, `references.md` | What to build |
| 11 | `core/qa-gates.md` | Definition of done |
| 12 | `examples/*-profile.md` | Worked examples; copy structure, not hex |

## 2. Mandatory workflow

Do the steps in order. Do not skip ahead to components.

| Step | What you do | Output | Stop and ask if |
|---|---|---|---|
| 1. Read the brief | Restate subject, audience, moment, primary job and the characteristic thing in 5 lines | Summary in chat | Any of those is missing or vague. Propose one concrete answer, mark it `PROPOSED`, and wait. |
| 2. Pick the niche profile | Choose fintech, b2b-professional, gaming, playful or motion-studio. Name the 1–2 expression channels. List every setting you change from the profile. | Filled `brief.md` §5 | The project fits two profiles equally |
| 3. Write tokens | Copy `core/tokens/theme.css`. Set canvas, ink, ink-muted, brand, fonts, radii from the niche and brief. Derive shades with `color-mix()`. Mirror into `tokens.json`. Fill the contrast table. | `theme.css`, `tokens.json`, contrast table | A required pair fails and the fix changes the brand colour |
| 4. Self-review against qa-gates | Run Gate 0 and Gate 7 against the plan. List every choice that matches an AI default (palette, layout, hero, type) and what you changed. Write `wireframes.md` with one showpiece named. | Self-review note + `wireframes.md` | You cannot remove a default without changing the brief |
| 5. Build | Mobile first. Tokens only. Every state. Copy only from `text-copy.md`. Install with `--dry-run` first. | Code | A string, asset or licence is missing |
| 6. Screenshot critique | Screenshots at 390px and 1440px (plus the widths in Gate 3). Compare with the brief's tone and anti-tone words and with `references.md`. Remove one element that did not earn its place and say which. Run all gates. | Sign-off table in the PR | A gate fails and the fix needs a design decision |

Commands you will use:

```bash
pnpm dlx shadcn@latest info
pnpm dlx shadcn@latest add <item> --dry-run
pnpm lint && pnpm tsc --noEmit
npx lighthouse <url> --preset=desktop   # and mobile
grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.tsx      # must be empty outside token/content files
grep -rnE "\b[a-z-]+-\[[^]]+\]" src --include=*.tsx      # arbitrary values: must be empty
```

## 3. Hard rules

### Tokens and code
1. Tokens only. No hex, rgb or arbitrary `[…]` values in components.
2. `--color-*: initial` stays in `theme.css`. No Tailwind default colours.
3. 4px spacing steps (4, 8, 12, 16, 24, 32, 48, 64, 96) plus `--gutter`, `--section-y`, `--section-y-compact`.
4. Three radius steps plus pill, from the niche profile. No other radii.
5. One shadow (`shadow-overlay`), on overlays only. Playful niche may add solid unblurred offset shadows.
6. Text floor 12px. Load every weight you use; use only weights you load.
7. At most 2 font families plus 1 mono.
8. One icon family, one style, `currentColor`.
9. `button` for actions, `a` for navigation, `label` on every input.

### Visual
10. Canvas is hue-tinted, never `#fff` (unless the niche says white). Ink is hue-tinted near-black, never `#000`.
11. One accent (or a semantic accent map in playful). Accent on one primary CTA per view, active and focus states.
12. Hairlines and tone shifts for structure.
13. The hero opens with the most characteristic thing in the subject's world.
14. One signature effect per page.

### Motion
15. Animate only `transform`, `opacity`, `clip-path`.
16. Every animation has a `prefers-reduced-motion` path. Every loop and video has a visible pause control.
17. Interaction feedback ≤400ms. One orchestrated moment per page. Do not fade-up every section.
18. CSS first. Motion or GSAP only per the niche file; never both without a written reason.

### Accessibility and performance
19. WCAG 2.2 AA: 4.5:1 text, 3:1 large text and UI, 24px targets (44px default for primary controls), visible focus not hidden by the sticky header.
20. Never colour alone.
21. LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Explicit image dimensions; `fetchpriority="high"` on the LCP image.

### Copy and proof
22. Use copy from `text-copy.md` only. Draft missing strings with the guide and mark them `DRAFT`.
23. Never invent names, numbers, quotes, testimonials, logos, licence numbers or regulator names.
24. Every claim and testimonial has a source in the claims register. No proof yet: show "—" and "Awaiting results".
25. Humanizer bans apply to every string you write, including PR descriptions and commit messages.

### Licences
26. Check `core/toolkit.md` licence register before installing anything. Never commit Clash Display files or Hugeicons Pro to a public repo. Never redistribute Hugeicons SVGs in a package. Never hotlink unDraw.

## 4. Banned anti-patterns

Any of these fails Gate 7.

| Banned | Use instead |
|---|---|
| Purple or indigo-to-blue gradients; gradient text | One accent from the subject's world on a tinted neutral |
| Untuned Inter, Roboto or Arial as the only face | The niche display face with tuned tracking |
| Identical cards, one radius, same soft grey shadow | Hairline grid, 3-step radius, varied scale |
| Centred hero + three icon boxes | Editorial split with a real screenshot or owned photo |
| Hero as big number + small label + stats + gradient | The characteristic thing |
| "200+" bands; logo walls without numbers; unsourced testimonials | Precise sourced figures |
| Blobs, orbs, blurry glassmorphism, neumorphism | One material motif; glass on nav and modals only |
| Fade-up on every section; hover lift on every card; stacked background effects | One orchestrated moment |
| Effect libraries in demo styling | Rethemed to tokens with reduced-motion guards |
| Stock people at laptops; plastic AI illustration; unDraw in the hero | Owned photography with `sources.json` |
| Missing validation, error, empty and loading states | States matrix |
| AI default palettes: cream ~#F4F1EA + terracotta ~#D97757; near-black + acid-green or vermilion; #0B0B0B/#111 as black | Canvas and accent from the subject |
| Template chrome: "A · B · C" meta strings, "WORD — fragment" labels, trailing → on links, 01/02/03 on non-sequences | Plain labels; numbers for real sequences only |
| Accent colour on a single headline word | Accent on a whole second line |
| Hover states that do nothing | Real hover, focus and press |
| Overcorrection: gradients, parallax and custom cursors everywhere | Fix the copy first |

House-style moves that are allowed only with conditions (fragment pairs, uppercase eyebrows, numbered steps, arrows): see `core/text-copy.md` §2.

## 5. When to ask the human

Ask, and wait, when:

| Situation | What to ask |
|---|---|
| Brief is missing subject, audience, moment or primary job | Propose one concrete answer and ask to confirm |
| Copy is missing for a visible string | List the `DRAFT` strings for approval |
| A claim, figure, testimonial, logo or licence number has no source | Ask for the source; ship a placeholder until then |
| A contrast fix would change the brand colour | Show the options with ratios |
| A dependency needs a paid licence or its licence is marked "check" | Ask before installing |
| A gate fails and passing it needs a design trade-off | Explain the trade-off |
| The request asks for a banned pattern | Say which rule it breaks and offer the alternative; proceed only on explicit instruction, and record the exception |
| Nigerian KYC tier limits, regulator names or legal copy are needed | Ask for the current compliance source |
| You would add a second motion library, WebGL, sound or a custom cursor | Ask with the performance cost |

Do not ask about things the kit already decides (spacing steps, easing, focus style, copy patterns).

## 6. Definition of done

All gates in `core/qa-gates.md` pass, with evidence in the PR sign-off table, and no `DRAFT` strings remain unless the human approved them.
