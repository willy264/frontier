# FRONTIER Economy and Security Decisions

## Faucets

- One capped season starter grant per player.
- Capped deterministic NPC demand per island per epoch.

## Sinks

- Ship upkeep.
- Port maintenance.
- Liquidity spoilage per epoch.
- Cargo lost in successful raids.
- A minimum market fee that is burned rather than returned to the player.

## Commit-reveal timing

1. A convoy commits its destination before departure and receives a route arrival block.
2. A raider commits its route and arrival window before the convoy departure block.
3. The ambush reveal window opens after departure and closes before arrival claims open.
4. `arrive` rejects a mismatched destination salt, and ignores late or post-departure-invalid raid commitments.

## Anti-abuse controls

- Self-raiding: require a stake, cap raid attempts per account per epoch, and do not reward raids against the same owner repeatedly in a short window.
- Wash trading: charge fees on both sides, cap NPC demand, and make fees visible in the economy panel.
- Commit spam: require a minimum stake, charge a commit fee, and cap active commitments per account.

## Economy target

The simulation uses 100 players over 200 epochs. It should keep total CRED inside a bounded band by making NPC buying and starter grants finite while upkeep, maintenance, spoilage, and raid losses scale with active inventory.

