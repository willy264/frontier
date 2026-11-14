[![CI](https://github.com/willy264/frontier/actions/workflows/ci.yml/badge.svg)](https://github.com/willy264/frontier/actions/workflows/ci.yml)

# FRONTIER: a trading world on NEAR testnet

FRONTIER is a trading and strategy game running in NEAR contracts. Players buy goods, seal convoy destinations, ambush rival traffic, and run player-owned port markets. The islands represent other chains; cross-chain settlement remains future work.

## Watch the demo

Recorded on 14 November 2026 on the production site (commit `daa9528`).

[Watch the narrated demo](https://frontier-willy264s-projects.vercel.app/demo/index.html) or [download the MP4](https://frontier-willy264s-projects.vercel.app/demo/frontier-demo.mp4). The video includes captions and shows real testnet transactions: a fresh captain registers, buys Blockspace, builds a sloop and hires a defence-3 escort. A scripted rival with 2 attack power reveals an ambush on the captain's route; the convoy departs inside that window, the ambush resolves against it, and all 46 units arrive because the escorted defence of 4 outweighs the raider. The captain then sells and sets and springs an ambush of their own.

The recording uses an automated testnet wallet adapter and synthetic narration (Microsoft Zira Desktop). Waiting periods are shortened. It does not verify an ordinary retail wallet login, and the filmed voyage sells at a loss: it shows the game loop, not a profit strategy (see "Known limits"). [Transaction evidence](results/video-demo.json), [round proof](results/production-ui-round.json), [narration](submission/voiceover-script.md), and [recording instructions](docs/VIDEO.md) are included.

## Try it locally

The production site runs the nautical redesign. [Desktop screenshot](results/design/verified-1440.png), [mobile screenshot](results/design/verified-390.png), and [QA evidence](docs/REDESIGN_QA.md) document the release.

```powershell
pnpm install
pnpm sim
pnpm test
pnpm exec next build apps/game --webpack
pnpm dev
```

Open `http://localhost:3000`. The map and Economy tab read the deployed testnet world when it is reachable. Connect a testnet wallet to provision a session-only function-call key limited to FRONTIER methods. Fleet and Ambush generate and persist commit-reveal salts in browser storage and offer a JSON backup download.

The scripted economy simulator remains available with `pnpm sim`; its results are labelled `SIMULATED`.

## Testnet deployment

- Root: `world3.testnet`
- World: `world3.world3.testnet`
- Explorer: https://testnet.nearblocks.io/address/world3.world3.testnet
- Deployment and initialization evidence: `results/deploy-testnet.json`
- Deployment transaction: `7yBzUscXD4TtziMY9ug81LEN1A64YA1fdkXGmUJZXDS5`
- Initialization transaction: `4RvJMuDzWCcHVDo9MHm5TJ3oS6tAPRC9dfrSz2aNMoNU`
- Latest WASM SHA-256: `4bffab9d1cdf21c217ab291eef8c09ee42b3afaf1b9b1904e6ae6f4ecee43b7b`
- Latest live round evidence: `results/production-ui-round.json` (production UI round, 14 November 2026); scripted contract round `results/round-2026-11-12T08-16-16-506Z.json`
- Live URL: https://frontier-willy264s-projects.vercel.app

The deploy command expects the root account credential in the user-level NEAR credential directory and only targets testnet:

```powershell
$env:FRONTIER_ROOT_ACCOUNT='world3.testnet'
$env:FRONTIER_WORLD_ACCOUNT='world3.world3.testnet'
pnpm deploy:testnet
pnpm demo:round
```

## Vercel deploy

1. Create a Vercel project from this repository with root directory set to the repository root.
2. Use `pnpm install --frozen-lockfile` as the install command and `pnpm exec next build apps/game --webpack` as the build command.
3. Add `NEXT_PUBLIC_FRONTIER_WORLD_ACCOUNT=world3.world3.testnet` and `NEXT_PUBLIC_FRONTIER_RPC_URL=https://rpc.testnet.fastnear.com`.
4. Deploy, open the generated URL, connect a testnet wallet, register, buy cargo, build a sloop, and use the hidden departure and ambush panels.
5. The production deployment is already available at the Live URL above; use that URL for the judge walkthrough.

## Why it is on-chain

- Port ownership and its treasury move atomically with a port NFT record; the contract exposes NEP-171 core views. Ports are contract NFTs in this MVP; port sub-accounts are future work.
- Ships and goods expose the NEP-245 minimum views and transfer call.
- Convoy destinations and ambushes use commit-reveal timing.
- A function-call key is restricted to game methods and cannot move a player's funds.
- Market prices and the economy change from player activity. Epoch advances enable player upkeep and goods spoilage, applied lazily on each player's next action; NPC demand, raids, and decay are visible flows.

## Project layout

- `apps/game`: Next.js map, market, fleet, raid, and economy views.
- `sim/economy.ts`: deterministic 100-player, 200-epoch model, labelled `SIMULATED`.
- `research`: genre, prior-art, technology, and economy decisions.
- `docs`: verified sources, architecture, and threat model.
- `execution`: task ledger and exact handoff state.

## Known limits of the deployed contract

The world contract is frozen for the hackathon. A review on 14 November 2026 confirmed these behaviours in `contracts/world/src/lib.rs` and live testnet state. Fixing them needs a contract change and a fresh world deployment.

- **Trades are not location-checked.** `buy` and `sell` use a player's global goods and take any `port_id`. This client only sells where one of your ships is docked, but a direct contract call can trade at any port without sailing.
- **NPC demand moves CRED; it does not mint it.** NPC buyers pay fixed prices (20, 30 and 40 CRED) out of a port's CRED reserve, capped at 160 CRED per epoch, and pay captains in registration order. Many epochs without player buying can drain a port's reserve and stop its market. Epochs advance only when someone calls `tick_epoch`; the live world is at epoch 1.
- **Arrival has no deadline.** An ambush catches departures in a 20-block window. `tick_epoch` expires and refunds revealed ambushes, so a convoy can wait out a revealed ambush before calling `arrive`.
- **Routes are one-way.** NEAR Capital has no outbound route, so ships that arrive there stay. From Solana Reef, Base Harbor and Tron Bay only one route leaves, so those destinations are hidden in name only.
- **Port treasuries cannot be withdrawn.** Fees accumulate in the port and move with it on transfer, but no method pays them out.
- **Every trade pays at least 30 CRED in fees.** That is 25% of a 120-CRED purchase.
- **Test coverage is narrower than the brief.** The property test exercises a small arithmetic model, not the contract, and the port-transfer unit test moves an empty treasury.

## Limits and safety

CRED is game currency and is not redeemable. The world contract is a focused MVP: NEAR Intents settlement and a production-grade season rollover are future work. NEAR Intents has no testnet path in this repository. No mainnet transaction is performed.

This MVP does not yet implement storms, separate port maintenance, production season rollover and carry-over, port sub-accounts, or the NEAR Intents cross-chain entry and payout pass. Goods decay/spoilage and player upkeep are implemented in the epoch flow; the other systems are future work.

The browser never receives a seed phrase. NEAR Connect adds a function-call key for the deployed world contract; wallet support and the user’s wallet approval are required. The key is held in session storage for the current browser session.

## Built with

Next.js 16, React 19, TypeScript, Vitest, NEAR Connect, near-api-js, near-sdk, cargo-near, and the NEAR standards described in `research/02-tech-verification.md`.

## AI/tools disclosure

Codex assisted with implementation, test authoring, debugging, and documentation. The guided tutorial is a deterministic local walkthrough, the live p1-p4 demo is scripted, and the contract NPC buyer follows deterministic island demand; no AI agent controls gameplay or NPC decisions.

The demo was recorded with Playwright and Chromium, edited with FFmpeg, and narrated locally using Windows System.Speech (Microsoft Zira Desktop). The voice is synthetic. No external voice account or voice clone was used.

## Related projects

Q-015 invoice-clearing project: https://github.com/willy264/near

## License

MIT. See `LICENSE`.

