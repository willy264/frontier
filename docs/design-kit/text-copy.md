# Text and copy: FRONTIER

Status: approved direction  
Locale: international English

This file is the source for redesign copy. Dynamic values in angle brackets
must come from current app or contract state. No string may imply unverified
traffic, profit, mainnet use, or token value.

## 1. Voice

Game actions are terse and nautical. Wallet, transaction, secret, and error
copy is plain and literal. Use captain, port, route, convoy, cargo, market,
ambush, escort, testnet, and contract state where they identify a real object.

The core humanizer bans apply. Claims about safety, production status, mainnet,
AI rivals, or cross-chain settlement require current evidence and an approved
scope change. UI copy uses no em dash, no decorative arrow, no filler
exclamation, and no fake urgency.

Uppercase labels are produced with CSS. Source strings remain sentence case.

## 2. Global shell

| Key | Copy |
|---|---|
| Product | `Frontier` |
| Product descriptor | `Trading on the high seas` |
| Network | `NEAR testnet` |
| Nav world | `World` |
| Nav economy | `Economy` |
| Nav help | `How to play` |
| Connect | `Connect wallet` |
| Disconnect | `Disconnect` |
| Skip link | `Skip to captain actions` |
| Visitor captain | `Uncharted fortunes await` |
| Visitor balance | `Explore before connecting` |
| Missing player | `Captain not registered` |
| Balance loading | `Checking balance...` |
| Cargo summary | `<amount> goods in storage` |

Metadata:

| Key | Copy |
|---|---|
| Title | `FRONTIER | On-chain trading empire` |
| Description | `A persistent strategy and trading game on NEAR.` |

## 3. World view

| Key | Copy |
|---|---|
| Eyebrow | `The archipelago` |
| H1 | `Trade the high seas.` |
| Lead | `Choose a port. Find your edge.` |
| Route hint | `Select a sea route to plan an ambush.` |
| Height | `Block <height>` |
| Height loading | `Reading the tide...` |
| Height error | `Testnet unavailable` |
| Map route note | `One-way trade routes` |
| Fleet count | `<count> ships in your fleet` |
| Fleet loading | `Reading fleet positions...` |
| Fleet interrupted | `Position updates interrupted` |
| Open fleet | `Open fleet` |
| Orders label | `Captain's orders` |
| Next action | `Next step` |

Map controls and accessible names:

| Key | Copy |
|---|---|
| Map label | `Archipelago navigation map` |
| Scroll region | `Scrollable sea chart` |
| Routes label | `Trade routes between island ports` |
| Pan left | `Pan map left` |
| Pan right | `Pan map right` |
| Fit overview | `Fit map overview` |
| Detailed map | `Show detailed map` |
| Port | `Select <port>, trading <good>` |
| Route | `<origin> to <destination>, <blocks> travel blocks` |
| Ship | `Ship <id>, <status>, <progress>% progress` |

Goods always use these names and colour assignments:

| Good | Colour |
|---|---|
| Hashpower | Amber `#e9b75e` |
| Liquidity | Cyan `#80d1da` |
| Blockspace | Blue `#a8bffa` |

## 4. Read-only entry and wallet

| Key | Copy |
|---|---|
| Eyebrow | `Your first voyage` |
| Heading | `Make your own fortune.` |
| Intro | `Buy cargo, sail between player-owned ports, and watch for raiders.` |
| Wallet limit | `Explore the map now. To place orders, connect a funded NEAR testnet wallet. Test tokens have no monetary value.` |
| Connect | `Connect wallet` |
| Connecting | `Opening wallet...` |
| Create wallet | `Create a testnet wallet` |
| Scope | `Your wallet approves game controls for this contract only, with a limited network-fee allowance.` |
| Enable heading | `Enable game controls` |
| Enable detail | `Approve a game-only key in your wallet. It can call FRONTIER with a limited allowance for testnet network fees.` |
| Enable action | `Enable controls` |
| Wallet tools loading | `Wallet tools are loading. Try again in a moment.` |
| Wallet tools error | `Wallet tools could not load. Reload the page to retry.` |
| Connection stopped | `Wallet connection was not completed. Try connecting again.` |
| Connected | `Wallet connected. Your captain is ready to join.` |

The interface must not request a wallet while a visitor explores read-only
state. Selecting a real order action may present the wallet requirement.

## 5. Registration and next-step labels

| State | Copy |
|---|---|
| No wallet | `Meet your captain` |
| No captain | `Join the archipelago` |
| No cargo | `Buy your first cargo` |
| Cargo, no ship | `Build your first ship` |
| Ship at sea | `Bring your convoy home` |
| Ready | `Load your next voyage` |
| Registration eyebrow | `Welcome aboard` |
| Registration heading | `Claim your captain.` |
| Registration detail | `Register to receive starter CRED for cargo and ships. All play happens on testnet.` |
| Registration action | `Register captain` |
| Registration success | `Captain registered. Buy cargo at a port to begin.` |

## 6. Market

| Key | Copy |
|---|---|
| Eyebrow | `Port market` |
| Owner | `Owned by <account>` |
| Buy tab | `Buy cargo` |
| Sell tab | `Sell cargo` |
| Good label | `Good` |
| Buy amount | `Spend CRED` |
| Sell amount | `Sell <good>` |
| Use holdings | `Use available cargo (<amount>)` |
| Quote | `You receive` |
| Quote detail | `Includes port fees. Allow up to 2% price movement. Minimum received: <amount>. Trades cost at least 30 CRED in fees.` |
| Buy action | `Buy cargo` |
| Sell action | `Sell cargo` |
| Port disclosure | `Port ownership` |
| Fee label | `Trading fee (%)` |
| Set fee | `Set port fee` |
| Unavailable | `This port is unavailable. Select another island or retry.` |
| Not for sale | `This port is not for sale.` |
| Fee success | `Port fee updated.` |
| Purchase success | `Port purchased, including its treasury.` |

Numeric limits and quotes must come from current code or contract state.

## 7. Fleet, voyage, and hidden orders

| Key | Copy |
|---|---|
| Eyebrow | `Your fleet` |
| Fleet heading | `Make sail, captain.` |
| Empty heading | `Your cargo needs a ship.` |
| Ship field | `Your ship` |
| Defence | `Defence <value>` |
| No escort | `No hired escort` |
| Origin field | `Launch from` |
| Destination field | `Sail to` |
| Cargo legend | `Load your cargo` |
| Load all | `Load all available cargo` |
| Sail action | `Seal and sail` |
| Privacy | `Your destination stays hidden until arrival. Keep a backup of your hidden orders.` |
| Voyage heading | `Bound for <port>` |
| Hidden destination | `Your destination is hidden` |
| Voyage countdown | `<blocks> blocks to harbour` |
| Arrival ready | `Your convoy is ready to arrive.` |
| Arrival action | `Arrive at port` |
| Backup | `Back up hidden orders` |
| Restore | `Restore hidden orders` |
| Build disclosure | `Build another ship` |
| No onward route | `No onward routes leave this port in the current map. Sell cargo here or build another ship at an origin port.` |
| Open market | `Open port market` |

Hidden-order errors:

| State | Copy |
|---|---|
| Missing local order | `Restore your hidden orders below to recover the destination and arrival control.` |
| Departure storage blocked | `Your hidden orders could not be saved. Allow browser storage before sailing.` |
| Ambush storage blocked | `Your hidden orders could not be saved. Allow browser storage before setting an ambush.` |
| Restore success | `Hidden orders restored for this captain.` |
| Restore mismatch | `This backup does not match your captain and world, or could not be read.` |
| Confirmation uncertain | `Confirmation uncertain. Check wallet activity before retrying.` |

## 8. Ambush and escort

| Key | Copy |
|---|---|
| Ambush eyebrow | `Route ambush` |
| Ambush heading | `Wait in the narrows.` |
| Ambush detail | `Your idle ships supply attack power. Set aside 10 CRED, then spring the ambush before its window closes. Unopened orders lose the stake.` |
| Set action | `Set ambush` |
| Reveal action | `Spring ambush` |
| Active | `Ambush sprung. Watching this route.` |
| Countdown | `<blocks> blocks left to spring the ambush` |
| Closed | `Window closed. Unopened stakes are lost when the epoch advances.` |
| Escort disclosure | `Hire or offer an escort` |
| Offer field | `Escort offer number` |
| Check offer | `Check escort offer` |
| Hire | `Hire escort` |
| Offer unavailable | `This offer is unavailable. Ask another captain for an active offer number.` |
| Lookup loading | `Looking up the escort offer...` |
| Lookup error | `Can't reach testnet. Retry the escort lookup.` |

An ambush result must come from a confirmed event. The UI must not infer a
blocked raid, missing raid, cargo loss, or rival convoy.

## 9. Economy and log

| Key | Copy |
|---|---|
| Economy H1 | `Economy` |
| Intro | `Actual world totals. Epoch <epoch>.` |
| Supply | `CRED supply` |
| Faucet | `NPC purchases this epoch` |
| Sinks | `Recorded sinks` |
| Spoilage | `Goods spoiled` |
| Epoch | `Epoch` |
| Explanation | `NPC purchases credit sellers, capped at 160 CRED per epoch. The contract's sink counter combines CRED costs and burned goods; it is not a CRED-only total. Spoilage is recorded when players next act.` |
| History heading | `Recorded epochs` |
| History empty | `No epoch history yet. Keep this page open across an epoch change to record a comparison. No trend is drawn from a single snapshot.` |
| Log heading | `Captain's log` |
| Log label | `Confirmed orders` |
| Log empty | `Your trade and voyage results will appear here. Choose an island to inspect its market.` |
| Receipt | `View receipt` |

The 160 CRED figure is retained from the existing contract-facing copy. It must
be rechecked against current contract evidence before release.

## 10. Transaction and connection states

| State | Copy |
|---|---|
| Pending label | `Order pending` |
| Update label | `Captain's update` |
| Pending action | `Confirming order...` |
| Pending transaction | `Sending your order. Waiting for testnet confirmation...` |
| RPC alert | `Can't reach testnet. Retrying... Saved information may be out of date.` |
| Retry | `Retry connection` |
| Slippage | `The market price moved. Review the new quote and try again.` |
| CRED funds | `You need more CRED for this order.` |
| Cargo funds | `Your available cargo changed. Reload the port and adjust the load.` |
| Early arrival | `Your convoy is still sailing. Wait for the countdown.` |
| Late reveal | `The ambush window has closed.` |
| Existing captain | `This captain is already registered. Refresh your fleet.` |
| Escort locked | `This ship is escorting a convoy. Wait for its arrival.` |
| Unknown failure | `The order was not confirmed. Refresh before retrying; check your wallet activity if it persists.` |

Success copy uses confirmed values:

- `Bought <amount> <good>.`
- `Sold cargo for <amount> CRED.`
- `Your convoy set sail from <port>. Back up your hidden orders.`
- `Your convoy reached <port>.`
- `Escort hired. Your convoy is protected until arrival.`

## 11. How to play

| Key | Copy |
|---|---|
| Eyebrow | `Welcome to Frontier` |
| Heading | `Your first trading voyage` |
| Step 1 | `Meet your captain. Connect a testnet wallet and register.` |
| Step 2 | `Buy cargo. Select an island and spend CRED at its market.` |
| Step 3 | `Build a ship. Start with a sloop for 100 CRED.` |
| Step 4 | `Load and sail. Choose an onward route and back up your hidden orders.` |
| Step 5 | `Reach the harbour. Wait for the countdown, then arrive. Escorts can protect cargo.` |
| Step 6 | `Sell your cargo. Review the live quote, sell, and plan your next voyage.` |
| Limit | `Ambushes are optional. Select a sea route to set one. This tutorial does not move rival accounts.` |
| Action | `Explore the map` |

## 12. Chain details and footer

| Key | Copy |
|---|---|
| Disclosure | `How it works on-chain` |
| Mechanism | `Orders use a scoped NEAR function-call key. Hidden destinations and ambushes use commit-reveal. Backups contain secrets: keep them private. Disconnecting clears this browser session; revoke old keys in your wallet settings.` |
| Result limit | `The current arrival event reports cargo losses, but does not distinguish a blocked raid from a route with no raid. Rival destinations are hidden; this map does not invent rival traffic.` |
| Footer label | `Testnet strategy game` |
| Demo | `Watch demo` |
| Guide | `Read the guide` |

## 13. Copy QA

- Every dynamic number comes from contract state or a current implementation
  constant with a source.
- Wallet copy distinguishes exploration from real testnet orders.
- Pending copy never claims success.
- Arrival and ambush copy does not infer a result absent from the event.
- CRED is never described as redeemable or valuable.
- Labels use sentence case in source and CSS for visual uppercase.
- Errors say what happened and what to do next.
- Empty states say what will appear and identify the next action.
- No added feature, partner, metric, player, rival, or production claim appears.

## Preview QA copy additions, 14 November 2026

- Map pan hint: Swipe or use arrows to see all ports.
- Map refresh: Refresh world
- Map error: Can’t reach testnet. Retrying…
- Recovery action: Retry connection
- Guest primary heading: Make your own fortune.
- Guest instruction: Buy cargo, sail between player-owned ports and watch for raiders.
- Read-only top-bar text: Explore before connecting
