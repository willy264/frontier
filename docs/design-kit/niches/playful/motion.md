# Playful: motion overrides

Applies on top of `core/motion.md`. Expression lives in springs, tactile buttons and one character. Everything else follows core.

## 1. Engine

| Item | Choice | Source |
|---|---|---|
| UI | Motion springs (`motion/react`, `LazyMotion`) | [SYN] |
| Mascot | Rive state machine | [SYN] [3P: Callstack] |
| Scroll reveals | Core CSS system; QuickBite's GSAP reveal only if GSAP is already justified | [OWN] |
| Lenis | Marketing pages, kit values | [OWN] |

## 2. Curves and durations

| Token / use | Value | Source |
|---|---|---|
| Standard UI | `cubic-bezier(0.4, 0, 0.2, 1)` | [3P: Duolingo] |
| Reward overshoot (reward moments only) | `cubic-bezier(0.34, 1.56, 0.64, 1)` | [3P: Duolingo] |
| House reveal | `cubic-bezier(0.22, 1, 0.36, 1)` | [OWN] |
| Hover | 120ms | [3P: Duolingo] |
| Focus / card lift | 200ms | [3P] |
| Modals / page transitions | 320ms | [3P] |
| Confetti / mascot | 600ms | [3P] |
| QuickBite tokens | fast 0.25s, base 0.5s, slow 0.8s; `premiumTransition` 0.5s with the house curve | [OWN] |

## 3. Springs

| Use | Value | Source |
|---|---|---|
| Hover / tap (default) | stiffness 420, damping 30, mass 0.6; `whileHover {y:-3, scale:1.015}`, `whileTap {scale:0.97}` | [OWN: QuickBite tactileSpring] |
| Larger moves | M3 spatial: damping 0.9, stiffness 1400 / 700 / 300 | [DOC: M3] |
| Colour / opacity | M3 effects: damping 1 (no overshoot) | [DOC: M3] |

Apply the tactile spring to primary buttons and selectable tiles, not to every card.

## 4. Tactile button press [3P: Duolingo]

```css
.btn-tactile { box-shadow: 0 4px 0 var(--color-brand-shadow); transition: transform 100ms var(--ease-standard), box-shadow 100ms var(--ease-standard); }
.btn-tactile:active { transform: translateY(4px); box-shadow: 0 0 0 var(--color-brand-shadow); }
```

(The playful niche re-enables this one solid shadow; it is not a blurred elevation shadow. Define `--color-brand-shadow` in the project `@theme` as the darker paired shade from the semantic accent map.)

## 5. Allowed ambient motion

| Pattern | Value | Source |
|---|---|---|
| Marquee | 32s linear, pauses on hover, edge fade | [OWN: QuickBite] |
| Float | 7s | [OWN] |
| Pulse glow | 9s | [OWN] |
| Sunburst | `spin 56s linear infinite`, paused until in view | [OWN] |
| Skill-node style hover | scale 1.04, bob ±2px | [3P: Duolingo] |
| Typewriter hero | type 92ms, delete 58ms, pause 4200ms | [OWN] |
| Odometer | QuickBite 1.8s; kit prefers 600–1200ms | [OWN] [SYN] |

Pick at most two ambient loops per page, each with a pause control. One showpiece.

## 6. Character and reward rules

- Squash, stretch, anticipation and follow-through belong to the mascot layer, not UI chrome. [SYN]
- Overshoot only for rewards. [3P: Duolingo]
- Sound opt-in.

## 7. Reduced motion

Disable flicker, bob, confetti, float, pulse and marquee scroll. [3P: Duolingo] [OWN] Mascot shows a static pose. Tactile press stays (it is direct feedback) but with no translate: swap to a colour change.
