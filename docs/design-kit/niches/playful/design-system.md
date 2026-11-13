# Playful / animation-led: design-system overrides

Applies on top of `core/design-system.md`. Covers consumer apps, food, education, lifestyle and community brands. Worked example: QuickBite (see `examples/quickbite-profile.md`). Second reference: Duolingo, from a third-party extraction [3P: webdesignhot], indicative only.

**Warning:** "cream background (~#F4F1EA) with a terracotta accent (~#D97757)" is a named AI default. [DOC: Anthropic skill] QuickBite's paper and hot orange sit close to it; what saves QuickBite is a hotter orange, cut-out food photography and local copy. For a new client, pick canvas and accent from the subject's world, not from QuickBite.

## 1. Settings

| Setting | Value | Source |
|---|---|---|
| Canvas | Light, warm paper (QuickBite model) or white (Duolingo); hue from the subject | [OWN] [3P] |
| Text | Warm near-black or soft grey; never pure black (Duolingo `#4b4b4b`, 8.72:1 on white) | [3P] |
| Accent strategy | Semantic accent map: each accent has one fixed meaning and a darker paired shade | [3P: Duolingo] |
| Radius control / card / panel | 16 / 20–32 / 40px + pill | [SYN from OWN + 3P] |
| Depth | Solid, unblurred offset shadows ("stickers", 3D buttons) in the darker paired shade; `box-shadow: none` elsewhere | [OWN: QuickBite] [3P: Duolingo] |
| Texture | Grain overlay and dashed-border cards allowed (one each) | [OWN: QuickBite] |
| Display + body | **Clash Display** or **DM Sans** display + **Onest** or **DM Sans** body | [SYN] |
| Icons | Hugeicons stroke-rounded, or Phosphor; duotone for active states | [SYN] |
| Illustration | Own mascot or cut-out photography; unDraw for empty and 404 states | [SYN] |
| Eyebrows | On, uppercase, names the section | [SYN] |
| Container | 80rem (`max-w-7xl`) | [OWN: QuickBite] |
| Targets | 44–48px | [3P] |

## 2. Semantic accent map

Every accent has a meaning and a darker paired shade. Saturation never becomes decoration. [3P: Duolingo]

| Meaning | Duolingo base / shadow (reference only) | Your project base | Shadow | Tint |
|---|---|---|---|---|
| Primary / success | `#58cc02` / `#46a302` | | | |
| Streak / warning | `#ff9600` / `#cc7700` | | | |
| Error / hearts | `#ff4b4b` / `#e02e2e` | | | |
| Reward / XP | `#ffc800` / `#cc9f00` | | | |
| Info | `#1cb0f6` / `#0a8acf` | | | |
| Premium | `#ce82ff` / `#a560d4` | | | |

Rules:
- Each accent gets a 3-step ramp: base, shadow (pressed), tint. [SYN]
- Primary colour only for primary CTAs and success. [3P: Duolingo]
- No gradients on primary CTAs. [3P]

**Contrast trap.** Saturated playful accents usually fail with white labels: white on Duolingo green `#58cc02` is 2.09:1; on its blue `#1cb0f6`, 2.44:1; on orange `#ff9600`, 2.18:1 (computed). Fix by:
1. dark text on the accent (e.g. `#4b4b4b` on `#ffc800` is 5.61:1), or
2. white text on a darker shade that passes 4.5:1, or
3. labels ≥24px / ≥18.66px bold (3:1 only).

QuickBite's version of this defect: white on `#FF4D1D` is 3.32:1. Fix: white on `brand-strong` `#c73c17` (5.14:1), or dark ink `#1c120f` on `#FF4D1D` (5.54:1). [OWN]

## 3. Colour derivation (QuickBite method)

```css
@theme static {
  --color-*: initial;
  --color-brand: #FF4D1D;                                              /* one hex, synced to artwork */
  --color-brand-light:  color-mix(in srgb, var(--color-brand) 68%, white);           /* ≈#ff8665, fills only */
  --color-brand-strong: color-mix(in srgb, var(--color-brand) 78%, black);           /* ≈#c73c17, white on it 5.14:1 */
  --color-brand-50:     color-mix(in srgb, var(--color-brand) 7%,  var(--color-paper));
  --color-brand-100:    color-mix(in srgb, var(--color-brand) 16%, var(--color-paper));
}
```

[OWN: QuickBite globals.css]. Keep the brand and paper hex in a generated JSON (`theme-colors.json`) that artwork scripts read. [OWN]

Limit the palette: QuickBite declares 80+ colour tokens and two text families (navy `#1a1a2e` and warm ink). Keep one ink family and at most 6 category tints. [OWN defect]

## 4. Radius tokens (make the real values the tokens)

QuickBite labels radii "12-16px brand" but cards use `rounded-[2rem]`, `[2.35rem]`, `[2.5rem]`. [OWN] In a playful project, set the tokens to the sizes you actually use:

| Token | Value |
|---|---|
| `radius-control` | 1rem (16px) |
| `radius-card` | 1.25–2rem (20–32px), pick one |
| `radius-panel` | 2.5rem (40px) |
| `radius-pill` | 9999px |

Then `rounded-[2.35rem]` cannot appear (lint gate 5.2).

## 5. Components

| Component | Spec | Source |
|---|---|---|
| Primary button | Solid fill, solid unblurred ~4px bottom shadow in the darker shade; press translates down and trims the shadow, not an opacity change | [3P: Duolingo] |
| Magnetic fill button | Circular fill from the cursor entry point (core motion §5) | [OWN: QuickBite] |
| Icon chip | 32px round, 1px `ink/10` border, `cream-200` fill, `brand-strong` icon at 16px, stroke 1.75 | [OWN: QuickBite] |
| Testimonial card | Large radius, dashed border, grain overlay; each quote with a real, consenting source | [OWN] |
| Sticker | `filter: drop-shadow(0 0.4rem 0 <shadow shade>)` on pins and cut-outs | [OWN: QuickBite] |
| Section divider | Hairline fading out at both ends: `linear-gradient(to right, transparent, var(--color-line) 18%, var(--color-line) 82%, transparent)` | [OWN: QuickBite] |
| Mascot | SVG or Rive; in empty states and 404; `aria-hidden` when decorative | [3P: Duolingo] |
| Disabled | Stays visible | [3P] |
| Bento | Allowed when content has hierarchy; rounded cells | [SYN] |

## 6. Type

- Display: tight line-height (QuickBite H2 0.9, hero 1.03) or tight tracking; not both pushed to the limit. [OWN]
- Load only weights you use. QuickBite sets `font-black` (900) on Sora loaded at 600/700/800; the browser falls back. [OWN defect]
- 12px floor. QuickBite has `text-[0.6rem]` (9.6px). [OWN defect]
- No serif display. [3P: Duolingo]
- Sentence case for headings; uppercase only on eyebrows.

## 7. Do not

- Blurred button shadows
- Pure black text
- Gradient CTAs
- "Trusted by" logo walls [3P: Duolingo]
- Hiding the native scrollbar
