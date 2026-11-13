# Toolkit

What the agent may install, how, and under which licence terms. The niche profile picks from this list. Anything not listed needs the human's approval and a row in the licence register.

Status as of November 2026. Labels: [DOC] confirmed from a primary source this research cycle; [3P] aggregator or third party; [SYN] selection rule or background knowledge, not verified.

## 1. Selection rules

1. **shadcn/ui is the base in every niche.** Install it first so `components.json` aliases and `cn` exist before any registry item references them. [SYN]
2. **Start with CSS motion.** Add Motion or GSAP only when a niche file or a written PRD reason calls for it. Never both without a reason. [OWN] [SYN]
3. **One icon family, one weight, one style per project.** Fill or duotone only for active states. [SYN]
4. **At most 2 font families plus 1 mono.** [DOC: Anthropic skill]
5. **Effects: 1–2 per page.** Retheme every imported effect to tokens, add reduced-motion guards, never stack background effects (beams + grids + meteors). [3P: PkgPulse] [SYN]
6. **Preview before writing.** `shadcn add <item> --dry-run`, then `--diff` for updates. [DOC: shadcn CLI v4]
7. **Copied code is your code.** Aceternity, Magic UI, React Bits and Cult UI are copied into the repo. You own them and must retheme them. [DOC]
8. **Licence before install.** If the register below says "check", check before the first commit.

## 2. Niche matrix [SYN]

| Niche | Components | Icons | Fonts | Motion engine | Illustration |
|---|---|---|---|---|---|
| Fintech | shadcn only; ≤1 Magic UI number ticker for marketing stats | Phosphor regular/light | Onest (consumer) or Geist (B2B-facing) + Geist Mono | CSS + Motion for dialogs | None in hero; unDraw for empty states |
| B2B | shadcn; Cult UI for one detail | Phosphor regular, or Hugeicons free | Aspekta alone, or Geist + Geist Mono | CSS + Motion | unDraw for empty states, recoloured |
| Gaming | shadcn + Aceternity or Skiper UI, rethemed | Phosphor bold; fill for active | Clash Display + Onest; mono for stats | GSAP or Motion; video hero | None; key art and renders |
| Playful | shadcn + Magic UI / React Bits; one uiverse micro-interaction ported to tokens | Hugeicons stroke-rounded, or Phosphor duotone for active | Clash Display or DM Sans display + Onest/DM Sans | Motion springs; Rive for a mascot | Own mascot or cut-outs; unDraw for empty/404 |
| Studio | React Bits text effects, Skiper UI, custom WebGL | Phosphor thin/light, rarely | Playfair Display + Geist, or Clash Display + Geist Mono | GSAP + ScrollTrigger + Lenis; Three.js if the scene is the content | None; owned photography or 3D |

## 3. Install commands

### 3.1 Base (Next.js + Tailwind v4)

```bash
# New project with shadcn (CLI v4). Base UI is the default primitive since July 2026.
pnpm dlx shadcn@latest init -t next            # or: --preset <team-code>
pnpm dlx shadcn@latest info                    # confirm framework, CSS vars, components
pnpm dlx skills add shadcn/ui                  # gives coding agents shadcn context

# Components: preview, then add
pnpm dlx shadcn@latest add button --dry-run
pnpm dlx shadcn@latest add button card dialog input select tabs accordion sonner

# Private team base (registry:base), once published
pnpm dlx shadcn@latest add <org>/<repo>/<item>  # auth: gh auth login or GH_TOKEN in CI

# Existing projects on clsx + tailwind-merge
pnpm dlx shadcn@latest migrate cn
```

[DOC: shadcn CLI v4 changelog, shadcn changelog]. The exact `--base` flag value for Base UI is unconfirmed; `--base radix` is documented. Then replace the generated theme with `core/tokens/theme.css`.

### 3.2 Effect libraries (one component at a time)

```bash
npx shadcn@latest add "https://reactbits.dev/r/split-text"                 # React Bits
npx jsrepo add github/DavidHDev/react-bits/text-animations/split-text      # React Bits, alt
npx shadcn@latest add "https://ui.aceternity.com/registry/spotlight.json"  # Aceternity
# Magic UI and Cult UI also install through the shadcn CLI by registry URL.
```

[3P: PkgPulse] [DOC: Cult UI GitHub]

### 3.3 Icons

```bash
pnpm add @phosphor-icons/react                              # default; RSC: import from '@phosphor-icons/react/ssr'
pnpm add @hugeicons/react @hugeicons/core-free-icons        # Hugeicons free (Stroke Rounded)
```

Phosphor: weights thin, light, regular, bold, fill, duotone; props `color`, `size`, `weight`, `mirrored`; `IconContext.Provider` for defaults (not read by `/ssr` icons); names end in `Icon` (`HeartIcon`); legacy `phosphor-react` gets no new icons. [DOC: Phosphor README 2.1.10]

### 3.4 Fonts

```ts
// next/font (self-hosts, no layout shift)
import { Geist, Geist_Mono, Onest, DM_Sans, Playfair_Display } from "next/font/google"; // [SYN] names per next/font/google
import localFont from "next/font/local";
const aspekta = localFont({ src: "./fonts/<aspekta-variable>.woff2", variable: "--font-display" }); // from GitHub releases
const clash   = localFont({ src: "./fonts/<clash-display>.woff2", variable: "--font-display" }); // from Fontshare; never commit to a public repo
```

Or `pnpm dlx shadcn@latest add font-<name>` for registry fonts. [DOC: CLI v4 `registry:font`]
Use `@theme inline` when `--font-display` references a `next/font` variable. [DOC: Tailwind]

### 3.5 Motion

```bash
pnpm add motion            # import from 'motion/react'; use LazyMotion + m; useReducedMotion
pnpm add gsap @gsap/react  # gsap.registerPlugin(ScrollTrigger, SplitText); useGSAP in client components
pnpm add lenis             # 'lenis/react'; marketing pages only
pnpm add @rive-app/react-canvas            # stateful mascot
pnpm add @lottiefiles/dotlottie-react      # After Effects exports
```

GSAP 3.15.x is current [DOC]. Motion, Lenis and Rive APIs above are background knowledge [SYN]; check their docs.

## 4. Libraries at a glance

| Library | What it is | Best fit | Watch out |
|---|---|---|---|
| shadcn/ui | CLI + registry; presets, `registry:base`, `registry:font`, private GitHub registries; Base UI default, Radix and React Aria available | Base everywhere | Set the preset's icon library to your family |
| Aceternity UI | ~50 free animated components; needs Motion | Dark landing pages, dramatic effects | Weak in light mode; purple demo styling; no full reduced-motion support [3P] |
| Magic UI | 150+ components; Motion peer dep | Broad selection, prototypes | Few props, you edit source [3P] |
| React Bits | 110+ components; CSS/WAAPI where possible, Motion optional | Performance-sensitive, custom brand, text effects | Licence: check LICENSE file [3P] |
| Cult UI | "150+ free shadcn/ui components ... MIT licensed" | One crafted detail in B2B | |
| Skiper UI | Animated collection, paid pricing exists | Gaming, studio | Free/pro split and licence unconfirmed |
| 21st.dev | Marketplace of shadcn-style libraries | Discovery | Licence is per author |
| uiverse.io | Community snippets, "Free for personal and commercial use" | One micro-interaction (button, loader, toggle) | Port to tokens; avoid its glass, neumorphism and neon presets |
| shuffle.dev | Paid builder, 13,400+ components incl. shadcn | Structure ideas only | Its category list is the generic SaaS skeleton |
| Motion | React animation (`motion/react`) | Springs, layout and exit animation | ≈125KB [3P estimate] |
| GSAP | Timelines, ScrollTrigger, SplitText; all plugins free | Scroll-heavy marketing, studio | Standard License, not MIT |
| Lenis | Smooth scroll | Marketing pages | Never in app UI; off under reduced motion |
| Rive | State-machine vector animation | Mascots, interactive onboarding | Retest on target devices |
| Lottie | After Effects export | Existing AE workflows | Heavier at runtime in the one benchmark [3P: Callstack] |
| Three.js | WebGL | Studio when the scene is the content | Low-end device budget from week one |

React Native: React Native Reusables is the closest shadcn equivalent; gluestack for managed upgrades; Tamagui for web + native compiler performance. [3P: VP0]

## 5. Colour tools [SYN, none verified this session]

| Tool | Use |
|---|---|
| OKLCH in Tailwind v4 | Generate scales with even lightness steps; record step distances |
| Radix Colors | 12-step scales with roles: 1–2 backgrounds, 3–5 component states, 6–8 borders, 9–10 solid fills, 11–12 text |
| uicolors.app | Tailwind 50–950 scale from one hex |
| Coolors | Palette exploration, contrast checker |
| Realtime Colors | Preview text/background/primary/accent on a live page; export CSS or Tailwind |
| `color-mix(in srgb, …)` | Derive shades from one brand hex in CSS [OWN: QuickBite] |

Recipe: neutral scale + one brand hue → generate scale → map to semantic tokens → check 4.5:1 and 3:1 in both modes → reserve saturated brand for primary actions.

## 6. Licence register

| Item | Licence status | Rule for the agent |
|---|---|---|
| shadcn/ui | Open source (copy-in) | Default |
| Cult UI | MIT (stated in repo) [DOC] | Default |
| Aceternity, Magic UI | Listed as MIT by aggregator; Pro tiers paid [3P] | Free tiers only unless `PRD.md` records a Pro licence |
| React Bits | Listed as MIT by aggregator; reported earlier as "MIT + Commons Clause" [3P] | **Check** the repo LICENSE before first commit |
| Skiper UI | Paid pricing exists; licence unconfirmed | **Check** per component |
| 21st.dev | Depends on each author | Record the author licence here per component |
| uiverse.io | "Free for personal and commercial use" [DOC] | Port to tokens; never paste raw |
| shuffle.dev | Paid; terms vary by plan | Structure ideas only |
| **Hugeicons** | Free tier: 4,500+ Stroke Rounded, "All rights reserved"; free to use, not open source. Pro (40,000+, 9 styles) proprietary [DOC] | Never redistribute the SVGs in your own package; never commit Pro icons to a public repo |
| **Iconsax** | `iconsax-react` last listed at 0.0.8; React packages are community forks [DOC] | Avoid in React. If the design needs it, vendor SVGs after confirming the official licence |
| Phosphor | MIT [DOC] | Default icon set |
| Aspekta | OFL-1.1, 20 weights (50–1000), variable, ss01–ss14 [DOC] | Self-host from GitHub releases |
| Onest | On Fontsource [DOC]; believed OFL [SYN] | **Check** before launch |
| DM Sans, Geist, Geist Mono, Playfair Display | Believed OFL [SYN] | **Check** before launch |
| **Clash Display** | Fontshare (Indian Type Foundry), ITF Free Font Licence; believed free for commercial use, not OFL, not redistributable [SYN] | Self-host via `next/font/local`; never commit font files to a public repo or package them; recheck Fontshare terms |
| **GSAP** | Free incl. former Club plugins, GSAP Standard License (not MIT); `gsap-trial` deprecated [DOC] | Fine for sites; read the licence before building any tool that competes with Webflow |
| **unDraw** | Free commercial use, modification allowed, no credit. Forbidden: competing services, packs, hotlinking or bulk scraping without consent, AI/ML training; advises against use where illustrations are the product's core [DOC] | Download into the repo, recolour, empty states only, never in a dataset |
| Motion, Lenis, Rive, Lottie, Three.js | Not checked this session | **Check** before first commit |

### Per-project additions

| Item | Version | Licence | Checked by / date | Notes |
|---|---|---|---|---|
| | | | | |

## 7. Check before publish

- [ ] Clash Display, Onest, DM Sans, Geist, Playfair Display licence terms
- [ ] Skiper UI licence and free/pro split
- [ ] React Bits LICENSE file
- [ ] The `--base` flag value for Base UI in `shadcn init`
- [ ] ₦ (U+20A6) and other required glyphs present in every chosen font
- [ ] Every imported effect: rethemed to tokens, reduced-motion guard added, demo colours removed

## 8. Retheme-before-use checklist (any imported effect)

- [ ] All colours replaced with semantic tokens; no hex, no default palette
- [ ] Radii, durations and easings replaced with kit tokens
- [ ] Gradient, glow and blur defaults removed unless the niche allows them
- [ ] `prefers-reduced-motion` path added and tested
- [ ] Works in light mode (Aceternity defaults are dark)
- [ ] Keyboard and screen-reader behaviour checked
- [ ] Bundle cost noted; Motion/GSAP not added twice
- [ ] Source URL and licence recorded in the register
