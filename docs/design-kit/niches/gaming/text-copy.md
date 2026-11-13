# Gaming: copy overrides

Applies on top of `core/text-copy.md`.

## 1. Register

Terse and imperative. Lore flavour in headlines is fine; system copy (errors, purchases, wallets, settings) is plain language. [3P: Valorant] [SYN]

| Slot | Rule | Example |
|---|---|---|
| Primary CTA | Uppercase, verb-first, ≤3 words | "PLAY FREE" [3P: Valorant] |
| Secondary CTA | Uppercase, ≤3 words | "WATCH TRAILER" [SYN] |
| Headlines | Short, declarative, from the game's world | |
| Eyebrows / labels | Small caps, tracked | "SEASON 4", "AGENT ROLE" [SYN] |
| Microcopy | No "friendly" filler in competitive UI | [3P: Valorant] |

Uppercase is set by CSS (`text-transform`), not typed into the content file, so screen readers do not spell words out.

## 2. Don't

| Don't | Instead |
|---|---|
| "Unleash your inner champion in an epic adventure" | Name the game type and the hook: "5v5 tactical shooter. One life per round." (pattern; use the real game's facts) |
| "Connect wallet to start" | "PLAY FREE" |
| "Join the revolution" / crypto jargon at decision points | Plain description of what the player gets |
| Exclamation marks on every line | One, if any |

## 3. Web3 and purchase copy

| Situation | Copy pattern [SYN from 3P: Phenomenon] |
|---|---|
| Approve | "Allow <game> to use up to <n> <token> for <purpose>. This doesn't send anything yet." |
| Transfer | "Send <n> <token> to <recipient>. This can't be undone." |
| Gas sponsored | "Free. We cover the network fee." |
| Failed transaction | "Transaction didn't go through. Nothing left your wallet. Try again." (only if true) |
| Random items | "Contains random items. See drop rates." with a link |

## 4. System microcopy

| Situation | Example [SYN] |
|---|---|
| Server down | "Servers are offline for maintenance until 14:00 UTC. Check status." (time from ops) |
| Matchmaking | "Finding a match. Average wait: 1 min." (from live data, or omit the number) |
| Error | "Couldn't load your loadout. Retry." |
| Empty leaderboard | "No ranked matches yet this season. Play ranked to appear here." |
