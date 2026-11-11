# FRONTIER Task Ledger

Updated: 2026-11-11 23:32 UTC (2026-11-12 00:32 WAT)

Deadline: 2026-11-14 23:59 UTC. Approximate time remaining at update: 72.4 hours.

| Task | Status | Notes |
|---|---|---|
| Narrated demo video | done | 117.89-second 1080p MP4, synthetic voice, captions, MP3, narration script, and public watch page. Twelve successful testnet receipts. Remote playback, seeking, checksum, and mobile layout verified in results/video-hosting.json. |
| Recording-discovered UI fixes | done | Quotes match the deployed minimum fee; new ships select from transaction results. Eight JavaScript tests and TypeScript pass. CI green on 650a0f2 and 09d356f. |
| Read brief and common rules | done | Brief, research gate, and project constraints are documented. |
| Economy simulation | done | 100 players x 200 epochs; bounded supply and faucet tests pass. |
| World contract | done for MVP | Serializer annotations, AMM, epochs, escorts, commit-reveal, port/ship transfers, events, and fee-underflow fix implemented. WSL `cargo near build` passes. |
| Contract unit/proptest suite | partial coverage | 48 tests pass in CI. A model-level proptest and focused conservation test exist; the requested random sequences of actual contract actions including raids and epochs are not covered by that proptest. |
| Sandbox acceptance round | done | WSL ignored near-workspaces round passes, including restricted-key rejection. |
| Frontend map and loop | done for MVP | Next.js map/economy reads testnet state and submits contract calls through a session-only game key. Webpack build passes. |
| NEAR Connect login/key | done for MVP | Testnet login provisions a key restricted to FRONTIER methods; no browser seed credentials. |
| Testnet deployment | done | Fresh `world.frontier-final.testnet` deployed and initialized; deploy tx `AUWBUMuuzLs9KuguHaCmAjN9pK8gXJjFqEgw8XkvAouu`, init tx `ChPnbDm39eanmyiNdkZw4Ly7EL8ho2EHUrLiwshyX7n`, and checksum `f7c8cef1...` are in `results/deploy-testnet.json`. |
| RPC scripts and live evidence | done | `pnpm demo:round` passed and wrote the committed full round JSON with explorer links. |
| CI | verified on gameplay fixes | App and contract jobs green on 09d356f (run 43118092463). Check the subsequent media commit before updating hackathon-submission. |
| Fresh clone | done | New local clone passed frozen install, tests, typecheck, and webpack build. |
| README/submission/video docs | done as drafts | Video is produced and linked. Human reviews it, posts on X, supplies private submission details and consent, then approves the exact form/API payload. |
| Browser commit-reveal loop | done | Browser salts use Web Crypto, localStorage, JSON backup, ambush reveal, and hidden-departure arrival controls. Frontend webpack and TypeScript checks pass. |
| NEP-171/245 and spoilage | done | Core NFT views, treasury-preserving transfer, multi-token ship/goods views/transfers, standard metadata, and live `tick_epoch` spoilage are tested and deployed. |
| Scripted practice mode | done for UI demo | UI is now a clearly labeled guided tutorial; real p1-p4 testnet actions are in `results/round-2026-11-11T14-19-28-579Z.json`. |
| Vercel deployment | done | Project `frontier` is live at `https://frontier-willy264s-projects.vercel.app`; README and submission JSON are updated. |
| Final verification | scoped checks pass | Prior sandbox, 48 contract tests, 8 JavaScript tests, TypeScript, and Vercel production build pass. A fresh-account UI loop was recorded with an automation wallet; normal retail wallet login remains unverified. |
| CI hardening and final redeploy | done | CI installs cargo-near without the optional Ledger/libudev dependency; audits and non-breaking upgrade decisions are documented in `docs/THREAT_MODEL.md`; the final world responds to economy, NFT, and MT views. |
