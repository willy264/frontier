# FRONTIER: Full Build Brief for the Coding Agent

**Lead:** the owner. This is their 2nd project; their 1st is the invoice-clearing project (https://github.com/willy264/near).
**Tracks:** `games` (primary), `nfts`.
Read `COMMON-RULES.md` first. Its guardrails override this brief.

> **One sentence:** FRONTIER is a fully on-chain trading-empire game on NEAR. The map is an archipelago of the chains NEAR Intents connects, players own and run every port and market, and fleet moves are hidden with commit-reveal. The economy changes through player behaviour, not developer patches.

**Track text (verified):** "Build NPCs with wallets, player-owned markets and economies that evolve without a dev patch. Judged on the game loop, not the token — bonus if players never notice the chain."
**Hints:** agent NPCs, social login, NEAR Intents, NEP-245. **Do NOT use AI agents.** NPC buyers are deterministic, rule-based contract logic.

---

## PHASE 0: Context (≈30 min)
1. Record the hours remaining to 2026-11-14 23:59 UTC in `execution/task-ledger.md`.
2. The owner already has another project. Keep this repo, its code and its accounts **independent**. Reuse only public libraries.
3. Check the toolchain (see COMMON-RULES §3). Ask the human for the testnet account name, e.g. `frontier-<name>.testnet`.

## PHASE 1: RESEARCH FIRST (≈4–6 hours; no product code before Gate R)
Improve this design where research shows a better choice. Label each finding VERIFIED / INFERRED / HYPOTHESIS / UNKNOWN, with its source.

### R1. Genre and player research → `research/00-brief.md`
Study fully on-chain or "autonomous world" games and record what crypto-native players valued and what failed. Candidates:
- **Dark Forest:** ZK fog of war.
- **Loot Survivor:** Starknet.
- **Primodium, Pirate Nation, Sky Strife:** MUD/Lattice.
- **Influence:** a space economy.
- **EVE Online's player economy:** a non-crypto benchmark for player-run markets.
- **Axie Infinity SLP inflation:** the failure case.

For each, note the core loop, session length, how on-chain state was used, how they handled wallet popups and gas, and why players left.

Then decide two things:
- **Session length:** target 10–15 minute sessions plus async play.
- **The single "fun" moment:** the arbitrage-vs-ambush gamble.

### R2. Prior art and originality → `research/01-prior-art.md`
- Search for existing NEAR games using NEP-245 or player-owned markets, and for any #NEARHackathon game entries (X, GitHub created after 2026-10-18).
- State in two sentences how FRONTIER differs.

### R3. Economy design → `research/03-design-decisions.md`
1. List every **faucet** (season grant, NPC demand contracts) and every **sink** (upkeep, maintenance, spoilage, raid losses, fees burned).
2. Write a tiny TypeScript economy simulation, `sim/economy.ts`. Run 100 simulated players over 200 epochs. Tune the parameters so total money supply stays within a band and doesn't run away.
3. Commit-reveal fog of war: define the timing windows so there's no front-running.
   - A raider must commit before seeing convoys.
   - Convoys commit their destination at departure.
   - Ambush reveals close before arrival claims open.
4. Write an anti-abuse analysis:
   - multi-account self-raiding;
   - port owners wash-trading their own market to farm fees;
   - griefing with spam commits.

   Add mitigations: stakes, minimum fees, per-account caps.

### R4. Technical verification → `research/02-tech-verification.md` and `docs/VERIFIED.md`
- **Game-only keys:** verify how near-connect (@hot-labs/near-connect 0.12) or wallet-selector creates a **function-call access key** on sign-in. The key must be limited to `contractId` and a `methodNames` list, with a gas allowance.
  - Confirm in docs: https://docs.near.org/protocol/accounts-contracts/access-keys
  - Confirm the wallet behaviour in at least one wallet (MyNearWallet, Meteor, HOT, or Intear).
  - Fallback: the app generates a keypair locally, and the user signs ONE `AddKey` transaction that grants a function-call key restricted to the game contract.
- **NEP-245 multi-token:** read the spec at https://github.com/near/NEPs/blob/master/neps/nep-0245.md and decide whether to implement it in-contract.
- **NEP-171 for ports:** decide between two models:
  - (a) port inventory and fees held inside the game contract, keyed by port token ID, so transferring the NFT transfers everything — **the MVP**;
  - (b) a sub-account per port — the stretch goal.
- **Randomness:** `env::random_seed()` semantics and its manipulation risk. It's fine for storms and map shuffles; document why.
- **Optional NEAR Intents season entry:** read the 1Click docs (https://docs.near-intents.org/llms.txt) for quotes and deposit addresses. Mainnet only. The human must approve before any spend.

### Gate R
Proceed only when all three are written down:
1. The economy sim shows a bounded money supply under the chosen parameters.
2. The game-only key approach is verified, or the fallback is chosen.
3. The commit-reveal timing rules are fixed.

---

## PHASE 2: GAME SPEC (MVP; adjust from research)

### World
- **5 islands:** Bitcoin Isle, Solana Reef, Base Harbor, Tron Bay, NEAR Capital.
- **Routes:** a fixed graph with distances measured in blocks. Testnet demo scale is 20–90 seconds per route.
- **3 goods:** Hashpower, Liquidity, Blockspace. Each island produces one cheaply and demands another.
- **Currency:** CRED, a soft currency. Players get a season starter grant. It is **not** redeemable for real money, so the game stays a game.

### Ships (NEP-245 IDs)
| Ship | Cargo | Speed | Defence | Upkeep per epoch |
|---|---|---|---|---|
| Sloop | 100 | fast | 1 | 2 CRED |
| Galleon | 400 | slow | 3 | 6 CRED |

### Ports (NEP-171)
- Each island has 1–3 port slots. Ports are bought from the contract in a one-time auction, or bought from other players.
- A port owner:
  - sets the market fee (0–10%);
  - collects fees into the port's treasury;
  - pays maintenance each epoch. If unpaid, the port decays to "abandoned" and its fees are burned.
- Transferring the NFT transfers the port's treasury and settings.

### Markets
- Each port has a constant-product market per good against CRED.
- NPC demand contracts are deterministic: each island buys its demanded good at a reference price that drifts toward the market price. This is the faucet, and it is capped per epoch.

### Turn and loop actions
- **`buy(port, good, cred_in, min_out)` / `sell(port, good, amount, min_cred)`:** trade at a port's market.
- **`depart(ship, cargo, dest_commit = sha256(dest ‖ route ‖ salt))`:** the ship leaves; its destination is hidden.
- **`commit_ambush(route_id, window_commit, stake)`:** a raider commits a hidden route and arrival window. `reveal_ambush(...)` must be called inside the reveal window.
- **`hire_escort(ship, escort_offer_id)`:** escorts are other players' ships offering defence for a CRED price, posted with `offer_escort`.
- **`arrive(ship, dest, route, salt)`:** callable after the route's arrival block plus the ambush-reveal window closes.
  - The contract verifies the destination commit.
  - It resolves any revealed ambush on that route and window: if raider power is greater than defence (ship + escorts), the raider takes X% of the cargo and the convoy loses it.
  - Cargo is delivered.
- **`tick_epoch()`:** callable by anyone. Charges upkeep and maintenance, applies spoilage (Liquidity −2% per epoch, for example), rolls a storm via `random_seed` (one route's travel time doubles), and refreshes NPC demand.
- **Season:** at the end, the CRED net-worth leaderboard is frozen. Ships and ports persist to the next season, and the map reshuffles demand.

### Invisible chain (the track bonus)
- Social or passkey-capable login via near-connect wallets.
- A game-only function-call key, so no popups during play.
- Gas covered by the key's allowance. Optional: a meta-transaction relayer.

### Optional cross-chain entry (mainnet, labelled)
- Buy a cosmetic "Season Pass" with USDC from Solana or Base via a 1Click quote and deposit address.
- After the payout settles, the owner calls `grant_pass(account)`.
- Show one real, tiny transaction only after the human approves.

### Invariants (each must have a test)
1. Total cargo equals goods in ships + port inventories + player holdings, and is conserved except for explicit sinks (spoilage, burns) and faucets (NPC buys, grants). Each change is logged in events.
2. A destination reveal that doesn't match its commit is rejected. A ship can't act while in transit.
3. An ambush resolves only if it was committed before the convoy departed **and** revealed inside its window.
4. Port fees go only to the current owner's port treasury. An NFT transfer moves the treasury atomically.
5. The game-only key cannot call any method outside the allowed list, and cannot transfer NEAR. Prove this with a test transaction that fails.
6. Each epoch, the NPC faucet stays under its cap.

---

## PHASE 3: ARCHITECTURE
```
frontier/
├─ contracts/world/       # single contract: islands, routes, markets, ships (NEP-245), ports (NEP-171), epochs
│  └─ src/ lib.rs world.rs market.rs ships.rs ports.rs ambush.rs epoch.rs mt.rs nft.rs events.rs errors.rs
├─ sim/economy.ts          # tuning sim (labelled SIMULATED)
├─ apps/game/              # Next.js 16 + PixiJS (or SVG) map, near-connect login, session key
├─ scripts/                # setup-testnet.sh, deploy.sh, seed-world.ts, bots-demo.ts (scripted players for the demo video, clearly scripted, not AI)
└─ (docs, research, execution, verification, submission, results)
```

### Front end (Next.js 16)
- **Map screen:** the islands, animated convoy dots (your own ships visible; others shown as "?" until arrival), storm overlay.
- **Port panel:** prices, your holdings, buy/sell, the owner's fee, and a "Buy this port" offer.
- **Fleet panel:** depart (with a hidden destination), hire an escort, a countdown to arrival.
- **Raid panel:** pick a route and window, stake, then reveal. A results feed shows "Your ambush on Tron Bay route caught a Galleon: +80 Hashpower".
- **Economy dashboard:** CRED supply, faucets vs sinks per epoch, price chart per good, top ports by fees.
- **Onboarding:** a 30-second tutorial convoy.

Style: a crypto-native, sleek nautical theme. Avoid generic AI dashboards. Readable on mobile.

### Events (NEP-297, standard `frontier`)
`ship_built`, `trade`, `departed`, `ambush_committed`, `ambush_revealed`, `arrived{raided, loss}`, `escort_hired`, `port_transferred`, `fee_set`, `epoch{supply, faucet, sinks, storm_route}`.

---

## PHASE 4: TESTS AND CI
- **Unit tests:** markets (math, fees, slippage), commit verification, ambush timing edge cases (committed after departure → ignored; revealed late → ignored), escort defence, epoch sinks, storm, NFT transfer moving the treasury, every error code.
- **Property tests (1,000 cases):** random sequences of trades, departures, ambushes, epochs and port transfers. Check invariants 1, 4 and 6 after every step.
- **Sandbox integration:**
  - a full 3-player round on 2 routes with 1 ambush and 1 escort;
  - a function-call key that tries `ft_transfer` or another forbidden method and fails;
  - a port sold mid-season with its treasury moving with it.
- **CI:** the same pattern as COMMON-RULES (Rust and TS jobs). Add a sim smoke run.
- **Testnet evidence:** `pnpm demo:round` plays a scripted round with 4 testnet accounts (scripted, not AI) and writes `results/round-<ts>.json` with tx links.

## PHASE 5: DAY PLAN
| Day | Work | Exit check |
|---|---|---|
| 8 Nov | Research R1–R4, economy sim, Gate R | Bounded supply shown |
| 9 Nov | World state, routes, markets, CRED, ships (NEP-245), unit tests | Market tests green |
| 10 Nov | Depart/arrive commit-reveal, ambush, escort, epochs, storms | Ambush edge tests green |
| 11 Nov | Ports (NEP-171) with treasury, proptests, sandbox round, testnet deploy | Invariants hold |
| 12 Nov | Game front end: map, panels, session key, dashboard | Playable on testnet |
| 13 Nov | Polish the loop; scripted demo round; README; fresh-clone test; video | Done-checklist ✓ |
| 14 Nov | Buffer, optional Intents pass, X post (human), submission JSON (human) | Submitted |

**Cut order:**
1. Intents pass
2. Sub-account ports
3. Escorts (keep ambush)
4. Storms
5. Second ship type

**Never cut:** trade → ship → ambush → sell loop, player-owned port fees, game-only key, economy dashboard, tests.

## PHASE 6: SUBMISSION PACKAGE

### README outline
1. **Title:** "FRONTIER: a fully on-chain trading empire across the chains".
2. **Pitch:** what it is, and why it's fun (the gamble).
3. **How to play in 60 seconds.**
4. **Why it's on-chain:**
   - unstoppable rules;
   - player-owned ports;
   - hidden moves;
   - an economy that evolves without patches, with dashboard evidence and economy-sim results labelled SIMULATED.
5. **Try it:** `pnpm i && pnpm build` → `pnpm test` → `pnpm demo:round` (see ambush + port fees) → open `<url>` and play.
6. **NEAR features used:** function-call access keys as session keys, NEP-245, NEP-171, events, `random_seed`, 600 ms blocks; optionally NEAR Intents.
7. **Limits:** CRED is not redeemable; randomness is validator-influenced but fine for storms; testnet only.
8. **Built with / AI disclosure.**
9. **Related projects (Q-015):** the owner's invoice-clearing project.
10. **License:** MIT.

### Demo video script (≈2 min)
1. **(0:00)** "FRONTIER is a trading empire that lives entirely on NEAR. No studio sets prices, and nobody can patch the economy."
2. **(0:12)** Log in. "One approval. After this, the game holds a key that can only play, never spend your money."
3. **(0:25)** Buy Hashpower cheap on Bitcoin Isle and depart. "My destination is sealed; nobody knows where I'm sailing."
4. **(0:45)** Cut to the rival: they commit an ambush on the Tron Bay route.
5. **(1:00)** Arrive safely on the escorted route. Sell at Base Harbor for profit. The rival's ambush catches someone else's greedy fast convoy.
6. **(1:20)** A port owner raises their fee to 9%. The dashboard shows traders re-routing to the competing port.
7. **(1:40)** The economy dashboard: sinks vs faucets balanced across epochs. "The economy evolves with players, not patches."
8. **(1:55)** "Built at NEAR HACKATHON. Play it, or read the 5-minute reproduction in the repo."

### X post
"Built at #NEARHackathon: FRONTIER, a fully on-chain trading empire across the chains. Own ports, set fees, hide your convoys, ambush rivals. One login, then no wallet popups. Play: <url> Repo: <link> @NEARProtocol"

### Submission
- **Tracks:** `["games","nfts"]`.
- Print the JSON and wait for the human's yes.
