# Motion guidelines: core

Motion explains change. FRONTIER uses a low, functional motion level.

## Tokens

- Instant: 80ms press feedback
- Fast: 150ms hover and toggles
- Base: 240ms dropdowns and accordions
- Slow: 400ms reveals and modals
- Slower: 600ms hero entrance only where the niche allows it

Default easing is `cubic-bezier(0.22, 1, 0.36, 1)`. Entering uses `cubic-bezier(0.05, 0.7, 0.1, 1)`. Exiting uses `cubic-bezier(0.3, 0, 0.8, 0.15)`.

## Rules

- Animate transform and opacity only.
- Reveals move 12-24px with opacity. Never reveal from scale 0.
- Use one focal animation per viewport.
- Nothing blocks input for more than 1.5 seconds.
- Autoplay media over five seconds needs a pause control.
- Motion must never be the only way to understand a game state.

## Reduced motion

Replace movement with opacity fades of 150ms or less. Pause video and marquees. Remove parallax and non-essential transitions under `prefers-reduced-motion: reduce`.

## Libraries

CSS transitions are preferred for the current app. Add Motion, GSAP, Lenis, or a 3D library only for a documented need, with a static fallback and a reduced-motion branch. FRONTIER currently uses no effects library.
