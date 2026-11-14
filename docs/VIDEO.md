# Demo video

Watch: https://frontier-willy264s-projects.vercel.app/demo/index.html

The exported MP4, separate MP3 narration, subtitles, and poster are in `apps/game/public/demo/`. The watch page offers downloads. `results/video-demo.json` records the MP4 checksum, duration, chapters, actual testnet transaction links, and account balances.

The footage shows the deployed website, not a mockup. The recording connects a fresh testnet captain through an injected recording wallet, provisions a real contract-restricted function-call key, and performs the game actions through UI controls. A Node process signs the wallet's key approval using credentials in the user-level NEAR directory; full-access keys never enter the browser. The restricted recording key is revoked when capture ends.

The rival ambush is scripted and clearly disclosed. The finished edit shortens waits and holds some frames for narration. The voice is Microsoft Hazel Desktop, synthesized locally with Windows System.Speech; it is not a human voice clone. Captions are burned into the image, with a separate SRT for editing.

This is not verification of a normal third-party wallet login. It also does not demonstrate profitable arbitrage, escort protection, port transfer, cross-chain settlement, or season rollover. The sale uses the selected market. Earlier scripted-round evidence is separate from the filmed sequence.

## Regenerate on Windows

For the nautical redesign, use `scripts/record-redesign.mjs`. It requires a fresh, unregistered captain, a defence-three escort and a scripted rival with two defence-one idle ships. The script can create testnet sub-accounts under `world3.testnet`; it refuses non-testnet account names. Set the site to the verified production URL only after release:

```powershell
$env:FRONTIER_VIDEO_SITE='https://frontier-willy264s-projects.vercel.app'
$env:FRONTIER_DEPLOYMENT_COMMIT=(git rev-parse HEAD)
$env:FRONTIER_VIDEO_OUT='data/video'
$env:FRONTIER_ROUND_RESULT='results/production-ui-round.json'
$env:FRONTIER_WORLD_ACCOUNT='world3.world3.testnet'
$env:FRONTIER_ROOT_ACCOUNT='world3.testnet'
node scripts/record-redesign.mjs
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/narrate-demo.ps1
node scripts/render-demo.mjs
```

The redesigned recorder checks the exact departure block against the revealed ambush window, the rival's actual idle defence, the linked escort, and loaded versus arrived cargo. It also records authenticated accessibility checks. Run with `FRONTIER_VIDEO_CAPTURE=0` for a preview walkthrough without raw video. An existing escort offer and rival can be reused through `FRONTIER_ESCORT_ACCOUNT`, `FRONTIER_ESCORT_OFFER_ID`, and `FRONTIER_RIVAL_ACCOUNT`; the captain must still be unregistered.

The commands below describe the older recording retained until the redesigned production capture passes.

Requirements: Node, pnpm, Windows PowerShell with Microsoft Hazel Desktop, Edge, and testnet account credentials already stored outside the repository. Install the optional recording tools into the ignored data directory:

```powershell
pnpm install --frozen-lockfile
npm install --prefix data/video-tools --no-audit --no-fund playwright @ffmpeg-installer/win32-x64
node scripts/record-demo.mjs
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/narrate-demo.ps1
node scripts/render-demo.mjs
```

Recording makes real testnet transactions. By default it creates a new `video<timestamp>.frontier-final.testnet` account funded with 0.6 testnet NEAR from `frontier-final.testnet`. Alternatively set `FRONTIER_VIDEO_ACCOUNT` to an existing funded account that has never registered in this world. The rival is `p3.frontier-final.testnet` and needs an idle ship and CRED stake. The recorder fails if the actual ambush misses its window; it never fabricates the result.

Raw footage, audio intermediates, browser salts, and temporary tool dependencies remain ignored under `data/`. Never publish that directory. Failed captures can leave testnet game state behind; a new run uses a fresh captain. Review `private-salt-backup.json` locally to recover a failed departure where available, without committing it.

The renderer exports H.264/AAC at 1920x1080, rejects edits longer than two minutes, and decodes the entire result to check it. Vercel copies the app's public assets into its root output during the configured build.
