# FRONTIER gaming design system

## Tokens

The implementation source of truth is `apps/game/app/globals.css`.

| Role | Current token | Use |
|---|---|---|
| Ink | `--ink` | body text, primary controls, ship markers |
| Muted | `--muted` | metadata and helper copy |
| Paper | `--paper` | page background |
| Cream | `--cream` | framed tool surfaces |
| Line | `--line` | separators and borders |
| Sea | `#e9f3f0` | map and economy canvas |
| Danger | `--red` | ambush and failure actions |
| Live | `#4f9e7d` | confirmed live state |

## Type

- Display and controls: Space Grotesk.
- Contract labels and event output: DM Mono.
- Maximum two families plus one mono family.
- Do not introduce a third family for a single component.

## Shape and layout

- Existing cards use a restrained 7px radius. Keep new framed tools at 8px or less.
- Use the 4px spacing scale: 4, 8, 12, 16, 20, 24, 28, 32.
- The map is an unframed working surface inside the page layout, not a marketing hero.
- Do not place cards inside cards.

## State requirements

Every button and input needs hover, focus-visible, active, disabled, and pending treatment. Focus must remain visible. Touch targets should be 44px square or larger where possible, never below 24px.
