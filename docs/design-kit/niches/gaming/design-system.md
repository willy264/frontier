# Gaming: design-system overrides

Applies on top of `core/design-system.md`. Covers game marketing sites, launchers, web3 games and companion web apps. Model: dark, one hot accent, hard geometry, real data in the HUD. The documented reference is Valorant's site, from a third-party extraction [3P: webdesignhot]; treat its values as indicative.

**Do not ship Valorant's palette as a template.** "A near-black background with one acid-green or vermilion accent" is a named AI default. [DOC: Anthropic skill] Keep the structure; take the accent hue from the game's own key art.

## 1. Settings

| Setting | Value | Source |
|---|---|---|
| Canvas | Dark, blue- or brand-tinted, never `#000`; 3 surface steps | [3P: Valorant] |
| Text | Warm off-white "bone", not `#fff` for body; pure white only for top display emphasis | [3P: Valorant] |
| Accent strategy | One hot accent, reserved for the primary CTA and brand mark | [3P: Valorant] |
| Borders | Hairlines at 15–30% bone | [3P: Valorant] |
| Radius control / card / panel | 0 / 0 / 0; pills only for tags (role badges) | [3P: Valorant] |
| Depth | No gradients, no blurred shadows; hairlines and rings | [3P: Valorant] |
| Display + body | **Clash Display** + **Onest**; mono for stats | [SYN] (Valorant uses Tungsten Bold + Inter; its fallbacks Bebas Neue and Oswald are outside this kit's list) |
| Icons | Phosphor bold; fill for active states | [SYN] |
| Illustration | None; key art and renders | [SYN] |
| Eyebrows | Small caps tracked 0.16–0.20em | [3P: Valorant] |
| Container | Max 1440px; prose 720px; sticky header 80px | [3P: Valorant] |
| Section spacing | 96px; marketing 128–200px | [3P: Valorant] |

## 2. Palette structure (Valorant extraction, for structure only)

| Role | Valorant value | Ratio (computed) | Your project |
|---|---|---|---|
| base | `#0f1923` | | from key art, dark |
| surface | `#1a242e` | | |
| surface-strong | `#212d39` | | |
| text (bone) | `#ece8e1` | 14.53:1 on base | |
| muted | `#9aa6b1` | 7.15:1 on base; 5.65:1 on surface-strong | |
| faint | `#6c7780` | **3.88:1 on base: fails for body text** | use only for disabled or ≥24px |
| accent | `#ff4655` | 5.29:1 on base | from key art |
| accent pressed / active | `#d62836` / `#a81e29` | | |
| accent tint | `rgba(255,70,85,.15)` | | |
| border | `rgba(236,232,225,.15)` / `.30` | | |

**Contrast trap:** white on `#ff4655` is 3.36:1, below 4.5:1 for normal-size button labels. Put dark base text on the accent (5.29:1), or make the label ≥24px / ≥18.66px bold. Check your own accent the same way.

Do not swap in a generic red such as `#dc2626` for the brand red. [3P: Valorant]

## 3. Type

| Role | Valorant spec | Kit rule |
|---|---|---|
| Hero | 144px / 0.92, condensed caps; kept ≥64px on mobile | Clash Display, uppercase allowed, tracking about 0.01em |
| xl / lg | 96/0.95, 72/1.0 | |
| h1 / h2 / h3 / h4 | 56 / 40 / 28 / 22 | |
| Eyebrow | 14px caps, 0.18em | |
| Label | 12px caps, 0.20em | |
| Button | 14px caps, 0.16em | |
| Body | 15/1.6 | Onest 16px minimum on marketing |
| Stats | mono | Geist Mono, `tabular-nums` |

Tracking grows as size shrinks: display ~0.01em, small caps 0.16–0.20em. [3P inference] No rounded display faces. [3P: Valorant]

## 4. Components

| Component | Spec | Source |
|---|---|---|
| Primary button | Accent fill, 0 radius, skew −6° with counter-skewed label; hover inverts to light/dark | [3P: Valorant] |
| Ghost button | 1px border, same skew | [3P] |
| Card | Surface fill, 0 radius, 32px padding, 2px accent top border, no shadow; hover adds 1px accent ring | [3P] |
| Focus | Border turns accent "with no glow" (kit still requires a 3:1 visible indicator) | [3P] |
| Stat blocks | 4-column grid, 32px gap, external borders only | [3P] |
| Leaderboard | Mono tabular numerals; hairline grid rows, not heavy cards | [SYN] |
| Bento | 0-radius cells with hairlines | [SYN] |
| Hero | Full-bleed video up to 100vh; asymmetric 60/40 character/copy split | [3P] |
| Glow | An earned state (hover, focus, selected), never a resting style | [SYN] |

## 5. HUD-style decoration

Corner brackets, mono readouts and progress bars must frame real data: stats, leaderboards, season timers. No ornament without information. [SYN]

## 6. Game accessibility (adds to core gates)

| Rule | Value | Source |
|---|---|---|
| Safe margin | Critical text inside ~5% of the viewport edges | [3P: gaming-patterns] |
| Touch targets | 44–48px | [3P] |
| Hover | No hover-only reveals | [3P] |
| Focus | Visible and reachable by keyboard and D-pad | [3P] |
| Flashing | ≤3 per second; stricter for saturated red; avoid large alternating high-contrast patterns | [3P] |
| Events | Important events confirmed on ≥2 channels (visual, audio, haptic) | [3P] |
| Colour | Never the only signal for critical state | [3P] |
| HUD density | A setting (contextual fade, hold-to-reveal) | [3P] |

## 7. Web3 games

| Rule | Source |
|---|---|
| Lead with gameplay. Do not require a wallet to start. | [3P: Phenomenon Studio] |
| Email or social login with an embedded wallet | [3P] |
| Gas-free exploration first; sponsor gas (paymasters, ERC-4337); batch transactions | [3P] |
| Approval prompts in plain language that separate *approve* from *transfer* and state irreversible consequences | [3P] |
| No unlimited approvals by default; no seed-phrase burden at signup | [3P] |
| Hide chain mechanics until the player needs them | [SYN] |
