# FRONTIER Handoff

Updated 2026-11-10 17:20 WAT. The requested contract and playable-loop work is complete locally and on testnet. The next action is to review this final commit/tag, then the human can publish and record the submission. Do not add a remote, push, publish, post, submit, or touch mainnet.

Done:

- WSL `cargo near build non-reproducible-wasm --skip-rust-version-check` passes.
- Contract uses `#[near(serializers = [json, borsh])]` for public DTOs.
- NEP-171 port core views and transfer preserve the port treasury; NEP-245 minimum ship/goods methods and metadata are present.
- `tick_epoch` applies goods spoilage and `economy_dashboard` exposes the sink.
- Contract unit suite passes 39 tests, including error coverage, ambush edges, standards, treasury transfer, spoilage, and proptest invariants.
- Ignored near-workspaces sandbox passes the three-player escort, ambush, arrival, port-sale, and restricted-key boundary round.
- Testnet world was recreated and initialized from the new artifact. Deployment evidence is `results/deploy-testnet.json`.
- `pnpm demo:round` passed with live evidence in `results/round-2026-11-10T15-52-32-625Z.json`.
- Frontend has real browser commit-reveal salts, localStorage persistence, downloadable backups, ambush reveal, sealed-departure arrival, result feed, six-step walkthrough, economy spoilage display, and clearly labeled scripted practice mode.
- Frontend tests, TypeScript, and webpack production build pass.
- README, Vercel config, submission draft, video plan, X draft, and Q-015 related-project disclosure are current.

Exact remaining human actions:

- Publish the repository and deploy Vercel using the documented commands; replace the placeholder live URL in README and submission JSON.
- Use a brand-new testnet wallet to run the six-step flow and record the video. The repository has no browser automation tool, so this was not claimed as an automated judge walkthrough.
- Add the public repo, hosted demo/video, and X URLs, then submit the form.

Known limitations: NEAR Intents settlement and production season rollover are future work. The scripted practice button is a deterministic client timeline; the live p1-p4 contract round is evidenced separately by `pnpm demo:round`. `HACKATHON.md` is absent from the repository; the final review used `FRONTIER-BRIEF.md` and the existing research/verification docs.

Platform note: Windows cannot run near-workspaces 0.24 directly; WSL2 Ubuntu is the supported sandbox runtime.
