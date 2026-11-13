# Gaming niche pack: FRONTIER

## Direction

Make the contract state feel like the game world. Prefer a readable command surface, map geography, status feeds, and meaningful risk indicators over decorative game chrome.

## Visual decisions

- Use the existing sea-green paper, ink, and restrained island accents.
- Keep the map as the largest visual surface.
- Use mono labels for contract state, block windows, balances, and event output.
- Reserve red for danger or rejected actions, green for confirmed live state, and island colors for geography.
- Avoid fantasy ornament that implies systems the contract does not implement.

## Interaction decisions

- A judge should understand the next action without reading a long manual.
- Every hidden-information action must expose its local backup and reveal path.
- State is more important than animation. Markers and status labels must come from contract reads.
- Practice mode must say `Guided tutorial` unless it is actually moving rival accounts.

## Motion level

Low. Use short opacity and transform transitions for state changes only. Disable non-essential movement under reduced motion.
