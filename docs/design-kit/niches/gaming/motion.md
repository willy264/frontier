# Gaming: motion overrides

Applies on top of `core/motion.md`.

## 1. Engine

| Item | Choice | Source |
|---|---|---|
| Marketing | GSAP (+ ScrollTrigger) or Motion; video hero | [SYN] |
| Effects | Aceternity or Skiper UI, rethemed to tokens, with reduced-motion guards added | [SYN] |
| Lenis | Marketing only | [SYN] |

Pick GSAP or Motion, not both, unless `PRD.md` records why.

## 2. Curves and durations (Valorant extraction) [3P]

| Token | Value | Use |
|---|---|---|
| `--ease-game` | `cubic-bezier(0.65, 0, 0.35, 1)` | Standard |
| `--ease-game-emphasis` | `cubic-bezier(0.85, 0, 0.15, 1)` | Emphasised moves |
| Hover | 100ms | |
| Focus / ring | 180ms | |
| Modals, dropdowns | 260ms | |
| Cinematic reveals | 420ms | |
| Card scroll reveal | fade + 24px translate | |

Add the two easings to `@theme` (`--ease-game`, `--ease-game-emphasis`) and keep `--ease-reveal` for the showpiece only if it fits the game's feel.

## 3. Showpiece

One per page. Typical: full-bleed video hero, or a character reveal with the 60/40 split. The video pauses to a poster frame under reduced motion and has a visible pause control.

## 4. Rules

| Rule | Source |
|---|---|
| Glow appears on hover, focus, selected, or moving particles only | [SYN] |
| No overshoot springs in UI chrome | [SYN] |
| Input response <100ms (responsive), <50ms (tight); never gate core input on an animation | [3P: gaming-patterns] |
| Screen shake sparing and toggleable | [3P] |
| ≤3 flashes per second; stricter for saturated red | [3P] |
| Shake, parallax, blur exposed as 0–100% sliders in game UI | [3P] |

## 5. Reduced motion [3P: Valorant]

- Translate and scale become opacity.
- The −6° skew stays (it is static geometry, not motion).
- Video heroes pause to a poster frame.
- Particles and loops stop.
