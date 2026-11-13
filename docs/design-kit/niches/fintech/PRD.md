# Fintech: PRD additions

Add these sections to `core/templates/PRD.md` after section 13. All are required for a fintech project.

## A. KYC tier map

CBN tier thresholds are not sourced in this kit. Look them up from CBN or a current compliance source before writing this table or any limit copy.

| Tier | What the user provides | What it unlocks (limits, features) | Source for the limits |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## B. Nigerian onboarding (BVN / NIN / selfie)

[3P: Guardian Nigeria, unless marked]

| Requirement | Rule |
|---|---|
| Ask progressively | Do not ask for everything upfront. One item per step, with the tier it unlocks. |
| Explain at the point of asking | Why BVN, why NIN, why a selfie, in one or two plain sentences each, on the screen where you ask. Users abandon at BVN because they fear a scam. |
| Plain words | "Verify your identity", not "Complete KYC". [SYN] |
| Selfie | Lighting guidance before capture; easy retry; no "blink twice" active liveness if avoidable (fails in poor light and network) [3P: DEV/Veris, vendor post] |
| Documents | Prefer scanning over typing; expect folded or laminated NIN slips [3P: DEV/Veris] |
| Devices | Entry-level Android, weak cameras, unstable internet, shared phones |
| Threats | Fake-agent signups, SIM-swap fraud, social engineering |
| Tone | Calm. No red warnings unless needed. |
| End state | "You're verified!" with clear next steps |
| Data handling | State NDPA basis and retention in plain words [SYN; NDPA requirements not sourced] |

Completion figure: a KYC vendor claims about 55 of 100 starters finish KYC. Not independently verified; do not quote it in product copy.

Onboarding step template:

| Step | Ask | Why-copy (draft) | Retry / fallback | Failure copy |
|---|---|---|---|---|
| 1 | Phone number | | | |
| 2 | BVN | | | |
| 3 | NIN | | | |
| 4 | Selfie | | | |
| 5 | Done | "You're verified!" + next steps | | |

## C. States matrix (finance)

Add these columns to the core states matrix for every money view:

| View | Pending (with expected time) | Reversed | Failed (did money move?) | Duplicate-submit guard |
|---|---|---|---|---|
| Transfer | | | | |
| Card payment | | | | |
| Bill payment | | | | |

Transaction status must survive app restart and poor network, so the user never fears a double debit. [SYN]

## D. Money formatting rules

| Rule | Value |
|---|---|
| Currency display | Symbol + amount (₦25,000.00); code where currencies mix (NGN) |
| Decimals | 2 in tables and receipts; 0 allowed in marketing hero figures |
| Separators | Thousands separators always |
| Negatives | Minus sign or parentheses |
| Alignment | Right-aligned, tabular numerals |
| Rounding | State the rule (banker's, half-up) and apply it in one place |

## E. Receipts and audit

| Requirement | Detail |
|---|---|
| Receipt contents | Reference, date/time with timezone, amount, fees, sender, beneficiary (resolved name), status |
| Share | As image or PDF, including to WhatsApp [SYN, verify with users] |
| Audit log | Who did what, when, from which device, for every money action and setting change |
| Retention | Per regulation (look up) |

## F. Beneficiary name enquiry

Show the resolved account name before the user confirms any transfer. Key anti-fraud trust pattern. [SYN]

## G. Low-data and offline

| Item | Rule |
|---|---|
| Page weight | Hero image budget and total JS budget written here |
| Offline | What still works (view last balance with timestamp), what queues, what is blocked |
| Fallbacks | USSD or "pay with transfer" virtual account where relevant [SYN, verify] |
| Support | WhatsApp or in-app chat visible on every error screen [SYN] |

## H. Trust surfaces (marketing)

| Item | Requirement |
|---|---|
| Hero | Plain-money copy with a real figure [3P: Wise via Utsubo] |
| Near the CTA | Regulator and protection named precisely (N26 names BaFin and €100,000) [3P: Utsubo] |
| Logos | Only alongside scale numbers [3P: Utsubo] |
| Security page | Linked from at least 3 surfaces [3P: Utsubo] |
| Footer | Licence name and number |
| Support | Availability cue (hours, channel) |

## I. Motion limits

At most one ambient and one user-triggered animation per marketing view. No animated balances in product. [3P: Utsubo] [SYN]
