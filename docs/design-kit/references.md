# References: FRONTIER

References provide a principle or concrete layout lesson. They are not asset,
copy, palette, or code sources.

## Characteristic source

The characteristic object is a working nautical chart of island ports, trade
routes, and convoys. The strongest reference is the product itself: current
contract state represented as a chart that can be operated.

## Project references

| Reference | Why it is here | Take | Do not take |
|---|---|---|---|
| Current FRONTIER game in `apps/game/app` | It defines the real flow and available states. | Map-first world view, adjacent captain actions, read-only exploration, contract receipts, honest empty and error states. | Current light palette, remote font imports, legacy decorative shadows, or any stale mock surface. |
| `docs/FRONTIER-BRIEF.md` | It defines the game world and verified MVP boundary. | Five named islands, three goods, the trade and hidden-route loop, scoped game controls. | Optional or deferred systems presented as live. |
| `docs/design/reference-sheet.md` | It records earlier FRONTIER design decisions. | Contract state as the visible world, short actions, map as product surface. | Copied brand assets, unsupported claims, or an effects-led hero. |
| Real nautical charts and port ledgers | They provide subject-specific information hierarchy. | Deep sea field, route bearings, harbour marks, coordinates, compact ledger rows, signal amber. | Aged-paper imitation, ornamental compass art, pirate motifs, or illegible cartographic detail. |
| Copied gaming profile in `niches/gaming/` | It defines dark gaming surface structure and accessibility constraints. | Three dark surface steps, bone text, hairlines, stable HUD data, terse actions. | Valorant's palette, video hero, skewed marketing buttons, zero-radius mandate, or cinematic motion. |
| Linear design principles referenced by the kit | It is useful for operational hierarchy. | Receding chrome, tone shifts, and structure that supports scanning. | Exact greys, generic SaaS layout, or keyboard patterns that conflict with the game map. |

## Type sources

| Source | Use | Licence decision |
|---|---|---|
| Google Fonts Barlow Condensed family repository | Display headings at weights 600 and 700 | SIL OFL 1.1; WOFF2 and licence stored locally |
| Google Fonts DM Sans family repository | Body, forms, navigation, and system copy | SIL OFL 1.1; variable WOFF2 and licence stored locally |
| Clash Display | None | Excluded because public file redistribution is not confirmed for this project |

Font source URLs, retrieval date, file hashes, and licence filenames are in
`apps/game/app/fonts/README.md`.

## Palette source

The palette comes from the game's subject rather than another interface:

- `#091d29` is the deep sea canvas.
- `#102b3a` and `#183746` form chart and tool elevations.
- `#eee8d9` is chart-paper bone text.
- `#e9b75e` is signal amber and Hashpower.
- `#80d1da` is Liquidity.
- `#a8bffa` is Blockspace.
- `#ff9790` marks danger and failed or raid-risk states.

These colours must not be replaced with a reference site's values.

## Anti-references

| Pattern | Why it is wrong for FRONTIER |
|---|---|
| Web3 landing page with a centred slogan, token metrics, and connect CTA | It hides the game and creates unsupported financial framing. |
| Neon cyberpunk dashboard with glow, purple gradients, and glass panels | It weakens chart legibility and repeats a generic crypto style. |
| Full-screen cinematic video or 3D ocean | It delays the playable map and adds a performance and motion burden. |
| Repeated equal cards for every feature | It fragments one connected operational loop. |
| Animated convoy traffic that is not contract-derived | It fabricates player activity. |
| Pirate parchment, ropes, skulls, and treasure decoration | It turns a tactical trade interface into costume. |
| Clash Display copied from an unverified download | It creates a redistribution risk. |

## Asset provenance

No new photography, video, generated image, illustration, or 3D asset is
required. Existing product UI and CSS-drawn chart elements carry the visual
identity. Any later production image must include source, author, licence,
retrieval date, and edits before use.
