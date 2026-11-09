# FRONTIER Research: Player Experience

## Gate R status

- **VERIFIED:** The brief requires a 10-15 minute session plus asynchronous fleet movement.
- **INFERRED:** The first session must reach a trade decision quickly; a player should see a route, buy cargo, and depart within two minutes.
- **HYPOTHESIS:** The strongest demo moment is the same-route choice between a fast, vulnerable convoy and a slower escorted convoy.

## Genre findings

| Reference | Useful lesson for FRONTIER | Risk to avoid |
|---|---|---|
| Dark Forest | Hidden information creates tension when the reveal changes the value of a move. | Do not make every action a slow commit/reveal ceremony. |
| Loot Survivor | Short runs and persistent on-chain loot make blockchain state legible to players. | Avoid excessive wallet friction for ordinary turns. |
| Primodium / MUD-style games | Shared world state and player-owned resources create emergent strategy. | Keep the first loop narrow enough to understand without a wiki. |
| EVE Online | Player markets work when transport, scarcity, and risk interact. | A market without useful routes is only a spreadsheet. |
| Axie Infinity | Emissions without durable sinks produce runaway supply and weak retention. | CRED grants and NPC demand must be capped; upkeep, spoilage, and raid losses must remove value. |

## Product decision

The MVP is a trade -> sail -> ambush -> arrive -> sell loop. The player sees the strategic consequence of a fee, route, or escort choice within one short session. The frontend may use a scripted demo state, but every simulated or scripted result must be labelled in the UI and README.

