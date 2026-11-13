# Components

Base: shadcn/ui (CLI v4, Base UI primitives), rethemed to kit tokens. Every component below lists its tokens, states and keyboard behaviour. Niche files change token values, not anatomy.

Global rules:
- Components use semantic tokens only. No hex, no Tailwind default colours, no arbitrary `[…]` values.
- Variants are props mapped to token classes (cva or equivalent).
- States for every interactive component: default, hover, focus-visible, active, disabled, loading (if async), error (if it takes input).
- Minimum target 24×24px (WCAG 2.5.8); kit default 44px height for primary controls.
- Record the source library and every edit made to it in the last column of the inventory.

Labels: [OWN] [DOC] [3P] [SYN].

## 1. Inventory

| Component | Source | Edits required after install |
|---|---|---|
| Button | shadcn `button` | Kit variants, radial fill, arrow rule, sizes |
| Link | native `a` | Underline offset, focus ring |
| Input, Textarea | shadcn `input`, `textarea` | Canvas-muted fill, hairline border, error state |
| Select, Combobox | shadcn `select`, `combobox` | Overlay shadow only on the popover |
| Checkbox, Radio, Switch | shadcn | Brand-strong fill when checked |
| Field (label + hint + error) | compose | Error message wiring (`aria-describedby`) |
| Card | shadcn `card` | Remove default shadow; hairline or tone shift |
| Hairline grid | custom | `gap: 1px` on `line` background [OWN] |
| Section heading (eyebrow + H2 + subtitle) | custom | |
| Navbar | custom | Surface switching, sticky, mobile menu |
| Dialog, Drawer (Sheet) | shadcn | Motion tiers, overlay shadow |
| Dropdown menu, Popover, Tooltip | shadcn | Overlay shadow |
| Tabs | shadcn | Underline indicator in brand |
| Accordion (FAQ) | shadcn | `line-strong` rules, intro column layout [OWN] |
| Toast | shadcn `toast` / sonner | Past-tense copy, overlay shadow |
| Badge / Tag | shadcn `badge` | Pill radius, tinted fill |
| Table | shadcn `table` | Tabular numerals, right-aligned numbers, density toggle |
| Skeleton | shadcn | Matches final layout |
| Empty state | custom | unDraw allowed here only |
| Marquee | custom CSS | Pause on hover/focus, reduced-motion static row [OWN] |
| Motion toggle | custom | `html[data-motion="paused"]` [OWN] |
| Video with pause | custom | Visible pause control [3P: vectura.se] |
| Stat / figure | custom | Source footnote, tabular numerals |
| Footer | custom | Legal line, licence numbers (finance) |

## 2. Button

**Anatomy:** container, label, optional leading icon, optional trailing arrow (primary only), optional spinner.

| Variant | Background | Label | Border | Use |
|---|---|---|---|---|
| primary | `brand-strong` | `on-brand` | none | One per section |
| secondary | transparent | `ink` | 1px `line-strong` | Second action |
| ghost | transparent | `brand` | none | Inline, tertiary |
| inverse | `on-inverse` | `inverse` | none | On dark bands |
| danger | `danger` | `on-brand` (check ≥4.5:1) | none | Destructive confirm only |

| Size | Height | Padding-x | Text | Icon |
|---|---|---|---|---|
| sm | 36px [SYN] | 12px | `text-ui-sm` | 16px |
| md (default) | 44px | 16–24px | `text-ui-md` | 20px |
| lg | 52px [SYN] | 24–32px | `text-ui-lg` | 20px |

Radius: `radius-control`. Weight 600. Ontiver sets buttons uppercase with 0.15em tracking [OWN]; use that only where the niche allows uppercase labels.

| State | Treatment |
|---|---|
| hover | Primary: radial fill `circle(0%)` → `circle(150%)`, 650ms, `--ease-reveal`, fill colour `brand` or `inverse-raised`; arrow slides through 260ms [OWN]. Others: colour shift 180ms. |
| focus-visible | 3px `focus` outline, 3px offset |
| active | `scale(0.97)`, 100ms [OWN: QuickBite] |
| disabled | 50% opacity of fill (label must still pass 3:1 against it), `cursor: not-allowed`, `aria-disabled`; keep visible [3P: Duolingo] |
| loading | Spinner replaces leading icon, label stays, width fixed, `aria-busy="true"`, click ignored |

Keyboard: Enter and Space activate. Role: native `button`. If it navigates, render `a` styled as a button.

Content: verb + object, 1–3 words. Max about 24 characters.

Playful override: solid unblurred bottom shadow in a darker paired shade (~4px); on press, translate down and trim the shadow, not an opacity change. [3P: Duolingo]
Gaming override: 0 radius, skew −6° with counter-skewed label; hover inverts. [3P: Valorant]

## 3. Link

| State | Treatment |
|---|---|
| default | `brand` text (passes 4.5:1), underline, `text-underline-offset: 0.2em` [SYN] |
| hover | underline thickness or colour change, 180ms |
| focus-visible | ring |
| visited | same as default on marketing; differ in content-heavy products |

External links that open new tabs say so in accessible text. No trailing arrows on links.

## 4. Input, Textarea, Select

| Part | Token |
|---|---|
| Fill | `canvas-raised` (or `canvas-muted` on raised surfaces) |
| Border | 1px; must reach 3:1 against the fill to identify the control (WCAG 1.4.11). `line` at 24% alpha usually does not; use `ink-muted` or a stronger line for input borders. [SYN] |
| Radius | `radius-control` |
| Height | 44px |
| Label | Above the field, `text-ui-sm`, weight 500, `ink` |
| Hint | Below, `text-ui-xs`/`text-ui-sm`, `ink-muted` |
| Error | `danger` border + icon + message below; `aria-invalid="true"`, message linked by `aria-describedby` |

| State | Treatment |
|---|---|
| hover | border to `ink` |
| focus-visible | ring (outline), border `brand` |
| disabled | `canvas-muted` fill, `ink-muted` text |
| read-only | no border, `canvas-muted` fill |
| error | as above; never colour alone (icon + text) |
| success (optional) | `success` icon + message; use sparingly |

Rules: required fields marked; paste allowed; correct `type`, `inputmode`, `autocomplete`; no redundant entry across steps (3.3.7).

## 5. Checkbox, Radio, Switch

- Hit area ≥24px even if the visual box is 16–20px.
- Checked fill `brand-strong`, mark `on-brand`.
- Switch: thumb transition 100–180ms `--ease-standard`. Label states the on-state ("Email me when an order ships").
- Keyboard: Space toggles; arrow keys move within a radio group.

## 6. Card

| Variant | Treatment |
|---|---|
| plain | `canvas` fill, 1px `line`, `radius-card` |
| raised | `canvas-raised` fill, no border or 1px `line`, `radius-card` |
| media | image fills, `radius-card`, image scales 1.04 on hover over 700ms inside an `overflow: hidden` frame [OWN] |
| panel | `radius-panel`, large surfaces |

Padding: 24px (20–24px card padding is common [3P: Ramp, Wise]); 32px on large cards. No shadow. If the whole card is a link, one `a` wraps the title and a pseudo-element extends the hit area; do not nest interactive elements.

Do not render rows of identical cards with the same radius and shadow. Prefer the hairline grid or a numbered list.

## 7. Hairline grid [OWN: Ontiver section-grids.css]

```css
.hairline-grid { display: grid; gap: 1px; background: var(--color-line); grid-template-columns: 1fr; }
.hairline-grid > * { background: var(--color-canvas); padding: 24px; }
@media (min-width: 768px)  { .hairline-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .hairline-grid--four { grid-template-columns: repeat(4, 1fr); } }
```

Spotlight hover (optional, one per page): cell gets an inset dark rounded fill (`inset: 8px; border-radius: 16px; background: inverse-raised`) and icons switch to `accent-on-inverse`. [OWN]

## 8. Section heading

| Part | Token |
|---|---|
| Eyebrow | `.eyebrow` (`text-meta`, 700, uppercase, `tracking-eyebrow`, `brand`) |
| H2 | `text-section`, weight 500, `tracking-heading`, `text-wrap: balance` |
| Accent line | Optional second line in `brand` |
| Subtitle | `text-subtitle`, `ink-muted`, `max-width: var(--measure)` |
| Alignment | Left by default; centre only when the section is centred as a whole |

## 9. Navbar

| Item | Rule |
|---|---|
| Height | 85px mobile; `clamp(85px, 5.9vw, 128px)` at ≥1024px [OWN: Ontiver] |
| Surface | `canvas` or `canvas-raised` with hairline bottom; switch to inverse styling over dark sections (Ontiver composites the background behind the CTA to decide) [OWN] |
| CTA | One primary on the right |
| Mobile | Menu button with `aria-expanded`, `aria-controls`; focus trapped in the open menu; Esc closes and returns focus |
| Sticky | `scroll-padding-top` ≥ header height so focus is never hidden (2.4.11) |
| Skip link | "Skip to content" first in tab order |
| Glass | Blur only on nav and modals, if at all [3P: StudioMeyer] |

## 10. Dialog and Drawer

| Item | Spec |
|---|---|
| Surface | `canvas-raised`, `radius-panel`, `--shadow-overlay` |
| Backdrop | `ink` at about 40% [SYN] |
| Motion | In: 320ms opacity + scale 0.98→1, `--ease-reveal`. Out: 220ms, `--ease-exit`. Drawer slides from edge. Reduced motion: opacity only. |
| Focus | Moves to first focusable or title on open; trapped; returns to trigger on close |
| Keys | Esc closes (unless destructive confirm in progress) |
| Role | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` |
| Actions | Primary on the right, verb + object; Cancel always present |

## 11. Dropdown menu, Popover, Tooltip

- Overlay shadow, `radius-control` or `radius-card`, `canvas-raised`.
- 220ms open (opacity + small translate), 180ms close.
- Menu: arrow keys move, Enter selects, Esc closes, typeahead.
- Tooltip: on hover and focus, never the only way to get information, never on disabled elements without a wrapper.

## 12. Tabs

- Indicator: 2px `brand` underline, slides 220ms `--ease-standard`.
- Arrow keys move between tabs; Tab moves into the panel.
- `role="tablist"`, `tab`, `tabpanel` with `aria-selected`, `aria-controls`.
- Panel content change: 320ms fade, no slide on content-heavy panels.

## 13. Accordion (FAQ) [OWN: Ontiver faq.css]

- Layout: intro column (H2 + "talk to us" link) beside the list at ≥1024px.
- Rules between items: 1px `line-strong`.
- Trigger is a `button` with `aria-expanded`; chevron or plus rotates 220ms.
- Height animation: use `grid-template-rows: 0fr → 1fr` or the native `details` element; do not animate `height` with JS.

## 14. Toast

- Bottom or top-right, `canvas-raised` or `inverse`, overlay shadow.
- Copy mirrors the action verb in past tense.
- Auto-dismiss 4–6s [SYN]; pauses on hover/focus; has a close button; errors do not auto-dismiss.
- `role="status"` (success) or `role="alert"` (error).

## 15. Badge / Tag

Pill radius, `text-ui-xs` (12px floor), weight 500–600, tinted fill (`brand-wash` or status tint) with text that passes 4.5:1 against it. Status badges include an icon or text, not colour alone.

## 16. Table

| Item | Spec |
|---|---|
| Text | 13–14px [SYN] |
| Rows | 32–40px with compact/comfortable toggle [SYN] |
| Numbers | `tabular-nums`, right-aligned, consistent decimals [DOC: Alberta DS] |
| Headers | Sticky on scroll; `th scope="col"`; sortable headers are buttons with `aria-sort` |
| Rules | 1px `line` between rows; no zebra unless density requires it |
| States | Empty, loading (skeleton rows), partial, error per table |
| Bulk actions | Checkbox column; action bar appears with the count selected (B2B) |

## 17. Skeleton

Same box sizes as the final content. Shimmer uses `--ease-linear`, stops under reduced motion. Never a spinner for content areas over about 300ms. [SYN]

## 18. Empty state

| Part | Rule |
|---|---|
| Illustration | Optional; unDraw recoloured to tokens, or mascot (playful) |
| Line 1 | What will appear here |
| Action | One primary button |

## 19. Marquee [OWN]

36s linear (32s playful), duplicated track `translateX(-50%)`, `gap: 48px`, edge mask, pauses on hover and focus-within, static wrapped row under reduced motion. Content must also exist once in plain HTML for screen readers; hide the duplicate with `aria-hidden`.

## 20. Stat / figure

- Figure in `text-section` or `text-card`, `tabular-nums`; label `text-meta` `ink-muted` above or below.
- Each figure has a footnote or tooltip with its source. No source, no figure: show "—" and "Awaiting results". [OWN proof policy]
- Optional count-up on marketing pages only: 600–1200ms, once.

## 21. Footer

Four link columns at most, legal line, certifications, licence numbers where regulated. One hairline above. On inverse surface if the closing CTA band is dark.
