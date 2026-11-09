# FRONTIER Architecture

## MVP boundaries

- `contracts/world`: one NEAR contract owns islands, routes, markets, ships, port records, CRED balances, commit-reveal state, epochs, and events.
- `apps/game`: Next.js app showing the map, market, fleet, raid, and economy panels. The first frontend iteration is usable with a clearly labelled demo state until a testnet contract is deployed.
- `sim`: deterministic TypeScript economy model. Results are labelled `SIMULATED`.
- `scripts`: deployment, seed, and scripted demo helpers.

## Ownership model

Ports are NEP-171-style records in the world contract. Inventory and treasury are keyed by port token ID and move inside the same state transition as an ownership transfer. Sub-accounts are deferred.

## Critical invariants

- A ship cannot trade or depart while in transit.
- Destination reveal must match its departure commitment.
- Only valid, timely ambush commitments can resolve.
- Port treasury follows the current port owner.
- NPC faucet remains capped each epoch.

