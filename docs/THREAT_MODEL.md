# FRONTIER Threat Model

| Threat | Control |
|---|---|
| Front-running destination | Commit destination before departure; reveal only after travel. |
| Late ambush commitment | Record departure block and require raid commitment earlier than it. |
| Late ambush reveal | Close reveal window before `arrive` opens. |
| Session key abuse | Scope receiver, explicit method list, and finite allowance. |
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

`cargo audit` found `crypto-bigint` 0.5.5 through `near-sdk`/`near-vm-runner`; the fix is 0.7.6+, a major transitive upgrade. It reports timing variability in constant-time arithmetic, but FRONTIER does not use `crypto-bigint` directly for contract game state or secret handling. `unsafe-libyaml` is unmaintained through the near/workspaces development stack. `wee_alloc` is not present in the default dependency tree. No production dependency was changed solely to suppress these findings.

