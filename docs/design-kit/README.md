# Design kit

A document kit for AI coding agents starting a new frontend project (React/Next.js, Tailwind CSS v4, shadcn/ui). It turns the recipe shared by two shipped sites, Ontiver and QuickBite, into rules an agent can follow: tinted canvas, one accent, hue-tinted ink, hairlines instead of shadows, fluid type with tight tracking, one easing curve, honest and specific copy.

Most of the clean look comes from constraint. The kit removes options (default palette, arbitrary values, extra effects), fixes the defects found in both sites, and exposes a few settings per niche.

Source: research report "Clean frontend design playbook" and its notes (Nov 2026). Values carry provenance labels:

| Label | Meaning |
|---|---|
| [OWN] | From Ontiver or QuickBite source (clones of 12 Nov 2026) |
| [DOC] | From a primary design-system or standards document |
| [3P] | Third-party extraction from a live site; indicative only |
| [SYN] | Synthesis or practitioner convention, not verified |

## Contents

```
design-kit/
├── README.md                    this file
├── AGENTS.md                    operating contract: workflow, hard rules, bans, when to ask
├── core/
│   ├── tokens/theme.css         Tailwind v4 @theme starter (palette reset, type, radius, motion, dark)
│   ├── tokens/tokens.json       DTCG 2025.10 source of truth (primitive → semantic → component)
│   ├── design-system.md         colour, type, spacing, layout, radii, elevation, icons, imagery, states, dark, a11y
│   ├── motion.md                easing, duration tiers, reveal system, hover/press, scroll, reduced motion, perf
│   ├── text-copy.md             voice, headline/CTA formulas, microcopy, section patterns, humanizer list
│   ├── components.md            inventory, specs, states, keyboard maps
│   ├── toolkit.md               libraries, install commands, selection rules, licence register
│   ├── qa-gates.md              pass/fail gates: WCAG 2.2 AA, CWV, responsive, motion, tokens, copy, anti-patterns
│   └── templates/
│       ├── brief.md
│       ├── PRD.md
│       ├── wireframes.md
│       └── references.md        moodboard method
├── niches/
│   ├── fintech/                 PRD.md, design-system.md, text-copy.md, motion.md
│   ├── b2b-professional/
│   ├── gaming/
│   ├── playful/
│   └── motion-studio/
└── examples/
    ├── ontiver-profile.md       exact tokens, what to copy, what to avoid
    └── quickbite-profile.md
```

## How to use it on a new project

### 1. Human: set up the project folder

```bash
cp -r design-kit/core/templates docs/          # brief.md, PRD.md, wireframes.md, references.md
cp design-kit/core/tokens/theme.css src/app/theme.css
cp design-kit/core/tokens/tokens.json docs/tokens.tokens.json
cp design-kit/AGENTS.md ./AGENTS.md            # or CLAUDE.md
```

Fill in `docs/brief.md` yourself, at least sections 1–6. A vague brief produces average output.

### 2. Give the agent these files, in this order

| Order | File | Notes |
|---|---|---|
| 1 | `AGENTS.md` | Always first |
| 2 | `docs/brief.md` | Your filled brief |
| 3 | `niches/<niche>/` (all four files) | Only the chosen niche |
| 4 | `core/design-system.md` | |
| 5 | `core/tokens/theme.css`, `tokens.json` | |
| 6 | `core/motion.md` | |
| 7 | `core/text-copy.md` + your project `text-copy.md` if you have one | |
| 8 | `core/components.md` | |
| 9 | `core/toolkit.md` | |
| 10 | `docs/PRD.md`, `docs/references.md` | Agent fills gaps and asks |
| 11 | `core/qa-gates.md` | Definition of done |
| 12 | `examples/ontiver-profile.md` or `quickbite-profile.md` | The one closest to the niche |

If the agent's context is tight, give 1–5 and 11 first, then the rest when it reaches the build step.

### 3. Opening prompt

```
Read AGENTS.md and follow its read order. The brief is docs/brief.md and the niche is <niche>.
Start with workflow step 1 and stop after step 4 (tokens + self-review + wireframes) for my review.
```

### 4. Review points for the human

| After step | Check |
|---|---|
| 1 | The restated brief is specific; the characteristic thing is real |
| 3 | Contrast table passes; accent comes from the subject's world, not from Ontiver or QuickBite |
| 4 | Self-review names real defaults and what changed; one showpiece is named |
| 6 | Gate sign-off table filled with evidence; `DRAFT` strings listed |

## How to pick a niche

| If the product is… | Pick | Expression channel |
|---|---|---|
| Payments, banking, lending, identity, crypto payments, anything where users trust you with money or documents | `fintech` | Type (tabular figures) and one accent |
| SaaS, dev tools, dashboards, agencies, consultancies, law, accounting | `b2b-professional` | Structure and density; one accent or none |
| A game, launcher, esports, web3 game | `gaming` | Type and one hot accent on dark |
| Consumer app with a warm brand: food, learning, lifestyle, community | `playful` | Semantic colour, tactile buttons, mascot |
| Studio, agency portfolio, launch film, art-directed brand site | `motion-studio` | One material or motif, motion |

Tie-breakers:
- Who decides to buy? A finance team or regulated buyer → `fintech` or `b2b-professional`, even if the end user is a consumer.
- Is the work itself the product shown on the page? → `motion-studio`.
- A crypto product that is mainly a game → `gaming` (gameplay first, no wallet-first onboarding). A crypto product that moves money → `fintech`.
- Unsure between two? Pick the calmer one and spend the expression budget on one channel from the other.

A niche changes only: canvas lightness, accent strategy, radius, display face, icon weight, motion engine and copy register. Everything else stays on the base.

## Known gaps

- Licence terms for Clash Display, Onest, DM Sans, Geist, Playfair Display, Skiper UI and React Bits need checking before launch (`core/toolkit.md` §7).
- Values marked [3P] (Ramp, Wise, Mercury, Valorant, Duolingo) come from third-party extraction sites and should be confirmed in DevTools before quoting.
- CBN KYC tier limits and Nigerian regulatory copy rules are not sourced; the fintech PRD asks for them.
- The kit's Lenis default (`lerp 0.12`, `wheelMultiplier 1`) resolves a disagreement between the two repos; see `core/motion.md` §6.
- The playbook suggests publishing the base tokens as a private shadcn `registry:base`. That registry does not exist yet.
