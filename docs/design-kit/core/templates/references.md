# References (moodboard): <project name>

A reference is useful only with a written "take" and "don't take". Copy structure and principles, never another brand's hex values, fonts or illustrations. Ontiver did this well: it adapted Trustly's "white navigation, large editorial introductions, photo mosaics, asymmetric feature tiles" while keeping its own palette and font. [OWN: redesign-reference-notes.md]

## 1. Method

| Step | What to do | Output |
|---|---|---|
| 1. Name the characteristic thing | From `brief.md` §6 | One noun phrase |
| 2. Search by subject, not by style | Search the subject's world first (materials, places, artefacts, the real product), then UI sources | 15–30 raw captures |
| 3. Pull from 4 sources | See table §2 | |
| 4. Cut to 3–6 | Keep only references with one clear lesson each | Final list §4 |
| 5. Write take / don't take | One line each, concrete (a layout move, a type decision, a rhythm) | §4 |
| 6. Anti-references | 2–4 pages this must not look like, and why | §5 |
| 7. Check tokens in DevTools | Before quoting any value from a live site, confirm with `getComputedStyle` and the Fonts panel. Third-party extractions contradict themselves. | Notes |

## 2. Sources

| Source | Good for | Search terms that work | Watch out |
|---|---|---|---|
| Awwwards | Motion, studio and showpiece ideas; full sites with case studies | "<subject> site", Site of the Day by category; read case studies (e.g. igloo.inc) for stack and performance notes | Award sites over-index on WebGL; check performance before copying |
| Godly | Current landing-page craft, type and layout | Browse by category; filter by "light" or "minimal" | Trends converge; avoid the most common look of the month |
| Dribbble | Component and screen ideas, dashboards, mobile flows | "<subject> dashboard", "<subject> onboarding", Dribbble Select Best Shots articles | Shots are often unbuildable or inaccessible; ignore contrast |
| Pinterest | Photography direction, material and colour from the subject's world, moodboards | "<material> texture", "<place> street photography", "<product> flat lay" | Needs login; record the original source in `sources.json`, not the pin |
| The real world | The subject's packaging, signage, uniforms, documents, tools | Photos you take or license | Best source of non-generic accents |

## 3. Your own reference sites

| Site | Take | Don't take |
|---|---|---|
| **Ontiver** (`examples/ontiver-profile.md`) | Tinted sage canvas, hue-tinted ink, one accent; fluid type scale with tight tracking; 1px-gap hairline grids; section hairlines; reveal system and 65ms capped stagger; radial-fill button with slide-through arrow; motion pause toggle; proof policy | Raw hex in components; ~40 near-duplicate greens; `#009311` text (3.37:1); 28%-alpha focus ring |
| **QuickBite** (`examples/quickbite-profile.md`) | Palette reset; `color-mix` shades from one brand hex; global no-shadow rule; solid "sticker" depth; copy in typed content modules; `sources.json` per image folder; local, sensory copy | White on `#FF4D1D` (3.32:1); radius drift (`rounded-[2.35rem]`); text below 12px; `font-black` on an 800-max font; second navy text colour; unsourced testimonials |

## 4. References for this project (3–6)

| # | Reference (name + URL) | Why it is here | Take | Don't take | Screenshot |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

Examples of well-written rows (from the research):

| Reference | Take | Don't take |
|---|---|---|
| Trustly travel page | Hard numbers in proof (99.95% uptime, 0.012% fraud rate); travel photography instead of illustration | The ~30-logo wall |
| noth.in | One owned art direction repeated; bracketed lowercase labels "( The Studio )"; lowercase "book a call" | Their inflated-object photography itself |
| Vectura | Visible "Pause video" control on background video | Slider for core content |
| Phenomenon Studio | "Proof, not portfolio" framing; compliance trust strip | Section count; showreel-first hero |
| Linear | "Structure should be felt not seen"; dimmed chrome; fewer separators | Their exact greys |
| Valorant (via third-party extraction) | Three tinted dark surfaces; bone text; one accent; hairlines | `#ff4655` on near-black as a template (AI default) |

## 5. Anti-references

| Page or pattern | Why it is wrong for this project |
|---|---|
| Palletio-style agency template: slogan hero, six service cards, "200+" stats, logo strip | Generic; no claim |
| Shuffle.dev section categories used as the page plan | That list is the generic SaaS skeleton |
| uiverse "Modern Styles" (glass, neumorphism, neon) as visual direction | Overused effects; neumorphism fails contrast |
| | |

## 6. Image provenance

Every image kept for production goes into a folder with `sources.json`:

```json
[{ "file": "hero-01.avif", "source": "https://…", "author": "", "licence": "", "retrieved": "YYYY-MM-DD", "edits": "crop, grade" }]
```

[OWN: QuickBite `public/images/food/*/sources.json`]
