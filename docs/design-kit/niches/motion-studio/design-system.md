# Motion / creative studio: design-system overrides

Applies on top of `core/design-system.md`. Covers studio, agency, portfolio and launch sites where the scene or the work is the content. References: igloo.inc (Awwwards Site of the Year 2024; 2026 Webby honoree, Best Visual Design – Aesthetic) and noth.in. [DOC: Awwwards case study] [3P: noth.in]

No fonts, CSS variables or hex values could be inspected for these sites. Use them for structure and principle only.

## 1. Settings

| Setting | Value | Source |
|---|---|---|
| Canvas | Whatever the art direction needs; chrome near-invisible | [SYN] |
| Accent strategy | One material or motif, not a colour | [SYN from 3P] |
| Radius | 0 or full (pill); pick one for the whole site | [SYN] |
| Display + body | **Playfair Display** + **Geist**, or **Clash Display** + **Geist Mono** | [SYN] |
| Icons | Phosphor thin or light, used rarely | [SYN] |
| Illustration | None; owned photography or 3D | [SYN] |
| Eyebrows | Off. Use an authored label system instead (e.g. bracketed lowercase "( The Studio )") | [3P: noth.in] |
| Section count | Few. igloo.inc has three scroll sections. | [DOC] |

## 2. One material or motif

Choose one and repeat it everywhere: hero, project thumbnails, transitions, 404.

| Reference | Motif | How it repeats |
|---|---|---|
| noth.in | Studio-lit inflated and foil objects (bubble-wrapped heart, foil star, balloon dog) | Row of 12 images opens the hero; same lighting across all imagery [3P] |
| igloo.inc | Procedural ice | Each project is its own procedurally grown ice block; frost transitions [DOC] |

Material metaphors used by trend writers: stone = reliability, liquid = creative, machined metal = precision. [3P: Muzli] Pick from the client's world, not from this list.

Write the motif in `brief.md` §6 and list where it appears in `wireframes.md`.

## 3. Type

| Role | Rule |
|---|---|
| Display | Statement-led; Playfair Display for editorial, Clash Display for hard modern. Never Playfair for body or UI text. |
| Body / UI | Geist (quiet) or Geist Mono (technical) |
| Labels | Authored system: bracketed, lowercase allowed, consistent format |
| Kinetic type | Hero only; reduced-motion fallback | [3P: StudioMeyer, Muzli] |
| WebGL text | Allowed when the scene is the content (igloo renders UI text in WebGL with SDF scramble). Provide an HTML text layer for accessibility and SEO. [DOC] [SYN] |

## 4. Layout

| Pattern | Source |
|---|---|
| Statement H2s alternating with full-width media | [3P: noth.in] |
| Project list (5 + "View all") rather than a card grid | [3P: noth.in] |
| A distinct visual object per project so scrolling never repeats | [DOC: igloo] |
| Background video with a visible pause control | [3P: vectura.se] |
| Services as a plain list, not icon cards | [3P: noth.in] |
| Chrome (nav, labels) minimal and consistent | [SYN] |

## 5. Colour

- Neutral chrome (ink/canvas pair that passes 4.5:1) so the work carries the colour.
- If the canvas is dark, follow the core dark rules: tinted, not `#000`; off-white text.
- Effects colour (chromatic aberration, glow) belongs to the scene, not to UI controls. igloo applies glow only to moving particles. [DOC] [SYN]

## 6. Accessibility in a scene-first site

| Risk | Rule |
|---|---|
| Content only in canvas/WebGL | Mirror every heading, link and project title in HTML |
| Custom cursor | Never hide the system cursor on interactive elements; disable on touch | [SYN] |
| Scroll hijack | Keyboard (Space, Page Down, arrows) and screen readers must still reach every section |
| Sound | Off by default, visible toggle |
| Motion | Pause control; static fallback for every scene |

## 7. Do not

- Hero with a giant blob, abstract floating orbs, heavy 3D without purpose [3P: Muzli, StudioMeyer]
- Glitch/brutalist effects on a client in finance, health or enterprise [3P: Muzli]
- More than one material
- A showreel as the only content (provide a text project list)
