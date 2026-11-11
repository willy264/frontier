# FRONTIER Task Ledger

Updated: 2026-11-10 17:20 WAT

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
| Testnet deployment | done | Fresh `world.frontier-final.testnet` deployed and initialized; deploy tx `AUWBUMuuzLs9KuguHaCmAjN9pK8gXJjFqEgw8XkvAouu`, init tx `ChPnbDm39eanmyiNdkZw4Ly7EL8ho2EHUrLiwshyX7n`, and checksum `f7c8cef1...` are in `results/deploy-testnet.json`. |
| RPC scripts and live evidence | done | `pnpm demo:round` passed and wrote the committed full round JSON with explorer links. |
| CI | done locally / pending remote observation | Workflow committed; no remote or push configured by instruction. |
| Fresh clone | done | New local clone passed frozen install, tests, typecheck, and webpack build. |
| README/submission/video docs | done as drafts | Public repo and Vercel URL are filled in; human still adds the recorded video URL, X URL, and submits the form. |
| Browser commit-reveal loop | done | Browser salts use Web Crypto, localStorage, JSON backup, ambush reveal, and hidden-departure arrival controls. Frontend webpack and TypeScript checks pass. |
| NEP-171/245 and spoilage | done | Core NFT views, treasury-preserving transfer, multi-token ship/goods views/transfers, standard metadata, and live `tick_epoch` spoilage are tested and deployed. |
| Scripted practice mode | done for UI demo | UI is now a clearly labeled guided tutorial; real p1-p4 testnet actions are in `results/round-2026-11-11T14-19-28-579Z.json`. |
| Vercel deployment | done | Project `frontier` is live at `https://frontier-willy264s-projects.vercel.app`; README and submission JSON are updated. |
| Final verification | done locally | Sandbox, 39 contract tests, frontend tests, TypeScript, and webpack build pass. A browser-wallet walkthrough was not automated in this environment. |
| CI hardening and final redeploy | done locally / awaiting GitHub | CI installs `libudev-dev` before cargo-near; audits and non-breaking upgrade decisions are documented in `docs/THREAT_MODEL.md`; deploy-only tx `8fTNboMxWxTWB9YbfH1V8Qjc6j5UxTenzocwHncyYZZz` responds to economy, NFT, and MT views. |
