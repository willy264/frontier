# PRD: FRONTIER frontend redesign

Owner: FRONTIER project owner  
Status: approved direction  
Last updated: 2026-11-13

## 1. Problem

The live testnet loop contains markets, fleets, escorts, hidden orders,
ambushes, arrivals, and economy data. A first-time visitor must understand the
map before connecting, then see which action is available and whether a signed
order is pending, confirmed, failed, or uncertain. The redesign must improve
that operational clarity without changing contracts or presenting planned
systems as live.

## 2. Users

| Segment | Job to be done | Current workaround | Device / network |
|---|---|---|---|
| Hackathon judge | Verify and complete the core game loop | Read the guide while operating the app | Laptop, normal broadband |
| Strategy player | Compare ports and move cargo through route risk | Move between map and action controls | Laptop or mobile, variable network |
| NEAR builder | Inspect the wallet scope and contract feedback | Read chain details and explorer receipts | Laptop, normal broadband |
| Visitor without a wallet | Understand the world before deciding to connect | Read-only contract calls and market preview | Any supported browser |

## 3. Goals and non-goals

| Goals | Non-goals |
|---|---|
| Put the live archipelago map in the first viewport. | Contract changes or new contract methods. |
| Permit no-wallet exploration of world and economy reads. | Wallet-free transactions, embedded wallets, social login, or sponsored gas. |
| Require a wallet only when a real testnet action starts. | Mainnet, token value, or production claims. |
| Keep the next valid captain action visible and understandable. | Invented rival movement, storms, AI agents, or season systems. |
| Give every transaction pending, success, error, and uncertain-confirmation feedback. | A marketing landing page, video hero, 3D map, or effects library. |
| Keep hidden-order backup and restore warnings visible at the decision point. | Recovering secrets from the contract. |

## 4. Success criteria

No unverified numeric product target is introduced. Release acceptance is
behavioral:

| Criterion | How measured |
|---|---|
| A visitor can inspect ports, routes, economy state, and wallet requirements before connecting. | Manual read-only flow |
| A connected player can identify the next action and complete the supported trade-to-arrival loop. | Testnet walkthrough |
| Every contract action reports pending and final status without relying on colour alone. | Manual state audit and transaction receipt |
| The map and action tool reflow without overlap from 320px to 1920px. | Responsive screenshots |
| Keyboard users can select ports, routes, and ships and reach captain actions. | Keyboard walkthrough |

## 5. Sitemap and information architecture

```text
/
|-- World view
|   |-- Archipelago map
|   |-- Captain actions: market, fleet, ambush
|   `-- Captain's log
|-- Economy view
|-- How to play dialog
|-- On-chain details and hidden-order backup
`-- /demo/index.html (existing demo)
```

Top-level navigation: World, Economy, How to play, wallet state.

## 6. Key user flows

### Flow A: explore without a wallet

| Step | Surface | User action | System response | Failure branch |
|---|---|---|---|---|
| 1 | World | Open the app | Read world, routes, economy, and block height from testnet | Show retry banner and stale-data warning if RPC fails |
| 2 | Map | Select a port or route | Update map selection and adjacent context | Keep the map usable; state that the selected data is unavailable |
| 3 | Actions | Review a market preview | Show contract-derived quote and explain wallet requirement | Never fabricate a quote when the read failed |
| 4 | Wallet | Choose Connect wallet | Open the existing NEAR testnet wallet flow | State that connection was not completed and allow retry |

### Flow B: trade and sail

| Step | Surface | User action | System response | Failure branch |
|---|---|---|---|---|
| 1 | Captain | Connect and register | Show scoped game-key explanation, then confirmed captain state | Preserve read-only exploration if wallet flow stops |
| 2 | Market | Select good and buy cargo | Show quote, minimum received, pending toast, and confirmed receipt | Explain slippage, funds, or unknown failure with recovery action |
| 3 | Fleet | Build or select ship, load cargo, select route | Show capacity, destination privacy, and hidden-order backup warning | Block empty or excessive load and explain why |
| 4 | Fleet | Seal and sail | Save secret before signing; show route progress after confirmation | Do not sign if local secret storage fails |
| 5 | Fleet | Arrive when ready | Reveal destination, resolve contract result, show receipt, and open destination market | Keep control disabled while early; explain missing local secret |
| 6 | Market | Sell cargo | Show current quote and confirmed sale | Refresh changed quote or holdings before retry |

### Flow C: ambush and escort

| Step | Surface | User action | System response | Failure branch |
|---|---|---|---|---|
| 1 | Map | Select a route | Open route context and ambush tool | Ask for a valid route if selection is unavailable |
| 2 | Ambush | Commit and later reveal | Save secret, show remaining block window, pending state, and result | Explain late reveal or uncertain confirmation; never claim a catch without event evidence |
| 3 | Fleet | Look up, hire, or offer escort | Show active offer facts and confirmed order | Explain unavailable offer or RPC failure |

## 7. Feature requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| F1 | Dark nautical token set | Must | Uses the palette in `brief.md`; all labels meet contrast requirements. |
| F2 | Local typography | Must | Barlow Condensed 600/700 and DM Sans variable load from local WOFF2 through `next/font/local`; licence texts remain in the repo. |
| F3 | Read-only entry | Must | Map and economy reads do not request wallet connection. |
| F4 | Transaction gate | Must | Any real testnet order checks connected account and scoped game controls. |
| F5 | Map showpiece | Must | The interactive map is the dominant first-viewport surface and is usable by pointer and keyboard. |
| F6 | Adjacent action tool | Must | Desktop keeps captain actions beside the map; mobile places them directly after map context. |
| F7 | Event feedback | Must | One CSS event toast communicates pending, success, and failure through text plus tone. |
| F8 | Reduced motion | Must | Event toast uses no transform under reduced motion; all other state changes are static. |
| F9 | Goods semantics | Must | Hashpower amber, Liquidity cyan, and Blockspace blue appear with names and stable shapes or labels. |
| F10 | Honest evidence | Must | Receipts link to testnet explorer; missing data and unsupported claims remain explicit. |
| F11 | Existing CSS architecture | Must | No Tailwind, shadcn/ui, GSAP, Motion, or 3D dependency is introduced. |

## 8. States matrix

| View | Empty | Loading | Partial | Error | Pending | Success | Offline |
|---|---|---|---|---|---|---|---|
| World reads | No ships: say fleet is empty | Reading the tide | Keep loaded map and flag interrupted updates | Testnet unavailable, Retry connection | n/a, reads only | Current block shown | Last loaded state marked out of date |
| Visitor market | No quote when port data is absent | Loading this port's market | Show port name, omit unavailable quote | Market unavailable, retry | n/a | Contract quote shown | No invented quote |
| Wallet | No account: exploration copy | Opening wallet | Account present, game controls absent | Connection not completed | Wallet approval in progress | Wallet connected | Keep read-only exploration |
| Captain registration | Captain not registered | Checking your captain | Account with no player record | Harbour connection lost | Confirming order | Captain registered | Action unavailable |
| Market order | No holdings is valid | Quote or holdings loading | Loaded quote with stale warning | Specific recovery copy | Sending order, waiting for testnet | Bought or sold amount from event | Preserve form, disable signing |
| Fleet | No ships: build choices | Fleet loading | Ship list with an unavailable detail | Specific recovery copy | Confirming build, departure, or arrival | Past-tense result and receipt | Preserve local hidden orders |
| Hidden orders | No saved orders: disable backup | n/a | Unconfirmed local order marked uncertain | Backup mismatch or storage failure | Contract signature pending | Backup downloaded or restored | Local backup remains available |
| Ambush | No committed ambushes is valid | Route state loading | Saved commit without confirmation is marked uncertain | Window closed or RPC error | Commit or reveal pending | Only event-confirmed outcome | Keep secret and show unavailable action |
| Escort | No offer selected | Looking up escort offer | Offer facts shown | Offer unavailable or lookup failed | Hire or offer pending | Escort hired or offered | Retry lookup later |
| Economy | No history: explain one snapshot is insufficient | Loading economy from testnet | Current totals without trend | Can't reach testnet, Retry connection | n/a | Actual world totals shown | Last snapshot marked stale |
| Captain's log | Explain what will appear | n/a | Confirmed events plus interrupted update warning | Receipt link failure does not erase event | Pending is toast only | Confirmed orders with time and receipt | Existing entries remain readable |

## 9. Content dependencies

| Content | Owner | Status |
|---|---|---|
| UI copy | `docs/design-kit/text-copy.md` | Defined |
| Contract facts and limits | README, deployed contract, testnet evidence | Must be checked at implementation time |
| Map labels and goods | Existing typed game state | Available |
| Photography and key art | n/a | No asset required for this operational surface |
| Font licences and provenance | `apps/game/app/fonts/` | Included |

## 10. Proof and claims register

| Claim | Type | Source | Rule |
|---|---|---|---|
| NEAR testnet | Environment | Current app configuration and deployed world contract | Keep visible in the shell and transaction copy. |
| Actual world totals | Data | `economy_dashboard` contract view | Show only when the read succeeds. |
| Scoped game controls | Technical | Method-limited function-call key configuration | Describe the method scope and allowance; avoid absolute security claims. |
| Hidden destinations and ambushes use commit-reveal | Technical | Existing frontend digest flow and contract methods | Do not imply secrecy beyond the documented mechanism. |
| CRED has no monetary value | Scope | Project PRD | Keep near wallet and registration decisions. |

No testimonials, partner logos, production metrics, or mainnet claims are
approved.

## 11. Technical decisions

| Decision | Choice | Reason |
|---|---|---|
| Motion engine | CSS only | One event toast is the only authored motion. |
| Showpiece | Live archipelago map | It is the characteristic product surface. |
| Smooth scroll | None | Operational navigation must stay predictable. |
| Styling | Native controls and existing CSS custom properties | Intentional frontend-only retention; no framework or component-library migration. |
| Fonts | Local Barlow Condensed and DM Sans WOFF2 | OFL redistribution and no runtime font request. |
| Theme | Dark nautical only | User-approved redesign direction. |
| Contract work | None | Frontend-only scope. |
| Analytics | No new events | No analytics requirement or consent decision is approved. |

## 12. Gaming additions adapted for FRONTIER

### Player onboarding

| Step | Player action | Chain involvement | Fallback |
|---|---|---|---|
| 1 | Explore map, ports, and economy | Read-only testnet calls | Explicit unavailable state if RPC fails |
| 2 | Connect a funded NEAR testnet wallet | Wallet approval | Continue read-only exploration |
| 3 | Approve scoped game controls | Function-call key with limited allowance | Explain that real orders remain disabled |
| 4 | Register and place orders | Testnet transactions | Specific pending and error states |
| 5 | Back up hidden orders | Local file only | Restore control and mismatch error |

### Transaction prompts

Every prompt states the action, testnet context, pending status, and confirmed
result. FRONTIER does not request token approvals or token transfers in this
flow. The wallet key explanation must identify the game contract scope and
limited network-fee allowance.

### Data surfaces

| Surface | Data source | Refresh | Required states |
|---|---|---|---|
| Map and routes | Contract views | Existing poll interval | Loading, ready, interrupted, unavailable |
| Player, ships, ports | Contract views after wallet account is known | Existing poll interval | Empty, loading, ready, partial, unavailable |
| Economy | `economy_dashboard` | Existing poll interval and browser-session snapshots | Loading, one-snapshot empty, ready, unavailable |
| Events | Confirmed transaction outcomes | After an action | Empty, pending toast, confirmed log, failure toast |

## 13. Release checklist

- [ ] Main frontend agent maps the palette to CSS variables before component styling.
- [ ] No raw colour is added to TSX.
- [ ] No wallet prompt occurs during read-only exploration.
- [ ] All real testnet actions require the existing wallet and game controls.
- [ ] Event toast is the only authored motion and has a reduced-motion branch.
- [ ] Map remains the single showpiece.
- [ ] Keyboard, focus, target size, reflow, and contrast checks pass.
- [ ] Screenshots at 390px and 1440px are reviewed against `brief.md`.
- [ ] `pnpm exec tsc --noEmit` and `pnpm exec next build apps/game --webpack` pass.
- [ ] No contract, unrelated app, commit, or push is included in this workstream.
