# Playful: PRD additions

Add these sections to `core/templates/PRD.md` after section 13. [SYN unless marked]

## A. Semantic colour map

Fill this before tokens. Every accent has a meaning, a shadow shade and a tint. See `design-system.md` §2.

| Meaning | Base | Shadow | Tint | Where it appears | Label colour + ratio |
|---|---|---|---|---|---|
| | | | | | |

## B. Mascot / character

| Item | Decision |
|---|---|
| Exists? | yes / no |
| Format | SVG / Rive state machine / Lottie |
| States | idle, happy, thinking, sad (empty), celebrating (reward) |
| Where it appears | empty states, 404, onboarding, rewards |
| Accessibility | `aria-hidden` when decorative; never carries information alone |
| Reduced motion | static pose |
| File budget | |

Rive suited stateful mascots in one dated single-device benchmark (~60fps vs Lottie ~17fps; 2KB vs 24.4KB). Retest on your target devices. [3P: Callstack]

## C. Reward moments

| Moment | Trigger | Motion | Sound | Reduced-motion fallback |
|---|---|---|---|---|
| | | overshoot curve allowed here only | opt-in | static badge + text |

## D. Photography and cut-outs

| Folder | Content | `sources.json` | Processing script |
|---|---|---|---|
| `public/images/<topic>/` | | required | e.g. cut-out, grade, audit |

QuickBite keeps `sources.json` per folder and scripts such as `prepare-hero-food.mjs` and `audit-image-quality.mjs`. [OWN]

## E. Testimonials and community proof

| Quote | Name | Role / place | Consent recorded | Date |
|---|---|---|---|---|
| | | | | |

Placeholder or persona quotes never ship. If none are real yet, leave the section out. [OWN: proof policy]

## F. Localisation

| Item | Rule |
|---|---|
| Local references | Places, dishes, slang approved by someone local |
| Currency, units | |
| Payment names | e.g. "Pay with Paystack" [OWN] |
