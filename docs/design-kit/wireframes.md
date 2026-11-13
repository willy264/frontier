# Wireframes: FRONTIER

These wireframes describe the existing `/` game route. They do not add pages or
features.

## Page: `/`

**Showpiece:** the live archipelago map. It is a persistent interactive product
surface, not an entrance animation. The only authored motion on the page is the
event toast, using CSS transform and opacity with a reduced-motion fallback.

## Section order

| # | Surface | Concept | Alignment | Primary action | Motion |
|---|---|---|---|---|---|
| 1 | Masthead | FRONTIER identity, game views, testnet wallet state | Left with right actions | Connect wallet when disconnected | Static |
| 2 | Captain bar | Account, CRED, storage, and network context | Horizontal; wraps on small screens | None | Static |
| 3 | World heading | Names the archipelago, selected context, and live block | Left | None | Static |
| 4 | Map | Five ports, one-way routes, fleet positions, and map controls | Full field | Select port, route, or ship | Static showpiece |
| 5 | Captain actions | The next valid market, fleet, or ambush action | Beside map on desktop; after map on mobile | Contextual order action | Static |
| 6 | Captain's log | Confirmed outcomes and explorer receipts | Rows | View receipt | Static |
| 7 | Chain details | Honest mechanism and hidden-order backup | Disclosure | Back up or restore orders | Static |
| 8 | Footer | Existing help, demo, and guide links | Split | None | Static |
| 9 | Event toast | Pending, success, or failure feedback | Fixed edge with safe margin | None | CSS transform and opacity |

## Mobile: 320-767px

```text
+--------------------------------+
| FRONTIER          [wallet]     |
| [World] [Economy] [How to]     |
+--------------------------------+
| NEAR TESTNET                    |
| captain / balance / cargo      |
+--------------------------------+
| THE ARCHIPELAGO   Block ...    |
| Trade the high seas            |
| Selected port or route context |
+--------------------------------+
| [pan] [fit map] [pan]          |
| +----------------------------+ |
| |                            | |
| |  interactive sea chart     | |
| |  ports / routes / ships    | |
| |                            | |
| +----------------------------+ |
| map caption / fleet status     |
+--------------------------------+
| CAPTAIN'S ORDERS               |
| [Market] [Fleet] [Ambush]      |
| context, fields, quote, status |
| [primary order action]         |
| secondary / backup action      |
+--------------------------------+
| CAPTAIN'S LOG                  |
| time  confirmed event  receipt |
+--------------------------------+
| How it works on-chain          |
+--------------------------------+
| footer links                   |
+--------------------------------+
| event toast, above safe edge   |
+--------------------------------+
```

Mobile rules:

- The map uses a stable aspect ratio and horizontal map pan only when the
  detailed chart cannot fit. Visible controls provide a single-pointer
  alternative.
- The action tool follows the map in reading order. Selecting a map object may
  move focus or scroll directly to its context, without smooth scrolling.
- Action tabs remain one row only while their labels fit. At 320px, equal
  tracks and short nouns preserve the layout.
- Wallet and navigation controls keep at least a 44px touch area where space
  permits and never fall below 24px.
- The toast stays clear of the wallet, action controls, and browser safe area.

## Tablet: 768-1023px

```text
+------------------------------------------------------+
| FRONTIER   World  Economy  How to      [wallet]      |
+------------------------------------------------------+
| network   captain   balance   storage                 |
+------------------------------------------------------+
| heading and selected context               block     |
+------------------------------------------------------+
| +--------------------------------------------------+ |
| |             interactive sea chart               | |
| +--------------------------------------------------+ |
| caption / fleet state                                |
+------------------------------------------------------+
| Captain actions, two-column form where useful        |
+------------------------------------------------------+
| Captain's log                                        |
+------------------------------------------------------+
```

The map remains above the action tool until the viewport has room for both at
usable widths.

## Desktop: 1024px and above

```text
+--------------------------------------------------------------------------+
| FRONTIER       World  Economy  How to                    [wallet]         |
+--------------------------------------------------------------------------+
| NEAR TESTNET   captain                 CRED                 cargo          |
+--------------------------------------------------------------------------+
| THE ARCHIPELAGO / Trade the high seas              context       block   |
+----------------------------------------------------+---------------------+
|                                                    | CAPTAIN'S ORDERS    |
|                                                    | [tabs]              |
|             interactive sea chart                  |                     |
|             ports / routes / ships                 | selected context    |
|                                                    | labels and fields   |
|                                                    | quote / warning     |
|                                                    | [primary action]    |
+----------------------------------------------------+---------------------+
| map caption / fleet state                          | secondary action    |
+----------------------------------------------------+---------------------+
| CAPTAIN'S LOG: confirmed event rows and receipts                         |
+--------------------------------------------------------------------------+
| on-chain details and hidden-order backup                                 |
+--------------------------------------------------------------------------+
| footer                                                                   |
+--------------------------------------------------------------------------+
```

Desktop rules:

- The map receives the larger grid track. The action panel has a stable width
  that fits labels and values without resizing the map.
- Captain's log is a hairline row surface rather than another floating card.
- The first viewport must show the FRONTIER identity, testnet context, map,
  and the beginning of captain actions.
- At wide widths the container caps growth; map controls and labels do not
  scale with viewport width.

## Economy view

```text
+--------------------------------------------------------------------------+
| shared masthead and captain bar                                          |
+--------------------------------------------------------------------------+
| ECONOMY                                                                  |
| Actual world totals. Epoch <contract value>.                             |
+--------------------------------------------------------------------------+
| CRED supply | NPC purchases | recorded sinks | spoilage | epoch          |
+--------------------------------------------------------------------------+
| RECORDED EPOCHS                                                          |
| browser-session snapshot table, or one-snapshot empty copy               |
+--------------------------------------------------------------------------+
```

Economy values are contract-derived. The page does not draw a trend from one
snapshot and does not imply a CRED-only meaning for the mixed sink counter.

## Dialog and toast

The How to play dialog uses the existing six-step sequence because it is a real
ordered flow. It states that ambushes are optional and the tutorial does not
move rival accounts.

The event toast appears only in response to a real app event. Default motion:
150-240ms transform and opacity. Reduced motion: opacity at 150ms or less, with
no transform. No other section reveal, map loop, parallax, or hover lift is
part of this redesign.

## Responsive checks

| Width | Check |
|---:|---|
| 320 | No horizontal page scroll; map controls fit; action labels wrap safely |
| 375 | Dialog, map, and order controls stay within viewport |
| 450 | Captain status wraps without truncating critical state |
| 768 | Map remains above action panel unless both tracks are usable |
| 1024 | Map and action panel form the desktop split |
| 1280 | Map remains visually dominant; form measures stay bounded |
| 1440 | Full-page critique reference width |
| 1536 | Container cap begins to protect line length |
| 1920 | No stretched controls, text, or map labels |
