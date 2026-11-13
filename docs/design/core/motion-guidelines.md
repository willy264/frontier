# Motion guidelines

- Motion level for FRONTIER is low and functional.
- Animate transform and opacity only.
- Use 120ms to 240ms for ordinary state changes. Do not use bounce or elastic easing.
- Every animation needs a `prefers-reduced-motion: reduce` path that removes or sharply shortens non-essential movement.
- Never make a gameplay state legible only through motion.
- Do not add an effects library for a single interaction. The current app uses no effects library.
