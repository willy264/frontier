# FRONTIER: a fully on-chain trading empire across the chains

FRONTIER is a persistent trading and strategy game designed to run in NEAR contracts. Players buy scarce goods, seal convoy destinations, choose risky or escorted routes, ambush rival traffic, and run player-owned port markets.

## Try it in 5 minutes

```powershell
pnpm install
pnpm sim
pnpm test
pnpm build
pnpm dev
```

Open `http://localhost:3000`. Click an island to inspect its market, switch to Economy to see the `SIMULATED` faucet/sink proof, and use the fleet and ambush controls to walk through the scripted MVP loop.

The current frontend is a local demo state. It does not claim testnet deployment or real-value settlement.

## Why it is on-chain

- Port ownership and its treasury are designed to move atomically with a port NFT record.
- Ships and goods fit NEP-245 multi-token records.
- Convoy destinations and ambushes use commit-reveal timing.
- A function-call key is restricted to game methods and cannot move a player's funds.
- Market prices and the economy change from player activity, with upkeep, maintenance, spoilage, and raid loss sinks.

## Project layout

- `apps/game`: Next.js map, market, fleet, raid, and economy views.
- `sim/economy.ts`: deterministic 100-player, 200-epoch model, labelled `SIMULATED`.
- `research`: genre, prior-art, technology, and economy decisions.
- `docs`: verified sources, architecture, and threat model.
- `execution`: task ledger and exact handoff state.

## Limits and safety

CRED is game currency and is not redeemable. The project is currently local-only. NEAR Intents is optional and has no testnet; no mainnet transaction is performed by this repository. Deployment requires a human-provided testnet account and explicit approval.

## Built with

Next.js 16, React 19, TypeScript, Vitest, and the NEAR standards described in `research/02-tech-verification.md`. Built with assistance from Codex. No AI agents are used in the game design; NPC demand is deterministic contract logic.

## Related projects

The owner also leads the independent invoice-clearing project: https://github.com/willy264/near

## License

MIT. See `LICENSE`.

