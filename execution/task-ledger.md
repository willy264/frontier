# FRONTIER Task Ledger

Updated: 2026-11-10 09:40 WAT

Deadline: 2026-11-14 23:59 UTC. Approximate time remaining at update: 86 hours.

| Task | Status | Notes |
|---|---|---|
| Read brief and common rules | done | Brief, research gate, and project constraints are documented. |
| Economy simulation | done | 100 players x 200 epochs; bounded supply and faucet tests pass. |
| World contract | done for MVP | Serializer annotations, AMM, epochs, escorts, commit-reveal, port/ship transfers, events, and fee-underflow fix implemented. WSL `cargo near build` passes. |
| Contract unit/proptest suite | done | 37 tests pass single-threaded: every current error code, ambush timing edges, and proptest invariants. |
| Sandbox acceptance round | done | WSL ignored near-workspaces round passes, including restricted-key rejection. |
| Frontend map and loop | done for MVP | Next.js map/economy reads testnet state and submits contract calls through a session-only game key. Webpack build passes. |
| NEAR Connect login/key | done for MVP | Testnet login provisions a key restricted to FRONTIER methods; no browser seed credentials. |
| Testnet deployment | done | World recreated cleanly, cargo-near artifact deployed and initialized; evidence committed in `results/deploy-testnet.json`. |
| RPC scripts and live evidence | done | `pnpm demo:round` passed and wrote the committed full round JSON with explorer links. |
| CI | done locally / pending remote observation | Workflow committed; no remote or push configured by instruction. |
| Fresh clone | done | New local clone passed frozen install, tests, typecheck, and webpack build. |
| README/submission/video docs | done as drafts | Human must add public URL, hosted demo/video, X URL, and submit the form. |
