# FRONTIER Handoff

Updated 2026-11-11 08:00 WAT. Contract hardening and the live playable loop are updated locally and on testnet. The remaining work is final CI/tag verification and human-owned hosting/video/submission actions. Mainnet remains untouched.

Done:

- WSL `cargo near build non-reproducible-wasm --skip-rust-version-check` passes.
- Contract uses `#[near(serializers = [json, borsh])]` for public DTOs.
- NEP-171 port core views and transfer preserve the port treasury; NEP-245 minimum ship/goods methods and metadata are present.
- `tick_epoch` applies goods spoilage and `economy_dashboard` exposes the sink.
- Contract unit suite passes 48 tests, including error coverage, hidden destinations, ambush lifecycle/timing, standards, treasury transfer, lazy epochs, and conservation accounting.
- Ignored near-workspaces sandbox passes the three-player escort, ambush, arrival, port-sale, and restricted-key boundary round.
- Fresh `world2.frontier-uiriamuzu.testnet` was deployed and initialized from the changed-state artifact. Deployment evidence is `results/deploy-testnet.json`.
- `pnpm demo:round` passed with live evidence in `results/round-2026-11-11T06-51-48-317Z.json`.
- Frontend has browser salts, localStorage persistence, downloadable backups, destination-only departure, route selection at arrival, live AMM quotes/min-out, port fee control, contract-driven ships, result feed, six-step walkthrough, economy spoilage display, and a guided tutorial.
- Frontend tests, TypeScript, and webpack production build pass.
- README, Vercel config, submission draft, video plan, X draft, and Q-015 related-project disclosure are current.

Exact remaining human actions:

- Publish the repository and deploy Vercel using the documented commands; replace the placeholder live URL in README and submission JSON.
- Use a brand-new testnet wallet to run the six-step flow and record the video. The repository has no browser automation tool, so this was not claimed as an automated judge walkthrough.
- Add the public repo, hosted demo/video, and X URLs, then submit the form.

Known limitations: NEAR Intents settlement and production season rollover are future work. The guided tutorial is local-only; live p1-p4 activity is evidenced by `pnpm demo:round`. `HACKATHON.md` is absent from the repository; the final review used `docs/FRONTIER-BRIEF.md` and the existing research/verification docs.

Platform note: Windows cannot run near-workspaces 0.24 directly; WSL2 Ubuntu is the supported sandbox runtime.
