# Brief: <project name>

Fill every field before tokens are written. If a field is unknown, the agent proposes one concrete answer, marks it `PROPOSED`, and asks the human to confirm. Vague briefs produce average output: "if you don't define the context of use, it will guess." [DOC: Vercel v0]

## 1. One-line build statement

Build **[surface]**, used by **[who]**, in **[moment]**, to **[outcome]**, with **[constraints]**. [DOC: Vercel v0 template]

> Example: Build a waitlist landing page and KYC onboarding flow, used by first-time mobile banking users in Lagos on mid-range Android phones, while they decide whether to trust a new app, to start identity verification, with light mode, British spelling, under 2.5s LCP on 4G.

## 2. Subject

| Field | Answer |
|---|---|
| Product / organisation | |
| What it is (one noun phrase) | |
| What it does for the user (one sentence) | |
| Primary job of this page or flow | |
| Secondary job | |
| Market / locale / spelling | |
| Stage (pre-launch, pilot, live) | |

## 3. Audience and moment

| Field | Answer |
|---|---|
| Primary user | |
| What they already know | |
| What they fear or doubt | |
| Device and network | |
| Moment of use (where, when, in what state) | |
| Decision they make on this page | |

## 4. Tone

| | Words |
|---|---|
| 3–5 tone words | |
| 3 anti-tone words (what it must never feel like) | |
| Register (from niche profile) | |

## 5. Niche profile

| Field | Answer |
|---|---|
| Chosen profile | fintech / b2b-professional / gaming / playful / motion-studio |
| Why this profile | |
| Accent strategy | quiet tool / signature colour / semantic map / material |
| Settings changed from the profile (and why) | |
| Expression channel(s): pick 1–2 | type / colour / material / motion / photography / mascot / 3D |

## 6. The characteristic thing

What is the most characteristic thing in the subject's world? The hero opens with it. [DOC: Anthropic skill]

| Field | Answer |
|---|---|
| Object, material, place, gesture or artefact | |
| How it appears in the hero (photo, product UI, 3D, type) | |
| Where the accent hue comes from (key art, material, place) | |

## 7. Proof available

| Proof | Verified? | Source | Can we show it? |
|---|---|---|---|
| Metrics | | | |
| Customers / partners | | | |
| Testimonials | | | |
| Regulatory / certifications | | | |

If nothing is verified yet, the page shows "—" and "Awaiting results" instead of invented numbers. [OWN: Ontiver proof policy]

## 8. Constraints

| Constraint | Value |
|---|---|
| Framework | Next.js / Vite + React 19, Tailwind v4 |
| Light / dark / both | |
| Performance budget | LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 (p75) |
| Accessibility | WCAG 2.2 AA |
| Must-use assets (logo, fonts, photos) | |
| Must-avoid (legal, brand, competitor) | |
| Deadline | |

## 9. References and anti-references

Link to `references.md`. List the 2–3 most important here:

| Reference | Take | Don't take |
|---|---|---|
| | | |

Anti-references (what this must not look like):

-

## 10. Open questions for the human

-
