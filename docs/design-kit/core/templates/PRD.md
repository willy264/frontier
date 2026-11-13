# PRD: <project name>

Owner: | Status: draft / approved | Last updated:

The niche file (`niches/<niche>/PRD.md`) adds required sections. Copy them in below section 13.

## 1. Problem

What is wrong today, for whom, and how we know.

## 2. Users

| Segment | Job to be done | Current workaround | Device / network |
|---|---|---|---|
| | | | |

## 3. Goals and non-goals

| Goals | Non-goals |
|---|---|
| | |

## 4. Success metrics

| Metric | Baseline | Target | How measured |
|---|---|---|---|
| | | | |

## 5. Sitemap and IA

```
/
├── /<page>
│   └── /<sub-page>
└── /legal/…
```

Navigation items (max 5–7 top level):

## 6. Key user flows

For each flow: entry → steps → success; and every failure branch.

### Flow: <name>

| Step | Screen | User action | System response | Failure branch |
|---|---|---|---|---|
| 1 | | | | |

## 7. Feature requirements

| ID | Requirement | Priority (must/should/could) | Acceptance criteria |
|---|---|---|---|
| F1 | | | |

## 8. States matrix

Every data-bearing view gets a row. Blank cells are not allowed; write "n/a" with a reason.

| View | Empty | Loading | Partial | Error | Pending | Success | Offline |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## 9. Content dependencies

| Content | Owner | Status | Due |
|---|---|---|---|
| Copy (`text-copy.md`) | | | |
| Photography | | | |
| Product screenshots | | | |
| Legal text | | | |

## 10. Proof inventory

| Item | Verified | Source | Placeholder if unverified |
|---|---|---|---|
| | | | "—" + "Awaiting results" |

No competitor or proposed-customer logos as filler. Every testimonial has a named, consenting source. [OWN: Ontiver proof policy]

## 11. Legal and regulatory claims

| Claim | Exact wording | Authority / licence no. | Approved by |
|---|---|---|---|
| | | | |

## 12. Analytics events

| Event | Trigger | Properties | Purpose |
|---|---|---|---|
| | | | |

## 13. Technical decisions

| Decision | Choice | Reason |
|---|---|---|
| Motion engine | CSS / Motion / GSAP | |
| Motion + GSAP together? | No / Yes because… | |
| Smooth scroll | Lenis on marketing only / none | |
| Paid licences (Pro tiers, fonts) | | |
| Dark mode | | |

## 14. Release checklist

- [ ] All QA gates in `core/qa-gates.md` signed off
- [ ] Copy approved; no `DRAFT` strings left
- [ ] Claims register approved
- [ ] Licence register complete
- [ ] Analytics events firing
- [ ] 404, 500 and offline pages built
- [ ] Meta title, description, Open Graph image
- [ ] Favicon and app icons
- [ ] Legal pages linked
