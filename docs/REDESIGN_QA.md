# Nautical redesign verification

Release candidate checks run against Vercel previews. Production stays on the verified pre-redesign deployment until the live round and preview checks pass. Contracts are unchanged.

## Release candidate 3b7c04f, 14 November 2026 02:40 UTC

Checked on preview deployment `dpl_212YGd3gDaMJCZ8h88jNUHNinMDy` (commit 3b7c04f) through `frontier-git-redesign-willy264s-projects.vercel.app`. CI `app` and `contract` jobs passed on 3b7c04f. Contracts unchanged.

| Gate | Result | Evidence |
|---|---|---|
| Live fresh-account round | Pass. Fresh captain, escort and rival. Register, buy 400 CRED of Liquidity, build sloop, hire defence-3 escort (wallet-signed), depart at block 277596684 inside the rival's revealed window 277596677 to 277596697, arrive with all 39 units, sell for 16 CRED, then set and spring a UI ambush. 22 transactions succeeded; the scoped key was revoked. | [preview-round.json](../results/preview-round.json) |
| Escort blocks raid | Pass. Rival idle power 2 is above the sloop's 1 and below sloop plus escort (4). The rival's active commits went 0, 1, 0, so the ambush matched this convoy, and loaded cargo equals arrived cargo. | `proof.rivalPower`, `proof.ambushWindow`, `proof.cargoPreservation` |
| Accessibility | Pass. axe with `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: zero violations at 390 and 1440. Every axe rule on the four signed-in panels: zero violations. Keyboard dialog, five ports and five routes pass. | [accessibility.json](../results/design/accessibility.json), `preview-round.json` `accessibility` |
| Responsive | Pass. 10 widths by 2 motion settings: no overflow, no buttons under 24px, no page errors. | [responsive.json](../results/design/responsive.json) |
| Assets | Pass. Favicon, manifest and OG image return 200. | `accessibility.json` |
| Core Web Vitals (lab) | Pass. Lighthouse mobile: LCP 1.4 s, CLS 0, TBT 580 ms, performance 85, accessibility 100. Scripted interactions took at most 128 ms. The QA session sum of unexpected shifts was 0.0974 at 390px, under 0.1 but close; field INP and CLS need real traffic. | [lighthouse-mobile-release.json](../results/design/lighthouse-mobile-release.json) |
| Unit tests and types | Pass. 29 tests, app and root TypeScript. | CI `app` job |

Fixed during this pass: a 10-block ambush lead could be stale and fail with `ERR_WINDOW` (now reads a fresh block), and 11 map controls failed WCAG 2.5.3 Label in Name (the earlier axe tag list omitted `wcag21a`).

## Visual review

The map occupies the main stage. Amber marks actions and Hashpower; the other goods have labelled semantic colours. Barlow Condensed and DM Sans are self-hosted. No glass panels, gradient buttons, decorative statistics, stock photography or repeated marketing cards were added.

At narrow widths the chart scrolls horizontally instead of shrinking labels. The explicit swipe/arrow hint, separate control row and keyboard selection make all five ports reachable. Selecting a port scrolls its full label into view. Route chevrons show direction. The selected port must be fully visible; neighbouring off-screen ports remain reachable by panning.

The second screenshot review removed redundant guest-panel headings, reduced the desktop map's empty lower band, and made “Explore before connecting” plain text. The RPC error banner originally moved the whole map; status and retry now occupy reserved header space. Authenticated screenshots and the production recording remain pending.

## Evidence

| Check | Result and evidence |
|---|---|
| Contrast | 21 foreground/background and input-border pairs pass in [contrast.json](../results/design/contrast.json). Semantic text has labels. |
| Responsive | All ten widths, normal and reduced motion, pass overflow, page-error and 24px button checks in [responsive.json](../results/design/responsive.json). |
| Accessibility | Zero axe violations at390 and1440; keyboard dialog/Escape and all five selected ports checked in [accessibility.json](../results/design/accessibility.json). |
| RPC failure | Forced failed reads display a retry action; map displacement is0px after the reserved-status fix. |
| Assets | Browser-discovered favicon, manifest and OG image return200. Original sail mark and app-icon sizes are in the repository. |
| Tests/build |22 unit tests, root TypeScript and Next production build pass. CI also runs on redesign. |
| Lighthouse | Accessibility100 in recorded runs. Performance has varied from60 to78 under local load, below the earlier90 target; final isolated run pending. Preview SEO55 includes intentional preview noindex. |
| Web Vitals | Final LCP/CLS and scripted interaction timings pending on the polling fix. Field p75 INP cannot be claimed from a lab run. |
| Live wallet loop | Pending; automated testnet wallet is disclosed. Retail extension login is not verified. |

## Polling behaviour

The first live loop exposed FastNEAR rate limiting under14 concurrent requests every3seconds. Routes now cache for the page session. Ports and economy refresh every30seconds and after an action. Captain, ships and block height refresh every6seconds. Failed polls back off to12,24 and30seconds. No balances or transaction results are fabricated to mask an outage.

## Remaining release checks

Complete a fresh-account preview round and verify actual escort protection from chain state and receipts. Run final preview checks, promote the verified source, verify the canonical domain and green CI, record the new production video, and align the release tag and handoff. The current public video predates the redesign.
