# Component library guide

shadcn/ui is the foundation for new projects: Radix primitives plus Tailwind, copied into the repo and themed with CSS variables. Add at most one effects library per project and one hero effect per page. Restyle every import to the project tokens before shipping.

Controls should come from accessible primitives. Effects libraries are optional and never replace keyboard or ARIA behavior. Check licence and bundle cost before importing community components.

Restyle procedure:

1. Replace hard-coded colors, radii, shadows, durations, and easings with tokens.
2. Delete bounce, gradient text, glass, glow, and decorative default effects.
3. Add a reduced-motion branch.
4. Check focus, accessible names, and 44px touch targets.
5. Record the source and licence when importing a component.

FRONTIER currently uses local React and CSS components. Do not add a framework migration as part of gameplay changes.
