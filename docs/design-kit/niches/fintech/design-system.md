# Fintech: design-system overrides

Applies on top of `core/design-system.md`. Only the values below change. Worked example: Ontiver (its values ship as the default). Replace the hue, keep the structure.

## 1. Settings

| Setting | Value | Source |
|---|---|---|
| Canvas | Light, hue-tinted (Ontiver model). Dark only for premium positioning (Mercury has no light mode). | [OWN] [3P: Mercury] |
| Accent strategy | One accent. Pick quiet tool or signature colour, not both. | [SYN from 3P] |
| Semantic colours | Desaturated for the canvas | [3P: Mercury] |
| Radius control / card / panel | 8–10 / 12–16 / 20–24px | [SYN] |
| Display + body | **Onest** (consumer) or **Geist** (B2B-facing), plus **Geist Mono** for figures | [SYN] |
| Icons | Phosphor regular or light | [SYN] |
| Illustration | None in the hero; unDraw only for empty states | [SYN] |
| Eyebrows | On (uppercase, names the section) | [SYN] |
| Container | 1200px left-aligned for product marketing; Ontiver's 2400px editorial container allowed for brand pages | [3P: Ramp] [OWN] |

## 2. Starting palette (replace the hue only)

| Token | Value | Ratio on canvas |
|---|---|---|
| `canvas` | `#e9ebe5` | |
| `canvas-raised` | `#f3f4ef` | |
| `canvas-muted` | `#e0e4dc` | |
| `ink` | `#002d0e` | 12.65:1 |
| `ink-muted` | `#526058` | 5.51:1 |
| `brand` | `#006b1d` | 5.6:1 |
| `brand-strong` | `#005317` | 7.77:1 |
| `success` / `warning` / `danger` | `#1c6e34` / `#9a5b00` / `#b42318` | 5.25 / 4.52 / 5.47:1 |

All [OWN] or [SYN] derived; ratios computed for this kit.

How to rehue: generate a 10–12 step scale in OKLCH from the new brand hex, keep canvas lightness near L≈93% with a low-chroma tint of the brand hue, keep ink 12–18:1 and muted 5.5–6:1. Colours 5 steps apart should pass 4.5:1. [DOC: Stripe] [OWN targets]

Do not use "money green / trust blue" by reflex. Mercury chose purple to leave those norms; trust came from craft (type, tuned values, original photography). [3P: Mercury]

Reference values (third-party extractions; structure only, never copy):

| Brand | Values | Note |
|---|---|---|
| Mercury (dark) | bg `#0F0F14`, surface `#191920`, elevated `#262630`; text `#EDEDF3` / `#AAAAB9` / `#78788C`; borders `rgba(255,255,255,0.08)`; accent `#6C5CE7` (hover `#8C7DF5`) | `#78788C` on bg is 4.43:1, just below AA for small text |
| Ramp | Ink `#0c0a08`, Bone canvas `#f4f2f0`, Ash `#6d6c6b`, accent `#e4f222`, hairline `#e5e7eb` | |
| Wise | Forest `#163300`, Lime `#9fe870`, wash `#e2f6d5`, Charcoal `#454745`, Fog `#e8ebe6` | |

## 3. Money semantics

| State | Colour | Plus |
|---|---|---|
| Credit / received | `success` (dark: `#34D399`) | "+" sign and "Received" label |
| Debit / sent | `ink` or `danger` (dark: `#F87171`) | "−" sign and "Sent" label |
| Pending | `warning` (dark: `#FBBF24`) | Clock icon, "Pending" label, expected time |
| Failed / reversed | `danger` | Label states whether money moved |

Never colour alone. [DOC: Atlassian] [3P: Mercury dark values]

## 4. Money typography

| Style | Spec | Source |
|---|---|---|
| Balance | 28px, weight 500, tracking −0.5px, line-height 1.0, `tabular-nums` | [3P: Mercury] |
| Balance label | 12px, weight 500, `ink-muted`, above the figure | [3P: Mercury] |
| Table figures | 13–14px, `tabular-nums`, right-aligned, consistent decimals | [DOC: Alberta DS] [SYN] |
| Hero figures (marketing) | `text-section`, 0 decimals allowed | [SYN] |
| Currency | Always show symbol or code (₦, NGN, $). Use "NGN" explicitly in mixed-currency contexts. | [SYN] |
| Separators | Thousands separators always; 2 decimals in tables | [SYN] |
| Negatives | Minus sign or parentheses, not colour alone | [SYN] |
| Glyph test | Render ₦ (U+20A6) in every chosen face before approving it | [SYN] |

```css
.money { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.balance { font-size: 1.75rem; font-weight: 500; letter-spacing: -0.5px; line-height: 1; }
```

(Mono for figures is optional; tabular numerals in the body face also pass.)

## 5. Charts

| Rule | Value |
|---|---|
| Categorical | 5–6 ordered colours, each ≥3:1 on the surface |
| Single series | Brand colour |
| De-emphasised data | Neutral (`ink-muted` at reduced opacity, still ≥3:1 if it carries meaning) |
| Status colours | Only for status meaning |
| Text on fills | Never |
| Adjacent marks | Separated by a gap or border |

[DOC: Atlassian]

## 6. Layout patterns

| Surface | Pattern |
|---|---|
| Dashboard | Dimmed navigation (muted inactive text, smaller icons); content dominates; balance or KPI up top; dense tabular data below; fewer separators [DOC: Linear] |
| Marketing | Plain-money hero with real figures; a live calculator or fee comparison if the product has one; regulator and protection line near the CTA; logos only next to scale numbers; security page linked from ≥3 surfaces [3P: Utsubo] |
| Pricing | 3–4 tiers; recommended tier marked with the accent sparingly; fees as concrete examples ("₦1,500 on a ₦100,000 payment") [SYN] |
| Section gaps | 64–128px on marketing [3P: Ramp]; kit `--section-y` covers this |

## 7. Do not

- Generic shield or lock icons and fake "secure" badges
- 3D coin and phone renders; neon gradients
- Proportional figures or inconsistent decimals in tables
- Balances without currency
- Regulator claims without licence numbers
- Carousel heroes; stock handshake photos
- "Contact us" on every pricing tier

[SYN: "cheap fintech" checklist]
