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

Open `http://localhost:3000`. The map and Economy tab read the deployed testnet world when it is reachable. Connect a testnet wallet to provision a session-only function-call key limited to FRONTIER methods.

The scripted economy simulator remains available with `pnpm sim`; its results are labelled `SIMULATED`.

## Testnet deployment

- Root: `frontier-uiriamuzu.testnet`
- World: `world.frontier-uiriamuzu.testnet`
- Explorer: https://testnet.nearblocks.io/address/world.frontier-uiriamuzu.testnet
- Deployment and initialization evidence: `results/deploy-testnet.json`
- Full round evidence: `results/round-2026-11-10T08-11-25-715Z.json`

The deploy command expects the root account credential in the user-level NEAR credential directory and only targets testnet:

```powershell
pnpm deploy:testnet
pnpm demo:round
```

## Why it is on-chain

- Port ownership and its treasury are designed to move atomically with a port NFT record.
- Ships and goods fit NEP-245 multi-token records.
- Convoy destinations and ambushes use commit-reveal timing.
- A function-call key is restricted to game methods and cannot move a player's funds.
- Market prices and the economy change from player activity, with upkeep and raid-loss sinks in the current MVP.

## Project layout

- `apps/game`: Next.js map, market, fleet, raid, and economy views.
- `sim/economy.ts`: deterministic 100-player, 200-epoch model, labelled `SIMULATED`.
- `research`: genre, prior-art, technology, and economy decisions.
- `docs`: verified sources, architecture, and threat model.
- `execution`: task ledger and exact handoff state.

## Limits and safety

CRED is game currency and is not redeemable. The world contract is a focused MVP: spoilage, NEAR Intents settlement, full NEP-171/NEP-245 interfaces, and a production-grade season rollover are not complete. NEAR Intents has no testnet path in this repository. No mainnet transaction is performed.

The browser never receives a seed phrase. NEAR Connect adds a function-call key for the deployed world contract; wallet support and the user’s wallet approval are required. The key is held in session storage for the current browser session.

## Built with

Next.js 16, React 19, TypeScript, Vitest, and the NEAR standards described in `research/02-tech-verification.md`. Built with assistance from Codex. No AI agents are used in the game design; NPC demand is deterministic contract logic.

## Related projects

The owner also leads the independent invoice-clearing project: https://github.com/willy264/near

## License

MIT. See `LICENSE`.

