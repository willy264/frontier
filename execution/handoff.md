# FRONTIER handoff

Updated 2026-11-12 08:35 UTC. Deadline: 2026-11-14 23:59 UTC.

## Completed in the narrated-video task

- Produced and deployed the actual demo video: https://frontier-willy264s-projects.vercel.app/demo/index.html.
- Export: 117.89 seconds, 1920x1080 H.264/AAC, burned captions, synthetic Microsoft Hazel narration, separate MP3 and SRT, poster, and an accessible watch/download page. Files are in `apps/game/public/demo/`.
- Recorded a fresh captain using an automated injected recording wallet and a real scoped function-call key. The captain bought 41 Hashpower, built ship 7, sealed a departure, lost 20 cargo to a scripted rival, sold 21, and committed/revealed its own ambush. All calls used the deployed app and real testnet.
- `results/video-demo.json` contains twelve successful receipt links, balances, chapter timings, MP4 checksum, and confirmation that the recording key was revoked. `results/video-hosting.json` verifies public downloads, matching bytes, byte ranges, playback/seeking, and a mobile viewport.
- Fixed two bugs exposed by recording: incorrect minimum-fee quotes (`650a0f2`) and unreliable new-ship selection (`09d356f`). Eight JavaScript tests pass; app TypeScript passes; GitHub Actions app and contract jobs passed on both fixes.
- Vercel production build passes. Deployment: `dpl_DcZi2CL6qgX3fDxeG9eUnywvfrhG`. The existing canonical domain serves the video correctly.
- Re-read the official HACKATHON.md, updated README/disclosures, finished the narration and reproduction guide, and corrected the X draft to include the required hackathon credit and tags. The submission manifest now points to the video and is explicitly not an API payload.

## Previously completed and retained

World `world3.world3.testnet` is deployed and initialized. Deployment evidence is in `results/deploy-testnet.json`; the final scripted round is `results/round-2026-11-12T08-16-16-506Z.json`. The app includes trading, browser commit-reveal secrets/backups, fleet actions, live contract ship positions, escort status, contract events, port controls, economy totals, and a guided tutorial.

## Final state / exact next action

Concept-alignment work is complete. `main` is at `cda1347`, GitHub Actions run `43181699742` is green, and remote tag `hackathon-submission` points to `cda1347`. No render, browser, development server, or watcher needs to stay running. On resume, inspect `git log -3 --oneline`, the remote tag, and the final round evidence before making changes.

## Remaining human actions

1. Review the finished video; no new recording is required for the supplied demo.
2. Test a normal supported retail wallet login if desired. The recording wallet is an automation adapter, not evidence of a third-party wallet walkthrough.
3. Publish `submission/x-post-draft.md` with the MP4 attached, and add the X post URL to the manifest.
4. Supply team/contact details, your own mainnet payout account, track/description confirmation, and contact consent privately. Review the exact submission payload before the one allowed submission. Do not put personal details or credentials in the public repository.

## Honest limits and outstanding engineering coverage

- NEAR Intents settlement and production season rollover are future work. No mainnet transaction was performed.
- The in-app guided tutorial does not run rivals. The recording's separate scripted rival placed real testnet ambushes.
- The filmed sale uses the selected market and is not proof of profitable arbitrage or location-restricted markets. Escort protection and port transfer are not demonstrated by this video.
- The existing proptest exercises a small model; it does not implement the requested random sequences of actual contract trades, raids, and epochs. The ledger now states this coverage gap rather than calling that requirement complete.
- Dependency alerts already documented in `docs/THREAT_MODEL.md` remain; this video task does not change dependencies.
- Failed rehearsal captures remain ignored under `data/video/`; some testnet rehearsal accounts retain game state. Credential files live only in the user-level NEAR directory. Never commit raw browser backups or that directory.

Permissions persist: testnet actions, pushing this repository's main branch, deployment to the existing Vercel project, and refreshing the submission tag are authorized. Mainnet, X publication, and the final submission require explicit approval.
