# Professional B2B: motion overrides

Applies on top of `core/motion.md`. Quiet, productive, fast.

## 1. Engine

| Item | Choice |
|---|---|
| Marketing | CSS (core reveal system), Motion only if a component needs it |
| Product | CSS + Motion for overlays and list reordering |
| GSAP | Not by default |
| Lenis | Marketing only; never in the app |

[SYN]

## 2. Durations

| Use | Duration | Easing |
|---|---|---|
| Hover, colour | 100–150ms | `--ease-standard` |
| Dropdown, popover, tooltip | 150ms (Carbon moderate-01) | `--ease-standard` |
| Dialog, drawer, toast | 240ms in (Carbon moderate-02), 180ms out | `--ease-reveal` / `--ease-exit` |
| Tab content | 150ms fade, no slide | `--ease-standard` |
| Table row insert/remove | 150–240ms opacity + height via grid rows | `--ease-standard` |
| Marketing reveals | Core reveal tokens; heading + one media block per section at most | `--ease-reveal` |

[DOC: Carbon] [SYN]. Frequent actions get the shortest durations. [DOC: NN/g]

## 3. Showpiece

One per marketing page. Good fits:
- Product screenshot clip-path entrance (core §4, 1100ms)
- Spotlight hover on the hairline grid (core components §7)

Avoid: animated gradient backgrounds, beams, meteors, typing effects.

## 4. Product rules

- No animation on data load beyond a skeleton → content cross-fade (≤150ms).
- Command menu opens in ≤150ms.
- Never animate numbers in dashboards.
- Respect a user setting for reduced motion inside the app, in addition to the OS setting.

[SYN]
