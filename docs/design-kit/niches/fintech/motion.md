# Fintech: motion overrides

Applies on top of `core/motion.md`. Motion is productive. Money never waits on an animation.

## 1. Engine

| Item | Choice | Source |
|---|---|---|
| Marketing | CSS only (Ontiver model) | [OWN] |
| Product | CSS + Motion for dialogs, drawers and toasts | [SYN] |
| GSAP | Not by default | [SYN] |
| Lenis | Marketing pages only, kit values | [SYN] |

## 2. Durations and easing

| Use | Duration | Easing | Source |
|---|---|---|---|
| Button, toggle | 70–100ms | `--ease-standard` | [DOC: Carbon fast-01 70ms] |
| Fade | 110ms | `--ease-standard` | [DOC: Carbon fast-02] |
| Small expansion | 150ms | `--ease-standard` | [DOC: Carbon moderate-01] |
| Expansion, toast | 240ms | `--ease-reveal` in, `--ease-exit` out | [DOC: Carbon moderate-02] |
| Large expansion, important notification | 400ms | `--ease-reveal` | [DOC: Carbon slow-01] |
| Backdrop dim | 700ms max | `--ease-linear` | [DOC: Carbon slow-02] |
| Marketing reveals | Core reveal tokens, or shorter: 8–12px over 200–300ms in product-adjacent pages | `--ease-reveal` | [OWN] [SYN] |

## 3. Budget per marketing view

| Allowed | Count |
|---|---|
| Ambient animation (marquee, gradient, loop) | ≤1, with pause control and static fallback |
| User-triggered showpiece | ≤1 |

[3P: Utsubo, citing Stripe's gradient wave with static fallback]

## 4. Allowed

| Pattern | Spec | Source |
|---|---|---|
| Number ticker | Marketing stats only; 600–1200ms; once on view; `tabular-nums` so width does not jump; final value in the HTML for SEO and screen readers | [SYN] |
| Chart draw-in | 300–600ms, once | [SYN] |
| Skeleton shimmer | Linear; stops under reduced motion | [SYN] |
| Transfer success | One expressive moment: checkmark draw about 400ms | [SYN] |
| Radial-fill primary button | 650ms fill, 260ms arrow | [OWN: Ontiver] |

## 5. Not allowed

- Animated balances in the product (show the real value immediately)
- Parallax
- Bouncy or overshooting springs on financial confirmations
- Auto-playing carousels
- Any animation that delays reading an amount, a fee or a status

[SYN]

## 6. Reduced motion

Core rules apply. Number tickers render the final value. Checkmark draws become a static icon. Status changes still announce through `aria-live`.
