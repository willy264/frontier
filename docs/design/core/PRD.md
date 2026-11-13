# PRD: FRONTIER

## 1. Summary

- What it does, for whom: A persistent on-chain trading and strategy game for crypto players who want player-owned markets, ships, ports, and hidden-information risk.
- Stage: live testnet MVP
- Niche pack: gaming
- Primary goal: let a judge complete one legible trade, sail, ambush, escort, and arrival loop.
- Secondary goal: make the live economy and its limits understandable without overstating future systems.
- Primary CTA: `Connect wallet`
- Secondary CTA: `Start tutorial`

## 2. Audience

| Segment | Must believe before acting | Main objection | Main device |
|---|---|---|---|
| Crypto game judge | The rules and state are genuinely on-chain | The demo may be decorative | Laptop browser |
| Strategy player | Risk and market choices matter | The loop may be too slow or opaque | Laptop browser |
| NEAR builder | The contract uses NEAR capabilities meaningfully | The chain may be incidental | Laptop browser |

## 3. Brand inputs

- Logo: existing `F` mark and FRONTIER wordmark. No alternate logo supplied.
- Colors and fonts: source of truth is `apps/game/app/globals.css`.
- Photography: not applicable to the map-first game surface.
- Words used: convoy, port, route, market, ambush, escort, testnet, contract state.
- Words avoided: guaranteed profit, production economy, AI rivals, mainnet, cross-chain settlement when not demonstrated.
- Legal/trust facts: testnet only; no mainnet transaction; CRED is game currency and not redeemable.

## 4. Page

| Page | Purpose | Sections in order |
|---|---|---|
| Game home | Get a judge into a playable loop | Nav, status, how to play, live map/economy, port market, fleet, ambush, guided tutorial, secrets, result feed, footer |
| Demo video | Explain the recorded path | Player, chapters, transcript, download |

## 5. User flows

`Read-only entry -> connect testnet wallet -> register -> buy/build -> seal departure -> optionally commit/reveal ambush -> arrive -> read result feed -> trade again`

Every transaction needs a pending, success, and failure state. A saved secret needs a visible backup path and must never be treated as recoverable from the contract.

## 6. Functional requirements

- Wallet: testnet login and game-only function-call key.
- Market: live AMM quote, user amount, min-out slippage, owner fee control.
- Fleet: build, cargo selection, hidden destination, arrival reveal, live state marker.
- Ambush: hidden route commit, local salt persistence, reveal control, result feed.
- Evidence: use real contract state and label scripted practice as scripted or guided.

## 7. Non-functional requirements

WCAG 2.2 AA target. Verify responsive behavior at 320, 375, 768, 1024, 1440, and 1920px. Respect reduced motion. Keep claims aligned with `README.md` and the deployed testnet evidence.

## 8. Stack defaults

Next.js App Router, TypeScript, pnpm, near-api-js, NEAR Connect, and the existing CSS token layer. shadcn/ui is the default for a new project, not a reason to destabilize this existing MVP.

## 9. Component libraries

- Foundation: existing local components and CSS.
- Effects library: none.
- Hero effect: none. The live map is the primary experience.

## 10. Acceptance criteria

- [ ] New sections use real, typed content and current contract facts.
- [ ] Every flow has pending, success, and failure feedback.
- [ ] `docs/design/core/qa-checklist.md` is completed for the change.
- [ ] Claims match the latest evidence JSON and README.

## 11. Out of scope

NEAR Intents settlement, storms, separate port maintenance, production season rollover, port sub-accounts, and ordinary retail wallet coverage remain future work unless separately implemented and verified.
