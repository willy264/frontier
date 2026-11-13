# Motion / creative studio: motion overrides

Applies on top of `core/motion.md`. This is the one niche where motion is the main expression channel. The engineering rules (reduced motion, pause control, performance budget) still apply in full.

## 1. Engine

| Item | Choice | Source |
|---|---|---|
| Timelines and scroll | GSAP + ScrollTrigger (+ SplitText for type) | [SYN] |
| Smooth scroll | Lenis. Ontiver's calmer values allowed here: `lerp: 0.085`, `wheelMultiplier: 0.58`, `syncTouch: false`, disabled under reduced motion | [OWN] |
| 3D | Three.js when the scene is the content | [DOC: igloo stack] |
| Text effects | React Bits text components, rethemed | [SYN] |
| CSS scroll-driven | `animation-timeline: view()` / `scroll()`, named timelines, `animation-range`, inside `@supports` with a static fallback | [DOC: MDN] |

## 2. Durations

Studio pages run longer showpieces, but UI chrome keeps core speeds.

| Use | Duration | Easing |
|---|---|---|
| Nav, buttons, toggles | core `instant` / `fast` | `--ease-standard` |
| Section transitions | 650–1100ms (core showpiece tier) | `--ease-reveal` or GSAP `power3.out` |
| Text reveal (split lines) | per line 600–850ms, stagger 65ms capped at 4 | `--ease-reveal` |
| Media clip-path entrance | 1100ms (core §4) | `--ease-reveal` |
| Scroll-linked scenes | tied to scroll position, not time | linear mapping |

[OWN] [SYN]

## 3. Signature techniques (pick one family per site)

| Technique | Notes | Source |
|---|---|---|
| Real-time in-engine intro instead of video | Smaller than video; precompile shaders during load | [DOC: igloo] |
| Scene transitions: chromatic aberration, displacement, frost | Shader-based | [DOC: igloo] |
| Particle simulation that re-forms per link | Colour shifts with speed; glow while forming | [DOC: igloo] |
| WebGL text scramble via SDF texture offsets | Avoids CSS style recalculation | [DOC: igloo] |
| Owned photography + statement type, no WebGL | Achieves distinctiveness without 3D | [3P: noth.in] |
| Looping service videos | Each with pause control | [3P: Phenomenon, vectura.se] |

## 4. Rules

- One material, one technique family. Do not mix aberration, glitch, liquid and particles. [SYN]
- Every background video and every loop has a visible pause control. [3P: vectura.se]
- Sound is opt-in, muted by default, and synced to interaction if used. [SYN] [DOC: igloo]
- Do not hijack scroll so that keyboard or assistive tech cannot reach content.
- Test on a low-end device every week. [DOC: igloo]

## 5. Reduced motion

| Element | Fallback |
|---|---|
| Scroll scenes | Static key frame per section |
| Intro | Skip to final frame |
| Particles, shaders | Paused or replaced by a poster |
| Text scramble | Plain text |
| Lenis | Off |
| Video | Poster frame |
