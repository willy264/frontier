# Gaming overrides: FRONTIER

## Color

Use the existing sea-green, paper, ink, and restrained island accents in `apps/game/app/globals.css`. The map surface carries the color. Red is danger, green is confirmed live state, and island colors are geography. Do not add purple gradients, neon glow, or arbitrary HUD colors.

## Type

Keep Space Grotesk for readable interface text and DM Mono for contract labels, block windows, and event output. Do not introduce a condensed display font to the operational game screen.

## Shape and layout

Use the existing restrained radius, thin borders, stable map dimensions, and 4px spacing rhythm. The map is the focal surface. Cards frame individual tools only; do not nest cards.

## Components

Required states include wallet, market, ship, ambush, escort, secret backup, result feed, read-only RPC mode, and transaction failure. Practice mode says `Guided tutorial` unless it actually moves scripted rivals.

## Motion

Low and functional. Animate only transform and opacity, keep markers state-derived, and disable non-essential movement under reduced motion.
