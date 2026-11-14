# FRONTIER Task Ledger

## Preview checks, 14 November 2026 00:10 UTC

11h50 to redesign cutoff; 23h49 to submission. redesign pushed at 374da82; preview dpl_829b4f37JbQgVD8j3Per9DWhmZ4q. Responsive QA passes 20 viewport/motion combinations. Axe/assets/keyboard/RPC-error checks, Lighthouse, updated build and fresh testnet escort round in progress. Production remains old verified version; tag unchanged. Pending local polish and metadata fix require new preview verification before release.

## Release hold, 13 November 2026 19:12 UTC

Local implementation progress: portable QA script/root Playwright installed; mobile controls/hint/selection scrolling and route arrows implemented; sail favicon/app icons/manifest/OG generated. TypeScript passes for map changes. Full QA, preview, live loop, promotion/tag, video remain pending. Keep main unpushed to preserve the public alias.

28h47 to submission; 16h48 to redesign cutoff. Public domain restored to verified dpl_DcZi2CL6qgX3fDxeG9eUnywvfrhG using alias reassignment after plan-blocked rollback. API and rendered heading verified. No main pushes until verified preview promotion. Tag unchanged at 84a49a6. Portable QA script started; mobile map, arrows, icons/OG, full QA, preview loop, release and new video remain pending. See latest handoff before deploying.

## Frontend redesign, 13 November 2026 18:45 UTC

29h14 to submission deadline; 17h15 to mandatory redesign cutoff.

- Implemented: actual design kit, local fonts, nautical tokens, interactive map, context action panel, inventory-bounded loading, hidden-order backup/restore, polling and RPC recovery, real economy totals, receipt-linked events.
- Verified: initial Next production build, TypeScript, unit suite. Initial 390px and 1440px screenshots captured.
- In progress: responsive/axe/Lighthouse QA and visual second pass. Daemon restart interrupted QA, so full gates remain unverified.
- Remaining: live retail-wallet walkthrough, Vercel deployment/environment verification, escort video capture and narration, README screenshot update, final CI and tag. Contracts unchanged.
- Exact next action: run production server on port 3100 and scripts/qa-game.mjs; consult execution/handoff.md for limitations.

Updated: 2026-11-12 08:35 UTC (2026-11-12 09:35 WAT)

Deadline: 2026-11-14 23:59 UTC. Approximate time remaining at update: 72.4 hours.

| Task | Status | Notes |
|---|---|---|
| Narrated demo video | done | 117.89-second 1080p MP4, synthetic voice, captions, MP3, narration script, and public watch page. Twelve successful testnet receipts. Remote playback, seeking, checksum, and mobile layout verified in results/video-hosting.json. |
| Recording-discovered UI fixes | done | Quotes match the deployed minimum fee; new ships select from transaction results. Eight JavaScript tests and TypeScript pass. CI green on 650a0f2 and 09d356f. |
| Read brief and common rules | done | Brief, research gate, and project constraints are documented. |
| Economy simulation | done | 100 players x 200 epochs; bounded supply and faucet tests pass. |
| World contract | done for MVP | Serializer annotations, AMM, epochs, escorts, commit-reveal, port/ship transfers, events, and fee-underflow fix implemented. WSL `cargo near build` passes. |
| Contract unit/proptest suite | partial coverage | 52 Rust tests pass locally and in CI, including error codes, ambush timing, escort, NPC demand, conservation model, indexed raider power, and NEP events. The model proptest is not a full random sequence of actual contract actions. |
| Sandbox acceptance round | done | WSL ignored near-workspaces round passes, including restricted-key rejection. |
| Frontend map and loop | done for MVP | Next.js map/economy reads testnet state and submits contract calls through a session-only game key. Webpack build passes. |
| NEAR Connect login/key | done for MVP | Testnet login provisions a key restricted to FRONTIER methods; no browser seed credentials. |
| Testnet deployment | done | Fresh `world3.world3.testnet` deployed and initialized; deploy tx `7yBzUscXD4TtziMY9ug81LEN1A64YA1fdkXGmUJZXDS5`, init tx `4RvJMuDzWCcHVDo9MHm5TJ3oS6tAPRC9dfrSz2aNMoNU`, checksum `4bffab9d1cdf21c217ab291eef8c09ee42b3afaf1b9b1904e6ae6f4ecee43b7b`. |
| RPC scripts and live evidence | done | `pnpm demo:round` passed on world3 and wrote `results/round-2026-11-12T08-16-16-506Z.json`, including a real escort-blocked raid and explorer links. |
| CI | verified on gameplay fixes | App and contract jobs green on 09d356f (run 43118092463). Check the subsequent media commit before updating hackathon-submission. |
| Fresh clone | done | New local clone passed frozen install, tests, typecheck, and webpack build. |
| README/submission/video docs | done as drafts | Video is produced and linked. Human reviews it, posts on X, supplies private submission details and consent, then approves the exact form/API payload. |
| Browser commit-reveal loop | done | Browser salts use Web Crypto, localStorage, JSON backup, ambush reveal, and hidden-departure arrival controls. Frontend webpack and TypeScript checks pass. |
| NEP-171/245 and spoilage | done | Core NFT views, treasury-preserving transfer, multi-token ship/goods views/transfers, standard metadata, and live `tick_epoch` spoilage are tested and deployed. |
| Scripted practice mode | done for UI demo | UI is now a clearly labeled guided tutorial; real p1-p4 testnet actions are in `results/round-2026-11-11T14-19-28-579Z.json`. |
| Vercel deployment | done | Project `frontier` is live at `https://frontier-willy264s-projects.vercel.app`; README and submission JSON are updated. |
| Final verification | scoped checks pass | 52 Rust tests, 18 frontend tests, TypeScript, Next webpack build, cargo-near build, and live world3 round pass. Normal retail wallet login remains unverified. |
| CI hardening and final redeploy | done | CI installs cargo-near without the optional Ledger/libudev dependency; audits and non-breaking upgrade decisions are documented in `docs/THREAT_MODEL.md`; the final world responds to economy, NFT, and MT views. |
| Final tag | done | `hackathon-submission` points to `cda1347` and is pushed to GitHub. |
