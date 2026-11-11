# Verified FRONTIER Facts

| Date | Finding | Source |
|---|---|---|
| 2026-11-08 | NEP-245 is a final multi-token standard with batch transfers and events. | https://github.com/near/NEPs/blob/master/neps/nep-0245.md |
| 2026-11-08 | NEP-171 defines the NFT core and event conventions. | https://github.com/near/NEPs/blob/master/neps/nep-0171.md |
| 2026-11-08 | Function-call keys can restrict receiver, method names, and allowance. | https://docs.rs/near-primitives-v01/latest/near_primitives_v01/account/struct.FunctionCallPermission.html |
| 2026-11-08 | 1Click uses quote/deposit/status and has no testnet. | https://github.com/near/agent-skills/blob/main/skills/near-intents/references/concepts.md |

Unverified account IDs, deployment URLs, transaction hashes, and wallet-specific behavior must not be added here until tested.

## Narrated browser demo (2026-11-11 UTC)

- `apps/game/public/demo/frontier-demo.mp4`: 117.89 seconds, 1920x1080, H.264 video and AAC audio. FFmpeg decoded the entire export successfully. Edge played and sought through the local watch page without a media error.
- Audio is locally synthesized Microsoft Hazel narration. Measured mean level is -16.3 dB and peak is -1.5 dB; the AAC stream is present and non-silent.
- Public evidence: `results/video-demo.json`, with 12 successful testnet receipts including fresh-account setup, scoped-key approval, purchases, ship construction, rival/player ambushes, departure, arrival, and sale.
- Captain `video1794439157987.frontier-final.testnet` bought 41 Hashpower, lost 20 in the scripted rival's ambush, and sold the remaining 21. Its scoped recording key was revoked; the post-recording access-key query found zero function-call keys.
- Rehearsals exposed the market minimum-fee mismatch and unreliable new-ship selection. Fixes `650a0f2` and `09d356f` have six regression cases; all eight JavaScript tests pass. GitHub Actions passed app and contract jobs on `09d356f` in [run 43118092463](https://github.com/willy264/frontier/actions/runs/43118092463).
- Inspected representative exported frames and browser playback. No private keys or salt contents appear in the exported footage. Raw captures and private backups remain ignored under `data/`.
- Public watch page, MP4, MP3, SRT, and poster all return HTTP 200. The remote MP4 checksum matches the export; byte-range requests return 206. Edge played the production video and sought near the end; the page fits a 390-pixel viewport. Evidence: `results/video-hosting.json`.

The recording uses an injected automation wallet and a scripted rival. It verifies the filmed testnet actions, not a retail wallet-provider login, profitable arbitrage, or the entire original product brief. See `docs/VIDEO.md` for the exact scope.

The [official HACKATHON.md](https://nearhackathon.com/HACKATHON.md) was re-read on 2026-11-11 UTC. Submission remains a separate human-approved action; the public project manifest is not the API payload.

