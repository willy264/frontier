# Frontend QA checklist

## Automated

- [ ] `pnpm test`
- [ ] `pnpm exec tsc --noEmit`
- [ ] `pnpm exec next build apps/game --webpack`
- [ ] Relevant contract or integration tests pass.

## Interaction

- [ ] Every control has hover, focus-visible, active, disabled, and loading states.
- [ ] Keyboard can reach and operate wallet, market, fleet, ambush, backup, and reveal controls.
- [ ] Success and failure retain useful input and appear in the result feed.
- [ ] Reduced motion removes non-essential animation.
- [ ] RPC failure presents read-only mode without a broken layout.

## Responsive

- [ ] 320px
- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] 1920px

Check normal and reduced-motion modes. Record Lighthouse accessibility and performance results when available; do not claim 100/90 scores without running Lighthouse.
