# Professional B2B: design-system overrides

Applies on top of `core/design-system.md`. Covers B2B SaaS, dev tools, corporate and professional-services sites. Model: the "quiet tool" (Linear, Vercel, Ramp structure).

## 1. Settings

| Setting | Value | Source |
|---|---|---|
| Canvas | Warm-neutral light; dark-first allowed for dev tools | [SYN from 3P] |
| Neutrals | Warm, low-saturation greys. Too warm reads muddy; tune hue and chroma per token. | [DOC: Linear] |
| Accent strategy | One accent, or a quiet tool with none (use `ink` for primary) | [SYN] |
| Radius control / card / panel | 6 / 10–12 / 16px (Ramp: buttons and tags 6px, inputs 10px, cards 12–16px) | [3P: Ramp] |
| Display + body | **Aspekta** single family, or **Geist + Geist Mono** | [SYN] |
| Icons | Phosphor regular, or Hugeicons free stroke-rounded. Fewer and smaller. | [SYN] [DOC: Linear] |
| Illustration | unDraw for empty states, recoloured | [SYN] |
| Eyebrows | Optional | [SYN] |
| Container | 1200px (75rem), left-aligned text | [3P: Ramp] |
| Spacing | 4px base; section gaps 64–128px | [3P: Ramp] |
| Elevation | No card shadows; hairlines and tone shifts | [3P: Ramp] |

Ramp's extracted values for reference (copy structure, not hex): Ink `#0c0a08`, Bone canvas `#f4f2f0`, Ash `#6d6c6b` secondary text (4.69:1 on Bone, computed), one accent `#e4f222`; one weight (400) with `ss01`; scale 10/13/14/16/18/20/24/28/40/48/64px; display 64/1.0, heading 28/1.14, body 16/1.5. [3P: Refero]

## 2. Type scale for product UI

The core fluid scale is for marketing. Product screens use fixed sizes.

| Role | Size | Note |
|---|---|---|
| Table text | 13–14px | [SYN] |
| Body / form | 14–16px | |
| Section title | 18–20px | |
| Page title | 24–28px | |
| Marketing display | core `text-hero` | |

- Use stylistic sets where the face has them (Aspekta ss01–ss14 [DOC]); a craft detail such as `ss01` or an unusual weight reads as considered. [3P: Ramp, Mercury]
- Tabular numerals for every metric, ID and count column.
- Geist Mono for code, IDs, keys, timestamps.

## 3. Density

| Item | Value |
|---|---|
| Table rows | 32–40px with a compact/comfortable toggle [SYN] |
| Sidebar | Dimmed "a few notches"; muted inactive text; smaller icons [DOC: Linear] |
| Separators | Fewer; softened contrast [DOC: Linear] |
| Headers and view controls | Identical across every object type [DOC: Linear changelog] |
| Tabs | Compact, icon-only pills allowed if labelled [DOC: Linear] |

## 4. Visible grid

Vercel treats the grid as "a core part of the Vercel aesthetic". Reuse Ontiver's 1px-gap hairline grid (`components.md` §7) for feature and capability sections. [DOC: Vercel Geist] [OWN]

## 5. Corporate and services sites

| Instead of | Use |
|---|---|
| Icon-card triplets | Numbered capability list (numbers only if order matters; otherwise a plain list with strong labels) |
| Generic case-study cards | Case studies headed by a metric ("Cut close time from 9 to 3 days") |
| Stock handshakes | Real partner and team photography |
| Many CTAs | A single "Book a call" |
| Vague trust | Compliance strip naming standards ("HIPAA- and GDPR-compliant delivery") [3P: Phenomenon] |

Phenomenon Studio's "Proof, not portfolio" section is a good reference pattern. [3P]

## 6. Do not

- Uniform card grids with soft shadows
- Logo wall without numbers
- Decorative icons on every row
- Purple-to-blue gradients
- Coloured backgrounds behind every team or project icon (Linear removed these) [DOC: Linear]
