# FRONTIER handoff

## After the rewrite, 14 November 2026 13:40 UTC

- Releases on the rewritten history: e5cca87 (bold CRED balance with a How to earn CRED button; escort offers point to Show open offers; the Captain's log notes when another captain hires or releases your escort, including while the page was closed), c6c6afa (re-check a just-added game key for up to about 4.5 s before handing calls to the wallet). 60bda06, 63bed3e and e959931 change only the recorder. CI passed on all of them.
- Production fresh-account loop on c6c6afa (results/production-rewrite-round-partial.json): fresh captain capmwgg5vl66c04.frontierqa-11140241-8f06.testnet registered, bought 24 Blockspace, built a sloop, hired a defence-3 escort through the wallet, departed inside a scripted rival's revealed ambush window and arrived with all cargo. The sale was correctly disabled: 24 Blockspace at Solana Reef grosses 28 CRED, below the contract's 30 CRED minimum fee, after repeated test rounds moved prices. The UI ambush step was not reached in this run; it passed on preview 876b15a and in a manual production test.
- Recording from this machine needed FRONTIER_BROWSER_RPC=https://near-testnet.drpc.org and FRONTIER_RPC_URL=https://near-testnet.drpc.org: FastNEAR rate-limited the IP (429) and rpc.testnet.near.org is deprecated (429). The QA faucet account frontierqa-11140241-8f06.testnet is nearly empty (about 0.08 NEAR).

## Authorship rewrite, 14 November 2026 13:01 UTC

- 17 commits authored and committed as `emmanuel <badejoemmanuel805@gmail.com>` now read `Uiriamuzu <daviswill264@gmail.com>`. Method: `git filter-repo --mailmap` on a fresh `--mirror` clone, then `git push --force --mirror` over SSH. The 67 earlier commits kept their hashes.
- Verified before pushing: no Emmanuel identity in author or committer fields; `main`, `redesign` and the tag have the same tree as before (50bfe5e5); 84 commits before and after; author and committer dates unchanged; per-commit trees unchanged. filter-repo also replaced old commit IDs inside three commit messages (for example "record release-candidate evidence for 876b15a"); nothing else in any message changed.
- Rollback references (pre-rewrite): `main`, `redesign` and `hackathon-submission` were all 0a6f8dfbfed9c672c3e2b151934357f9ecc3c732. Vercel deployments of that commit: dpl_AQr2Rn1mEF6oKbDHWmyz3jxZ6vMG and dpl_AdRzZHJ2QZ8pSmJSioiLjHksMArj (one production, one preview; which is which was not visible without Vercel access). An untouched mirror backup was kept on the machine that ran the rewrite.
- Old to new hashes for commits referenced in docs: 3b7c04f to 876b15a, daa9528 to 8cb4d3f, 02e8863 to c4e2f19. README, docs/REDESIGN_QA.md, docs/VERIFIED.md, this file, results/preview-round.json, results/production-ui-round.json and results/video-hosting.json were updated.
- Releases after 07:40 UTC, under their new hashes: 57662a1 (Meteor wallet link), 187aef5 and daa39d4 (Meteor signs game calls with its own key; 50 Tgas per call), aadd5b4 (ambush leads of 30 to 120 blocks; reveal pre-check), 4978194 (3-ambush limit shown; rejected orders dropped), adb7c39 (Advance epoch button; scrollable ambush list), 247a159 (How to earn CRED dialog).
- Anyone with an older clone, including the owner's machine, must re-clone or run `git fetch && git reset --hard origin/main` before pushing, or the old history comes back. Old clones and GitHub caches may still hold the previous commits by hash.

## Released, 14 November 2026 07:40 UTC

- Release commit: `main` at 8cb4d3f (fast-forward from bb3fcc7). CI `app` and `contract` jobs passed on it.
- Production deployment: dpl_5ZLvtQmpuiEzTPXmXEVEoNe8V63j (frontier-8wcs7he8u-willy264s-projects.vercel.app). The owner assigned the canonical domain `frontier-willy264s-projects.vercel.app` to it at about 07:15 UTC. It did not follow the Git deployment automatically because the domain had been pinned to dpl_DcZi2CL6qgX3fDxeG9eUnywvfrhG; a first assignment went to `frontier-willy264-projects.vercel.app` (no "s") by mistake.
- Verified at 07:18 UTC: canonical domain serves the new build (bundle page-20c2332ecf683f0f); manifest, icons, OG image and demo files return 200/206.
- Tag: `hackathon-submission` force-moved from 84a49a6 to 8cb4d3f and pushed at 07:22 UTC, after the production round passed.
- Production live round (results/production-ui-round.json): fresh captain, escort and rival; Blockspace 400 CRED for 46 units; departure at block 277625486 inside the rival's revealed window 277625479 to 277625499; rival power 2 against escorted defence 4; ambush resolved against the convoy and all 46 units arrived; sold for 31 CRED; UI ambush committed and revealed; 22 transactions succeeded; scoped key revoked; axe found no violations on four signed-in panels.
- New demo video: recorded from that round on the production site, 98.3 s, 1920x1080 H.264/AAC, Microsoft Zira Desktop synthetic voice (Hazel is not installed on this machine). Metadata in results/video-demo.json. The commit that adds it triggers a new production deployment; confirm the canonical domain serves the new `/demo/frontier-demo.mp4` and reassign the domain if it does not follow.

Remaining human actions: test a retail testnet wallet (connect, buy, hire escort, sail); publish the X post with the new MP4; confirm team/contact details and payout account privately before the single submission. Mainnet, X posting and submission still need explicit approval.

Follow-ups: the OG image URL uses the deployment hostname (`VERCEL_URL`), not the canonical domain; remove the tldts pin after 7.5.2 passes 24 hours; mobile QA session CLS sum is 0.0974, close to the 0.1 gate.

## Release checkpoint, 14 November 2026 02:42 UTC

Work continued from a second machine (no Vercel login, no `world3.testnet` keys). Branch `redesign`; contracts unchanged. Remote tag `hackathon-submission` still 84a49a6; production still on dpl_DcZi2CL6qgX3fDxeG9eUnywvfrhG.

Review findings (contract frozen, so mitigated in the client and disclosed in README "Known limits"): trades are not location-checked, NPC demand pays from port reserves in registration order, `arrive` has no deadline, routes dead-end at NEAR Capital, port treasuries cannot be withdrawn, a 30 CRED fee floor, and a model-only property test. Do not run a `tick_epoch` keeper: `p2.world3.testnet` holds 159 Hashpower and would take the whole NPC cap while draining Bitcoin Isle's reserve.

Changes since 1a9b73c: sell only where a ship is docked; final-harbour warning; ambush window picker (fresh block height); escort offer board; `hire_escort`, `buy_port` and `set_port_sale_price` are wallet-signed, not game-key methods; WCAG 2.5.3 fixes on map controls; tldts pinned to 7.5.1 for pnpm 12's package age policy; recorder supports wallet signing, configurable cargo, and a UI ambush scene.

Preview release candidate 876b15a (dpl_212YGd3gDaMJCZ8h88jNUHNinMDy) passes the live fresh-account escort round, axe, responsive, assets, lab Web Vitals and CI. Evidence: docs/REDESIGN_QA.md and results/preview-round.json. QA test accounts are sub-accounts of the faucet account `frontierqa-11140241-8f06.testnet`; keys stay in ~/.near-credentials on that machine.

Next: merge to main, verify the canonical domain and a production live round, then move the tag and record the production video.

## Live preview underway, 14 November 2026 00:41 UTC

Polling fix9247212 deployed READY as dpl_4TyYmFW94AquZzcT8dkQ9777UdAJ at https://frontier-n537ycjzv-willy264s-projects.vercel.app. Both CI jobs green. Fresh-account worker has reached the authenticated market and saved its axe screenshot; full round remains pending. Local follow-up adds explicit failed-balance text and disables refresh while loading, records lab interaction timings in QA, and prepares nautical video captions. Typecheck passes; build pending. Do not publish main yet.11h19 to redesign cutoff;23h18 to submission.


## Polling diagnosis, 14 November 2026 00:34 UTC

Fresh-account registration succeeded, but14 concurrent reads every3 seconds exhausted FastNEAR limits. Node saw429; browser saw CORS MissingAllowOriginHeader/Failed to fetch. This is not a contract-method failure. Local fix caches immutable routes, refreshes ports/economy every30seconds or after an action, and polls captain/ships/height every6seconds with12/24/30second failure backoff. Initial port and route groups read sequentially to reduce bursts.22 tests pass including cache expiry/invalidation, failed-read eviction, concurrent deduplication and backoff. Typecheck/build verification in progress. Next push fixed polling to redesign and rerun live round with worker Laplace. No release/tag/video yet.11h26 to redesign cutoff;23h25 to submission.


## QA follow-up, 14 November 2026 00:32 UTC

Build/typecheck pass for stable RPC status header. A forced RPC outage previously inserted a banner and produced CLS0.112 in Lighthouse; the banner is removed, with status/retry reserved in the map header. QA now asserts no map displacement on RPC failure. Latest deployed d8159f9 passes20 responsive combinations and both CI jobs;21 token contrast pairs pass. Lighthouse varies with local load and did not reach90. Fresh-account loop is blocked by intermittent public reads after registration; diagnostic work ongoing. Do not release yet.11h28 to redesign cutoff;23h27 to submission. Contracts unchanged.


## Current release checkpoint, 14 November 2026 00:20 UTC

Branch: redesign. Production remains on verified deployment dpl_DcZi2CL6qgX3fDxeG9eUnywvfrhG via the canonical alias. Do not push main until preview QA and live loop pass. Remote hackathon-submission remains 84a49a6. Contracts unchanged.

Latest deployed preview before this checkpoint: 961686fa0b63a0862b4bfd804c935cb621860d2c, dpl_DJrXeA8dAVvZyhw3sUkFQafL5gGT, https://frontier-26bz9yhzk-willy264s-projects.vercel.app. Axe zero violations at390/1440, selected ports fully reachable, keyboard dialog and RPC error recovery tested; icon/manifest/OG return200. CLS .000043 mobile/.004418 desktop. Lighthouse mobile performance73/accessibility100, LCP1.6s, CLS0; performance target90 is not achieved. Field INP unavailable.

Current change separates public RPC reads from the signing bundle with abortable12-second reads and5 tests.19 unique tests and typecheck pass; production build in progress. CI now also runs on redesign. Next: push this change to redesign after build; rerun preview performance and responsiveness. Worker Laplace owns scripts/record-redesign.mjs and is debugging a fresh-account live loop. Earlier attempt timed out waiting for an enabled UI control; no completed round evidence yet. Keys remain outside git.

Remaining: complete preview full-loop proof including escort blocking raid; QA authenticated states; release/promote verified source; verify canonical domain and CI; record production video, update README/screenshots, align final tag and deployment. Deadline fallback at12:00 UTC only if still failing: icons/OG/manifest on old verified source. Redesign cutoff11h40 away; submission23h39 away. Historical entries below are superseded by this checkpoint.

## Release hold, 13 November 2026 19:12 UTC

Local follow-up: Playwright 1.65 root devDependency installed; QA imports it, falls back from Edge to bundled Chromium, and exits nonzero for overflow/page errors/small buttons. Mobile controls moved above chart with scrolling hint, selected-port scrollIntoView, route direction chevrons. TypeScript passed after map changes. Original sail icons and map OG card generated by scripts/generate-icons.py; manifest.ts serves /manifest.webmanifest and public contains 192/512 PNGs. These additions are NOT yet browser verified, preview deployed, or released. Next run full build, preview deploy and QA. Need check metadata/social URLs, favicon in browser, mobile screenshots and keyboard paths. No new video recorded.

User authorized rollback and preview-only completion. Canonical public domain frontier-willy264s-projects.vercel.app now resolves to verified deployment dpl_DcZi2CL6qgX3fDxeG9eUnywvfrhG. Verified through Vercel API and HTTP 200: old "Routes are open" heading present, "Trade the tides" absent. The rollback CLI returned 402 (plan permits only immediately previous production deployment); assigning the canonical alias to the existing verified deployment succeeded. This was an alias reassignment, not a Vercel rollback-state change. Other aliases have not been changed. Do not push main during QA: the Git integration auto-deploys it to production.

Current tag remains 84a49a6; redesign commit bb3fcc7 has green CI. New scope authorizes promoting the verified preview after QA, then moving the tag, then recording a new narrated escort video. Contracts remain unchanged. Deadline fallback: if QA fails at 14 November 12:00 UTC, preserve old deployment, apply only icons/OG assets to that version, and record there.

Next: complete portable Playwright dependency install and QA script; mobile pan controls/hint/selected-port scrolling, route arrowheads, icons/OG, preview deploy, full QA and fresh-account testnet loop. No new preview, icons, release or video has yet been completed. Existing generated apps/game/next-env.d.ts change predates this step.

## Active redesign checkpoint, 13 November 2026 18:45 UTC

Frontend-only nautical redesign is implemented locally. Actual kit is under docs/design-kit; licensed local Barlow Condensed and DM Sans replace Google CSS imports. New files: use-game.ts (polling, errors, scoped hidden-order storage), game-state.ts/tests, action-panel.tsx, sea-map.tsx/css. No contract changes. First production build and TypeScript passed. Initial desktop/mobile screenshots are under results/design. Full responsive QA was interrupted by a daemon restart; do not treat it as passed.

Next: rerun scripts/qa-game.mjs against a production server on port 3100, complete axe/Lighthouse and screenshot revision, validate wallet/full testnet loop, verify Vercel environment and deploy. Then record the escort demonstration, update README/evidence, wait for CI, and retag. Existing video still shows the old interface. No final deployment, video replacement, or tag update has been completed for this redesign. Stop redesign at 14 November 12:00 UTC.

Contract limitation: arrived event cannot distinguish an escort blocking a raid from no raid. UI truthfully reports intact escorted cargo. A staged live round must independently prove the ambush window and power before claiming an escort blocked it. Old recording script uses a previous contract and old selectors; update before use. Agent/process IDs were lost in the daemon restart.

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
