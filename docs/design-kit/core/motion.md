# Motion (base layer)

Motion shows what changed, or marks the page's one orchestrated moment. Nothing else moves. Niche files in `niches/<niche>/motion.md` override the engine, the curves and a few durations.

Labels: [OWN] Ontiver/QuickBite source; [DOC] primary doc; [3P] third-party extraction; [SYN] synthesis.

## 1. Easing tokens

| Token | Curve | Use | Source |
|---|---|---|---|
| `--ease-reveal` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, reveals, the showpiece, radial button fill | [OWN] 38 uses in Ontiver, 43 in QuickBite |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Utility motion: hover, press, colour, toggles | [DOC] M3 standard |
| `--ease-exit` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exits (accelerate out) | [DOC] M3 emphasized accelerate |
| `--ease-linear` | `linear` | Marquees, progress, spinners only | [DOC] M3 |

Reference curves (use only if a niche file asks):

| Curve | Value | Source |
|---|---|---|
| M3 emphasized decelerate | `cubic-bezier(0.05, 0.7, 0.1, 1)` | [DOC] |
| Carbon productive standard | `cubic-bezier(0.2, 0, 0.38, 0.9)` | [DOC] |
| Carbon expressive standard | `cubic-bezier(0.4, 0.14, 0.3, 1)` | [DOC] |
| Ontiver secondary | `cubic-bezier(0.2, 0.8, 0.2, 1)` (5 uses) | [OWN] |

`--ease-*: initial` in `theme.css` removes Tailwind's default easings, so only these exist.

## 2. Duration tiers

Two kinds of motion need different speeds. **Interaction feedback** must be fast because the user waits on it. **One-time, non-blocking reveals** can be slow because nothing waits on them.

| Tier | CSS var | Duration | Easing | Use | Source |
|---|---|---|---|---|---|
| instant | `--dur-instant` | 100ms (70–120) | standard | Press, toggle, colour change | [DOC] Carbon fast-01 70ms; M3 short2 100ms |
| fast | `--dur-fast` | 220ms (180–260) | standard | Hover, focus ring, arrow slide, dropdown, exits | [OWN] Ontiver's most common: 260ms (24), 180ms (17), 220ms (12) |
| base | `--dur-base` | 320ms (300–400) | reveal in, exit out | Modal, drawer, toast, tab content | [DOC] NN/g 200–300ms modals; Carbon 240–400ms |
| reveal | `--dur-reveal*` | 600–850ms; media 1000ms | reveal | One-time scroll reveal | [OWN] Ontiver reveal tokens |
| showpiece | `--dur-showpiece` | 650–1100ms | reveal | The page's single orchestrated moment | [OWN] Ontiver hero 850–1100ms, fill 650ms |

Rules:
- Entrances slightly longer than exits (e.g. 300ms in, 200–250ms out). [DOC: NN/g]
- The more often a user sees an animation, the shorter it is. [DOC: NN/g]
- Interaction feedback never exceeds 400ms. Around 500ms "feels like a drag". [DOC: NN/g]
- Duration scales with distance and size. [DOC: Carbon]
- Productive motion for task UI, expressive motion for rare significant moments. [DOC: Carbon]

## 3. Reveal system [OWN: Ontiver motion.css, pageRevealRuntime.ts]

| Kind | `data-reveal` | Distance (translateY) | Duration | Extra |
|---|---|---|---|---|
| default | `""` | 18px | 680ms | |
| heading | `heading` | 28px | 850ms | |
| action | `action` | 12px | 600ms | buttons, links |
| card | `card` | 24px | 800ms | |
| media | `media` | 20px | 1000ms | scale 0.985 → 1 |

| Setting | Value |
|---|---|
| Easing | `--ease-reveal`, no forwards fill |
| Stagger | `--reveal-delay: min(index, 4) × 65ms` (max 260ms) |
| Trigger | IntersectionObserver, `rootMargin: "0px 0px -24px 0px"`, run once |
| Properties | `opacity`, `transform` only |
| Engine | CSS keyframes + a small IntersectionObserver runtime. No JS animation library needed. |

QuickBite's GSAP equivalent, for projects already on GSAP: `power3.out`, 0.8s, y 18 or x 24, ScrollTrigger `start: "top 88%"`, once; image mode `clipPath: inset(0 0 100% 0 round 1.75rem)` → `inset(0 0 0% 0 round 1.75rem)`. [OWN]

**Limit:** do not fade-up every section. Reveal the elements that carry the section (heading + one media block), and leave body copy static. One orchestrated moment beats scattered effects. [DOC: Anthropic skill]

### Minimal runtime

```ts
// reveal.ts: client-only. Adds .is-visible once; CSS does the rest.
export function initReveal(root: ParentNode = document) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }),
    { rootMargin: "0px 0px -24px 0px" },
  );
  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) =>
    group.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) =>
      el.style.setProperty("--reveal-delay", `${Math.min(i, 4) * 65}ms`)));
  root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}
```

```css
[data-reveal] { opacity: 0; transform: translateY(18px); }
[data-reveal="heading"] { transform: translateY(28px); }
[data-reveal="action"]  { transform: translateY(12px); }
[data-reveal="card"]    { transform: translateY(24px); }
[data-reveal="media"]   { transform: translateY(20px) scale(0.985); }
[data-reveal].is-visible {
  opacity: 1; transform: none;
  transition: opacity var(--dur-reveal) var(--ease-reveal) var(--reveal-delay, 0ms),
              transform var(--dur-reveal) var(--ease-reveal) var(--reveal-delay, 0ms);
}
[data-reveal="heading"].is-visible { transition-duration: var(--dur-reveal-heading); }
[data-reveal="action"].is-visible  { transition-duration: var(--dur-reveal-action); }
[data-reveal="card"].is-visible    { transition-duration: var(--dur-reveal-card); }
[data-reveal="media"].is-visible   { transition-duration: var(--dur-reveal-media); }
/* No-JS safety: content must be visible if the script never runs */
.no-js [data-reveal] { opacity: 1; transform: none; }
```

## 4. The showpiece (one per page)

Pick one. Write which one in `wireframes.md`.

| Option | Spec | Source |
|---|---|---|
| Hero entrance | Children 850ms, translateY 32px, delays 0 / 100 / 180 / 260ms | [OWN: Ontiver] |
| Hero media clip | 1100ms from `clip-path: inset(42% 38% round 16px)` + scale 1.045 to `inset(0 round 20px)` | [OWN: Ontiver] |
| Rotating phrase | 650ms with 4px blur | [OWN: Ontiver] |
| Typewriter word | typeSpeed 92ms, deleteSpeed 58ms, pause 4200ms, photo synced to word | [OWN: QuickBite] |

## 5. Hover and press

| Interaction | Property | Duration | Easing | Source |
|---|---|---|---|---|
| Colour/background change | `color`, `background-color` | 180ms | standard | [OWN: Ontiver] |
| Primary button radial fill | `clip-path: circle(0%)` → `circle(150%)` from centre | 650ms | reveal | [OWN: Ontiver] |
| Primary button arrow | arrow slides through, right → left | 260ms | reveal | [OWN: Ontiver] |
| Magnetic fill (playful) | fill scales 0→1 from cursor entry point | 760ms in / 600ms out | `cubic-bezier(0.4,0,0.2,1)` | [OWN: QuickBite] |
| Image card hover | `scale(1.04)` on the image inside a clipped frame | 700ms | reveal | [OWN: Ontiver] |
| Press | `scale(0.97)` | 100ms | standard | [OWN: QuickBite `whileTap`] |
| Spring hover/tap (if Motion is installed) | `whileHover {y:-3, scale:1.015}`, `whileTap {scale:0.97}`, spring stiffness 420, damping 30, mass 0.6 | spring | | [OWN: QuickBite tactileSpring] |
| Focus ring | outline appears | 0ms (instant; never animate focus in) | | [SYN] |

Rules:
- Hover on the primary CTA and on links. Do not add a hover lift to every card. [DOC: Anthropic skill]
- Touch devices: wrap hover effects in `@media (hover: hover)`. [SYN]
- If you need springs beyond the QuickBite default, use M3: spatial damping 0.9 with stiffness 1400 / 700 / 300 (small / partial / full-screen); effects (colour, opacity) damping 1, stiffness 3800 / 1600 / 800, no overshoot. [DOC: M3]

## 6. Scroll

| Item | Rule | Source |
|---|---|---|
| Smooth scroll | Lenis on marketing pages only. Never in app UI. Disabled under reduced motion. | [OWN] [SYN] |
| Lenis values | **Kit default: `lerp: 0.12`, `wheelMultiplier: 1`** (QuickBite current code). Ontiver's `lerp: 0.085`, `wheelMultiplier: 0.58` is allowed for the studio niche only. `syncTouch: false`. | [OWN]. The two repos disagree; Ontiver's docs claim to copy QuickBite but QuickBite has since changed. The kit picks QuickBite's current values because a wheel multiplier below 1 slows the user's own scrolling [SYN]. |
| Parallax | Clamp offset to ±22px. Off under reduced motion. Not in finance product UI. | [OWN: Ontiver] |
| Marquee | 32–36s linear, `gap: 48px`, edge mask `linear-gradient(to right, transparent, black 10%, black 90%, transparent)`, pauses on hover and focus. Reduced motion: becomes a static wrapped row. | [OWN: Ontiver 36s, QuickBite 32s] |
| Ambient loops | Float 7s, pulse 9s, sunburst spin 56s paused until in view: playful only. | [OWN: QuickBite] |
| Scroll progress bar | 3px, 7px on hover, brand colour (playful only). Do not hide the native scrollbar. | [OWN: QuickBite]; hiding the scrollbar is a kit ban [SYN] |
| CSS scroll-driven | `animation-timeline: view()` / `scroll()` inside `@supports (animation-timeline: view())` with a static fallback | [DOC: MDN] |
| Counters | Number tickers on marketing stats only: 600–1200ms, once, tabular figures. QuickBite odometer runs 1.8s; use the shorter range. | [SYN] [OWN] |

## 7. Reduced motion and user control

| Requirement | Implementation |
|---|---|
| OS setting | `@media (prefers-reduced-motion: reduce)`: durations to 0.01ms, iteration count 1 (already in `theme.css`). |
| Swap, don't just kill | Translate and scale become opacity-only fades where the motion carries meaning (e.g. a dialog still fades). [OWN] [3P: Valorant] |
| Stop | Loops, parallax, marquees (to static row), Lenis, autoplay video (to poster frame). |
| User toggle | Visible "Pause motion" control wherever ambient motion runs. Sets `html[data-motion="paused"]`. [OWN: Ontiver] |
| Video | Every background video has a visible pause button. [3P: vectura.se] |
| Flashing | ≤3 flashes per second (WCAG 2.3.1). |
| Libraries | Aceternity, Magic UI and React Bits do not ship full reduced-motion support. Add guards yourself (`useReducedMotion` in Motion, `gsap.matchMedia()` in GSAP). [3P: PkgPulse] |
| Sound | Opt-in, muted by default. [SYN] |

## 8. Performance

| Rule | Source |
|---|---|
| Animate only `transform`, `opacity`, `clip-path`. Never `width`, `height`, `top`, `left`, `margin`. | [SYN] |
| `will-change` only during the animation, removed after. | [SYN] |
| Start with CSS. Ontiver ships a motion-rich page with no JS animation library. | [OWN] |
| Add Motion (≈125KB, aggregator estimate) only when a component needs springs, layout animation or exit animation. Use `LazyMotion` + `m`. | [3P: PkgPulse] [SYN] |
| Do not ship Motion and GSAP together without a written reason in `PRD.md`. | [SYN] |
| No animation may delay LCP content. Hero text must be readable in the first frame (start from opacity ≥0 only after hydration; render visible on the server). | [SYN] |
| Animations must not shift layout (CLS ≤0.1). | [DOC: web.dev] |
| Input response under 100ms; never gate core input behind an animation. | [3P: gaming-patterns] |
| WebGL: measure on a low-end device from the first week. | [DOC: Awwwards igloo case study] |

## 9. Per-interaction table (fill in per project)

The example rows use the tiers above. The dialog scale (0.98) and dropdown offset (4px) are [SYN] defaults; change them if the brief calls for it.

| Element | Trigger | Property | Duration | Easing | Distance | Reduced-motion fallback |
|---|---|---|---|---|---|---|
| Primary CTA | hover | clip-path fill + arrow | 650 / 260ms | reveal | | colour change only |
| Section heading | enter viewport | opacity, translateY | 850ms | reveal | 28px | visible, no motion |
| Dialog | open / close | opacity, scale 0.98→1 | 320 / 220ms | reveal / exit | | opacity only |
| Toast | enter / exit | opacity, translateY | 320 / 220ms | reveal / exit | 12px | opacity only |
| Dropdown | open | opacity, translateY | 220ms | standard | 4px | opacity only |
| … | | | | | | |
