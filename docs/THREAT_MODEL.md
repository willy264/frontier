# FRONTIER Threat Model

| Threat | Control |
|---|---|
| Front-running destination | Commit destination before departure; reveal only after travel. |
| Late ambush commitment | Record departure block and require raid commitment earlier than it. |
| Late ambush reveal | Reveals close at `window_start + 20`. Known gap: on routes shorter than the window, arrival can open before reveals close, and `arrive` has no deadline, so a convoy can wait for `tick_epoch` to expire a revealed ambush. See README "Known limits". |
| Session key abuse | Scope receiver, explicit method list, and finite allowance. Since 14 November 2026 the game key excludes `hire_escort`, `buy_port` and `set_port_sale_price`, which move CRED or ports to another account; the wallet signs those. Keys approved before that change keep the old method list on-chain until the player deletes them in their wallet; disconnecting only removes the browser's copy. |
| Wash trading | Fees, capped NPC demand, visible event logs, and per-account limits. |
| Port treasury theft on transfer | Transfer ownership and port state in one contract call. |
| Randomness manipulation | Use random seed only for low-value storms/map reshuffles and document the limitation. |

## Dependency audit (2026-11-10)

`pnpm audit` found seven GitHub alert instances representing five unique advisories. They are all reachable through the development-only Vitest 3 test runner, not the shipped Next.js runtime. The available fixes require Vitest 4.1.11/4.1.12 or later, which is a major upgrade and outside the requested non-breaking-only policy.

| Package | Severity | Path | Decision |
|---|---|---|---|
| `vitest` 3.2.7 | moderate | `.>vitest` | Dev-only; fixed in 4.1.11+, major upgrade deferred. |
| `@vitest/mocker` | moderate | `.>vitest>@vitest/mocker` | Dev-only; fixed in 4.1.11+, major upgrade deferred. |
| `tinypool` 1.1.1 | critical | `.>vitest>tinypool` | Dev-only; fixed in 2.1.1+, major upgrade deferred. |
| `tinypool` 1.1.1 | critical | `.>vitest>tinypool` | Dev-only; fixed in 2.1.2+, major upgrade deferred. |
| `@vitest/mocker` | moderate | `.>vitest>@vitest/mocker` | Dev-only; fixed in 4.1.12+, major upgrade deferred. |

## Package age pin (2026-11-14)

pnpm 12's default supply-chain policy refuses lockfile entries published less than 24 hours earlier. The redesign QA tooling pulled `tldts-core` and `tldts-icann` 7.5.2 (published 2026-11-13 12:38 and 12:40 UTC) through `lighthouse > third-party-web`. Instead of exempting them, root `package.json` pins `tldts`, `tldts-core` and `tldts-icann` to 7.5.1 (published 2026-11-13 00:03 UTC) with `pnpm.overrides`. The lockfile was regenerated with pnpm 10, which CI and Vercel use, and pnpm 12 then verified all 349 entries against the policy. Only Lighthouse uses these packages; they are not shipped to players.

pnpm 11 and later no longer read the `pnpm` field in `package.json`. Local installs with those versions need the same three overrides in `pnpm-workspace.yaml`, or `pnpm install --frozen-lockfile` reports a configuration mismatch. Remove the pin once 7.5.2 or later is older than the policy window.

`cargo audit` found `crypto-bigint` 0.5.5 through `near-sdk`/`near-vm-runner`; the fix is 0.7.6+, a major transitive upgrade. It reports timing variability in constant-time arithmetic, but FRONTIER does not use `crypto-bigint` directly for contract game state or secret handling. `unsafe-libyaml` is unmaintained through the near/workspaces development stack. `wee_alloc` is not present in the default dependency tree. No production dependency was changed solely to suppress these findings.

