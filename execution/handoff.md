# FRONTIER Handoff

Updated 2026-11-11 23:00 WAT. Contract hardening, the live playable loop, public GitHub repository, and Vercel deployment are complete. The remaining work is human-owned video/X/submission actions. Mainnet remains untouched.

Done:

- WSL `cargo near build non-reproducible-wasm --skip-rust-version-check` passes.
- Contract uses `#[near(serializers = [json, borsh])]` for public DTOs.
- NEP-171 port core views and transfer preserve the port treasury; NEP-245 minimum ship/goods methods and metadata are present.
- `tick_epoch` applies goods spoilage and `economy_dashboard` exposes the sink.
- Contract unit suite passes 48 tests, including error coverage, hidden destinations, ambush lifecycle/timing, standards, treasury transfer, lazy epochs, and conservation accounting.
- Ignored near-workspaces sandbox passes the three-player escort, ambush, arrival, port-sale, and restricted-key boundary round.
- Fresh `world.frontier-final.testnet` was deployed and initialized from the changed-state artifact. Deployment evidence is `results/deploy-testnet.json`.
- `pnpm demo:round` passed with live evidence in `results/round-2026-11-11T14-19-28-579Z.json`.
- Frontend has browser salts, localStorage persistence, downloadable backups, destination-only departure, route selection at arrival, live AMM quotes/min-out, port fee control, contract-driven ships, result feed, six-step walkthrough, economy spoilage display, and a guided tutorial.
- Frontend tests, TypeScript, and webpack production build pass.
- README, Vercel config, public demo URL, submission draft, video plan, X draft, and Q-015 related-project disclosure are current.

Exact remaining human actions:

- Record the video using the public demo at `https://frontier-willy264s-projects.vercel.app`.
- Use a brand-new testnet wallet to run the six-step flow and record the video. The repository has no browser automation tool, so this was not claimed as an automated judge walkthrough.
- Publish the X post, add its URL and the video URL to `submission/submission.json`, then submit the form after reviewing the exact payload.

Known limitations: NEAR Intents settlement and production season rollover are future work. The guided tutorial is local-only; live p1-p4 activity is evidenced by `pnpm demo:round`. `HACKATHON.md` is absent from the repository; the final review used `docs/FRONTIER-BRIEF.md` and the existing research/verification docs.

Platform note: Windows cannot run near-workspaces 0.24 directly; WSL2 Ubuntu is the supported sandbox runtime.
