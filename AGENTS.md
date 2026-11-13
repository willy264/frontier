# FRONTIER agent rules

Before changing the frontend, read these files in order:

1. `docs/design/core/PRD.md`
2. `docs/design/niches/gaming/PRD.md`
3. `docs/design/niches/gaming/design-system.md`
4. `docs/design/core/design-system.md`
5. `docs/design/core/text-copy.md`
6. `docs/design/core/motion-guidelines.md`
7. `docs/design/core/ux-principles-and-section-blueprints.md`
8. `docs/design/core/frontend-standards.md`
9. `docs/design/core/qa-checklist.md`
10. `docs/design/reference-sheet.md`

## Workflow

1. Preserve FRONTIER's gaming niche decisions and honest testnet scope.
2. Define or update tokens before styling a new surface. Use the existing CSS variables in `apps/game/app/globals.css`; do not introduce raw colors or one-off motion values.
3. Keep user-facing copy in typed content modules when adding a new page or substantial section. Never invent live metrics, partners, wallet support, or production features.
4. Build mobile-first from 320px upward. Keep touch targets at least 44px where practical and never below 24px.
5. Add interaction states and reduced-motion behavior before calling a control complete.
6. Run the relevant tests, `pnpm exec tsc --noEmit`, and `pnpm exec next build apps/game --webpack`.
7. Use the QA checklist and record any unverified browser or Lighthouse checks honestly.

## Hard bans

- No purple, violet, or indigo gradients, gradient text, glow orbs, aurora backgrounds, glassmorphism, or decorative blobs.
- No default Inter, Roboto, Arial, or Poppins styling.
- No emoji as interface icons, fake logos, fake metrics, lorem ipsum, or invented trust claims.
- No nested cards or a repeated three-card marketing grid as a default layout.
- No bounce or elastic easing. Animate transform and opacity only.
- No em dashes in UI copy.
- Do not copy reference text, logos, illustrations, or code.

## Stack note

The reusable standard assumes shadcn/ui and Tailwind v4 for new projects. FRONTIER is an existing Next.js MVP with a small CSS system and no Tailwind dependency. Keep that system until a separate migration is requested; apply the same token, accessibility, copy, and QA rules without adding a framework migration to gameplay work.
