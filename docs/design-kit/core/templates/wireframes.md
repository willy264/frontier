# Wireframes: <project name>

Low-fidelity layout in text. One block per section. Write this before any component code. [DOC: Anthropic skill asks for one-sentence concepts, ASCII wireframes and explicit alignment choices]

## Page: <route>

**Showpiece (the one orchestrated moment on this page):** <e.g. hero media clip-path entrance, 1100ms>

**Section order:**

| # | Section ID | One-sentence concept | Alignment | Primary CTA | Reveal |
|---|---|---|---|---|---|
| 1 | hero | | left / centre / split | | showpiece |
| 2 | | | | | heading + media only |
| 3 | | | | | |

Rules:
- One primary CTA per section.
- Not every section reveals. Mark "static" where nothing moves.
- Numbered items only where the content is a real sequence.
- Section IDs match the keys in `text-copy.md`.

---

### 1. hero

Concept: <one sentence: what the reader sees first and why it is specific to this subject>

Mobile (360–450px):

```
┌──────────────────────────┐
│ [logo]            [menu] │
├──────────────────────────┤
│ EYEBROW                  │
│ H1 line one              │
│ H1 line two (accent)     │
│ Subtitle, two lines max  │
│ [Primary CTA]            │
│ secondary link           │
│ ┌──────────────────────┐ │
│ │   characteristic     │ │
│ │   image / product UI │ │
│ └──────────────────────┘ │
│ honest microcopy line    │
└──────────────────────────┘
```

Desktop (≥1024px):

```
┌──────────────────────────────────────────────────────────┐
│ [logo]   nav  nav  nav                      [Primary CTA]│
├───────────────────────────────┬──────────────────────────┤
│ EYEBROW                       │                          │
│ H1 line one                   │   characteristic image   │
│ H1 line two (accent)          │   / product UI           │
│ Subtitle (max 45rem)          │                          │
│ [Primary CTA]  secondary link │                          │
│ microcopy                     │                          │
└───────────────────────────────┴──────────────────────────┘
```

Notes: <what changes between breakpoints; what is cropped; LCP element>

---

### 2. <section id>

Concept:

Mobile:

```
```

Desktop:

```
```

Notes:

---

## Responsive spec

| Breakpoint | Layout change |
|---|---|
| <450px | |
| 450px (`xs`) | |
| 640px (`sm`) | gutter 24px, section-y 4.5rem |
| 768px (`md`) | grids to 3 columns |
| 1024px (`lg`) | split layouts; fluid gutter and section-y |
| 1280px (`xl`) | four-up grids |
| 1536px+ | container cap; text stays at measure |
