# FRONTIER Task Ledger

Updated: 2026-11-09 08:02 WAT

Deadline: 2026-11-15 00:59 WAT. Approximate time remaining at update: 138 hours.

| Task | Status | Notes |
|---|---|---|
| Read brief and common rules | done | Brief-only workspace inspected. |
| Research gate R1-R4 | done | Research records and verified sources created; Intents remains optional. |
| Economy simulation | done | 100 players x 200 epochs; bounded supply and faucet tests pass. |
| World contract | in progress | Rust contract, AMM, epochs, escorts, commit-reveal, port transfer, ship transfer, and events implemented; native WASM build passes. `cargo near` ABI build currently fails because public DTOs lack `JsonSchema`. |
| Contract unit/proptest suite | done | 4 tests pass on Windows with MSYS2/CMake. |
| Sandbox acceptance round | blocked pending contract build fix | WSL runtime reached the ignored test, then failed during `cargo near` ABI generation: `Player`, `Port`, `Route`, `Ship`, and `Good` need `JsonSchema` derives. |
| Frontend map and loop | paused by required build order | Existing local Next.js map, market, fleet, raid, and economy views build successfully; no new frontend wiring started after the contract-order instruction. |
| Testnet deployment | partial / blocked on init | Testnet account and `world`, `p1`-`p4` accounts exist; WASM deploy transaction succeeded. Initialization trapped with `WebAssembly trap: An unreachable opcode was executed`. Evidence: `results/deploy-testnet.json`. |
| RPC scripts | in progress | `near-api-js` v7 signer/provider migration compiles; deploy script writes evidence. Demo script is not yet valid end-to-end and must wait for a fixed initialized contract. |
| CI, fresh clone, submission docs | pending | Not started in this pause checkpoint. |

