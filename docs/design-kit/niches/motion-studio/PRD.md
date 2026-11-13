# Motion / creative studio: PRD additions

Add these sections to `core/templates/PRD.md` after section 13.

## A. Scene plan

| Section | Scene / media | Interaction | Transition out | Static fallback | Owner |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

igloo.inc planned camera moves with untextured previs animations and iterated art and code together in the browser. [DOC: Awwwards case study] Plan previs time into the schedule. "Procedural approaches need to be chosen carefully, since setting them up can take a significant amount of time." [DOC]

## B. Performance budget (set from week one)

| Item | Budget | Measured on |
|---|---|---|
| Initial JS (gzip) | | |
| 3D / volume data | igloo's compressed volume data was "smaller than a typical website image" [DOC] | |
| Textures | loaded in the background after first paint | |
| Shaders | compiled during initial load | |
| Frame rate | target and floor | named low-end device |
| LCP | ≤2.5s (HTML text or poster as LCP element) | |

Measure continuously, with adjustments for low-end devices. Prefer a real-time in-engine intro over pre-rendered video when it is smaller. [DOC: igloo]

## C. Stack decision

| Layer | Choice | Reason |
|---|---|---|
| Scroll | GSAP + ScrollTrigger + Lenis | |
| 3D | Three.js (+ three-mesh-bvh if raycasting) | only if the scene is the content |
| Framework | Next.js / Vite (igloo used Svelte + Vite) | |
| CSS scroll-driven | `animation-timeline: view()` inside `@supports` | |
| Sound | library, files, budget | |

## D. Sound

| Item | Decision |
|---|---|
| Default | Muted |
| Toggle | Visible, persistent, keyboard reachable |
| Sync | What sound follows (igloo syncs music and SFX to particle movement) [DOC] |
| Captions | For any spoken audio |

## E. Fallbacks

| Condition | What renders |
|---|---|
| `prefers-reduced-motion` | Static frames, no scroll scenes, no auto video |
| No WebGL | Poster images + HTML content |
| Low-end device detected | Reduced particles / resolution |
| JS disabled | Full HTML content, readable |

## F. Content

| Item | Rule |
|---|---|
| Projects | Each with a text title, client, year, role, and a link |
| Case studies | One metric or outcome if there is one; otherwise a plain description |
| Contact | Lowercase CTA allowed ("book a call") [3P: noth.in] |
