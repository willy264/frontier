# Brief: FRONTIER frontend redesign

Status: approved direction  
Last updated: 2026-11-13

## 1. One-line build statement

Build an operational testnet game interface, used by hackathon judges, strategy
players, and NEAR builders during a live game loop, to inspect the archipelago
and complete a trade, voyage, escort, ambush, and arrival with clear contract
feedback, using the existing Next.js app and plain CSS.

## 2. Subject

| Field | Answer |
|---|---|
| Product / organisation | FRONTIER |
| What it is | An on-chain trading and strategy game on NEAR testnet |
| What it does | Players inspect port markets, move cargo by ship, hire escorts, and commit or reveal route ambushes against contract state. |
| Primary job | Make one complete testnet game loop readable and operable. |
| Secondary job | Let visitors inspect the live world and economy before connecting a wallet. |
| Market / spelling | International English |
| Stage | Live testnet MVP |

## 3. Audience and moment

| Field | Answer |
|---|---|
| Primary user | A hackathon judge evaluating whether the game loop and chain use are real |
| What they know | Crypto wallets and strategy games; they may not know FRONTIER's rules |
| What they doubt | Whether the map is decorative, whether state is live, and what a wallet approval permits |
| Device and network | Laptop browser first; mobile browser supported; variable internet and testnet RPC quality |
| Moment of use | Exploring the map, deciding whether to connect, or completing a time-sensitive order |
| Decision | Explore read-only, connect a funded NEAR testnet wallet, or take the next game action |

## 4. Tone

| | Words |
|---|---|
| Tone | Nautical, tactical, legible, restrained, direct |
| Anti-tone | Casino-like, neon, cinematic |
| Register | Terse game language for actions; plain system language for wallets, errors, and transactions |

## 5. Niche profile and approved overrides

| Field | Answer |
|---|---|
| Chosen profile | Gaming |
| Why | The interface is a repeated-use strategy game surface with a map, live state, timed orders, and hidden information. |
| Accent strategy | Amber action accent plus a fixed semantic map for the three goods |
| Expression channels | Colour and type |

The user-approved settings below override the copied gaming profile:

| Gaming profile default | FRONTIER decision | Reason |
|---|---|---|
| Wallet-free first session | Exploration and contract reads need no wallet. Real testnet orders require a funded wallet and scoped game key. | This reflects the deployed MVP. No email, social login, embedded wallet, or sponsored gas is claimed. |
| Tailwind v4 and shadcn/ui | Keep native HTML controls and the existing plain CSS system. | This is an intentional frontend-only retention. A framework or component-library migration is outside the redesign scope. |
| Clash Display and Onest | Barlow Condensed 600/700 for display and DM Sans variable for body/UI. | Both selected families are OFL and self-hostable. Clash Display files are excluded from public redistribution. |
| Zero-radius gaming geometry | Restrained sharp-soft geometry, with framed tools at 8px or less. | Existing operational controls already use compact radii and need no shape-system rewrite. |
| One hot accent | Amber is the action accent and Hashpower colour. Liquidity and Blockspace keep distinct semantic colours. | Goods must remain distinguishable without suggesting extra brands or states. Labels and shapes accompany colour. |
| GSAP or Motion showpiece | CSS only. The live map is the showpiece. Only the event toast receives authored motion. | Contract state and stable interaction take priority over spectacle. |
| Video or character hero | None. | The map is the actual product surface in the first viewport. |
| Marketing section rhythm | Dense operational layout with stable map and action-panel dimensions. | This is a game tool, not a launch page. |

No feature may be added to satisfy a niche template. UI claims must match the
current contract, README, and testnet evidence.

## 6. Characteristic thing

| Field | Answer |
|---|---|
| Object / place | A navigable nautical chart of five island ports and their one-way trade routes |
| First viewport | The real interactive map, current block height, selected route or port, fleet markers, and adjacent captain actions |
| Accent source | Amber signal flags and cargo markings against a deep sea chart |

The map is a working control. It is not decorative key art and receives no
ambient animation.

## 7. Palette

| Role | Value | Use |
|---|---|---|
| Sea canvas | `#091d29` | Page and map base |
| Surface | `#102b3a` | Header, action wells, table bands |
| Raised surface | `#183746` | Selected and raised tools |
| Bone | `#eee8d9` | Primary text |
| Muted | `#adbfca` | Secondary text and metadata |
| Amber | `#e9b75e` | Primary action, focus, Hashpower |
| Dark label | `#091d29` | Text and icons on amber or other light fills |
| Danger | `#ff9790` | Failed orders, destructive or raid-risk states |
| Liquidity | `#80d1da` | Liquidity marks and labels |
| Blockspace | `#a8bffa` | Blockspace marks and labels |
| Structural line | `#35515f` | Dividers that do not carry meaning |
| Strong line | `#728d9b` | Inputs, controls, and meaningful boundaries |

Contrast ratios, computed against the specified surfaces:

| Pair | Ratio | Result |
|---|---:|---|
| Bone on sea | 14.09:1 | Pass |
| Bone on raised | 10.26:1 | Pass |
| Muted on sea | 9.09:1 | Pass |
| Muted on raised | 6.62:1 | Pass |
| Amber on sea | 9.35:1 | Pass |
| Sea label on amber | 9.35:1 | Pass |
| Danger on raised | 6.02:1 | Pass |
| Liquidity on raised | 7.20:1 | Pass |
| Blockspace on raised | 6.87:1 | Pass |
| Structural line on sea | 2.04:1 | Structural only; never the sole meaningful boundary |
| Strong line on sea | 4.92:1 | Pass |
| Strong line on surface | 4.20:1 | Pass |
| Strong line on raised | 3.58:1 | Pass |

Goods use a written name and stable map marker shape in addition to colour.
Translucent hairlines are structural only; meaningful input boundaries and
focus indicators must meet 3:1.

### Source notes

- Runtime source: `apps/game/app/globals.css`.
- Project mirror: `docs/design-kit/tokens.json`.
- The project mirror includes the actual colour, font, type, spacing, radius,
  layout, duration, easing, target, and focus values used by the runtime CSS.
- The files under `docs/design-kit/core/tokens/` remain byte-matched copies of
  the generic source kit. They are reference examples, not FRONTIER runtime
  values.
- `apps/game/app/layout.tsx` exposes `--font-frontier-display` and
  `--font-frontier-body`; runtime CSS maps those into `--font-display` and
  `--font-body`.
- Contrast ratios in this brief were computed from the runtime hex values with
  the WCAG relative-luminance formula. Ratios are rounded to two decimals.
- `--line` is decorative structure at 1.49:1 to 2.04:1 across project surfaces.
  `--line-strong` is used when a visible boundary carries meaning.

## 8. Proof available

| Proof | Verified? | Source | Can show? |
|---|---|---|---|
| Live world reads and block height | Yes when RPC succeeds | Deployed testnet contract state | Yes, with loading and unavailable states |
| Transaction result | Yes after confirmation | Transaction hash and testnet receipt | Yes |
| Game-only function-call key | Implemented | Frontend method allowlist and NEAR wallet approval | Explain exact scope without a security superlative |
| Mainnet or redeemable value | No | Out of scope | Never imply it |
| Rival traffic, AI rivals, storms, or season rollover | Not demonstrated in the current UI | Existing project scope | Do not present as live |

## 9. Constraints

| Constraint | Value |
|---|---|
| Framework | Existing Next.js 16 App Router and React 19 |
| Styling | Existing plain CSS variables; no Tailwind migration |
| Theme | Dark nautical only |
| Fonts | Local Barlow Condensed 600/700 and DM Sans variable WOFF2 |
| Motion | CSS only; event toast only; reduced-motion path required |
| Performance | LCP <=2.5s, INP <=200ms, CLS <=0.1 at p75 |
| Accessibility | WCAG 2.2 AA target; keyboard map controls; 44px touch targets where practical |
| Must use | Existing FRONTIER wordmark, map, contract-derived state, and honest testnet labels |
| Must avoid | Clash Display files, gradients, glow, glass, decorative blobs, invented metrics, fake traffic, and contract changes |

## 10. AI-default self-review

| Possible default | Decision |
|---|---|
| Near-black plus hot accent | The sea canvas comes from the nautical subject and uses three specified blue-green surfaces. Amber is paired with three named cargo roles, not used as a generic neon treatment. |
| Condensed all-caps game type | Barlow Condensed is reserved for short headings and display labels. DM Sans handles paragraphs, forms, and system copy. |
| HUD decoration | Brackets, coordinates, and status marks may appear only when they frame real contract data. |
| Card dashboard | The page uses one map field, one adjacent action tool, hairline rows, and unframed status bands. No repeated marketing-card grid. |
| Animated game map | The map remains stable. Contract updates change labels and markers without ambient movement. |

## 11. References

See `references.md`. The primary references are the current FRONTIER app and
brief, real nautical charts, and the copied gaming pack's surface hierarchy.

## 12. Open questions

None for this bounded redesign. Missing contract facts stay absent or use an
explicit unavailable state.
