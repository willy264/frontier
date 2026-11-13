# Gaming: PRD additions

Add these sections to `core/templates/PRD.md` after section 13.

## A. Player onboarding (no wallet-first)

Wallet-first onboarding is the top web3 UX mistake. [3P: Phenomenon Studio] The first session must be playable without a wallet, gas or seed phrase.

| Step | What the player does | Chain involvement | Fallback |
|---|---|---|---|
| 1 | Lands, watches trailer or plays demo | none | poster frame under reduced motion |
| 2 | Signs up with email or social | none (embedded wallet created silently, if web3) | |
| 3 | Plays first session | none, or sponsored (paymaster) | |
| 4 | Earns or buys first item | sponsored or batched | explain what happens before any signature |
| 5 | Exports / connects own wallet (optional) | yes | |

## B. Transaction prompts (web3 only)

| Prompt | Must say | Example structure [SYN] |
|---|---|---|
| Approve | What contract, what token, what limit, that this is permission not payment | "Allow <game> to use up to 50 <token> for crafting. This doesn't send any tokens yet." |
| Transfer | What leaves, to whom, irreversible | "Send 50 <token> to <name>. This can't be undone." |
| Gas | Who pays | "Free. We cover the network fee." (only if sponsored) |

No unlimited approvals by default. [3P]

## C. Store, age and disclosure

| Item | Rule | Source |
|---|---|---|
| Age gate | Neutral date-of-birth entry; no "Are you 18?" toggle; never pre-filled | [3P: gaming-patterns] |
| Rating | Show regional rating (ESRB / PEGI) | [3P] |
| Purchases | Disclose in-game purchases and random items before download/purchase | [3P] |

## D. Data surfaces

| Surface | Data source | Refresh | Empty / loading / stale states |
|---|---|---|---|
| Leaderboard | | | |
| Player stats | | | |
| Season timer | | | |
| Patch notes | | | |

## E. Accessibility settings (in-game web UI and companion app)

| Setting | Default |
|---|---|
| Reduced motion | Follows OS |
| Shake / parallax / blur | 0–100% sliders [3P] |
| HUD density | Adjustable [3P] |
| Subtitles / captions for trailers | On |
| Colourblind-safe indicators | Shape + colour |

## F. Media budget

| Asset | Budget | Fallback |
|---|---|---|
| Hero video | size and codec stated here | poster image; pauses under reduced motion |
| Key art | AVIF/WebP, explicit dimensions | |
| 3D / WebGL | measured on a named low-end device | static render |
