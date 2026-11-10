[![CI](https://github.com/willy264/frontier/actions/workflows/ci.yml/badge.svg)](https://github.com/willy264/frontier/actions/workflows/ci.yml)

# FRONTIER: a fully on-chain trading empire across the chains

FRONTIER is a persistent trading and strategy game designed to run in NEAR contracts. Players buy scarce goods, seal convoy destinations, choose risky or escorted routes, ambush rival traffic, and run player-owned port markets.

## Try it locally

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

- Root: `frontier-uiriamuzu.testnet`
- World: `world.frontier-uiriamuzu.testnet`
- Explorer: https://testnet.nearblocks.io/address/world.frontier-uiriamuzu.testnet
- Deployment and initialization evidence: `results/deploy-testnet.json`
- Latest deploy-only transaction: `8fTNboMxWxTWB9YbfH1V8Qjc6j5UxTenzocwHncyYZZz`
- Latest WASM SHA-256: `02add099b1446b7e2b40ec654b6c00f991f5b4006d9e1d3e00a41e56a56ee8c4`
- Full round evidence: `results/round-2026-11-10T08-11-25-715Z.json`
- Latest live round evidence: `results/round-2026-11-10T15-52-32-625Z.json`
- Live URL: not published yet. After authorization, deploy the Vercel project and replace this line with its URL.

The deploy command expects the root account credential in the user-level NEAR credential directory and only targets testnet:

```powershell
pnpm deploy:testnet
pnpm demo:round
```

## Vercel deploy

1. Create a Vercel project from this repository with root directory set to the repository root.
2. Use `pnpm install --frozen-lockfile` as the install command and `pnpm exec next build apps/game --webpack` as the build command.
3. Add `NEXT_PUBLIC_FRONTIER_WORLD_ACCOUNT=world.frontier-uiriamuzu.testnet` and `NEXT_PUBLIC_FRONTIER_RPC_URL=https://rpc.testnet.fastnear.com`.
4. Deploy, open the generated URL, connect a testnet wallet, register, buy cargo, build a sloop, and use the hidden departure and ambush panels.
5. Replace the Live URL line above and `demo_url` in `submission/submission.json` after the deployment is publicly available.

## Why it is on-chain

- Port ownership and its treasury move atomically with a port NFT record; the contract exposes NEP-171 core views.
- Ships and goods expose the NEP-245 minimum views and transfer call.
- Convoy destinations and ambushes use commit-reveal timing.
- A function-call key is restricted to game methods and cannot move a player's funds.
- Market prices and the economy change from player activity, with upkeep, raid-loss, and live goods-spoilage sinks in `tick_epoch`.

## Project layout

- `apps/game`: Next.js map, market, fleet, raid, and economy views.
- `sim/economy.ts`: deterministic 100-player, 200-epoch model, labelled `SIMULATED`.
- `research`: genre, prior-art, technology, and economy decisions.
- `docs`: verified sources, architecture, and threat model.
- `execution`: task ledger and exact handoff state.

## Limits and safety

CRED is game currency and is not redeemable. The world contract is a focused MVP: NEAR Intents settlement and a production-grade season rollover are future work. NEAR Intents has no testnet path in this repository. No mainnet transaction is performed.

The browser never receives a seed phrase. NEAR Connect adds a function-call key for the deployed world contract; wallet support and the user’s wallet approval are required. The key is held in session storage for the current browser session.

## Built with

Next.js 16, React 19, TypeScript, Vitest, NEAR Connect, near-api-js, near-sdk, cargo-near, and the NEAR standards described in `research/02-tech-verification.md`.

## AI/tools disclosure

Codex assisted with implementation, test authoring, debugging, and documentation. Practice rivals and the contract NPC faucet are deterministic rule-based code; no AI agent controls gameplay or NPC decisions.

## Related projects

Q-015 invoice-clearing project: https://github.com/willy264/near

## License

MIT. See `LICENSE`.

