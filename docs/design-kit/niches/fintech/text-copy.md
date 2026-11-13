# Fintech: copy overrides

Applies on top of `core/text-copy.md`.

## 1. Register

Plain money, real figures, named regulators. Calm, never alarmist. [SYN from 3P]

| Do | Don't |
|---|---|
| "Send ₦50,000 to any Nigerian bank for ₦<fee>." (fee from the published schedule) | "Fast, secure, seamless transfers" |
| "Licensed by the CBN as a <licence type>, licence no. …" | "Bank-grade security" |
| "Deposits insured by NDIC up to ₦…" (only if true, with the exact figure) | "Your money is 100% safe" |
| "Verify your identity" | "Complete KYC" |
| Expected times on pending states | "Processing…" with no time |

Never write "guaranteed returns". [SYN: SEC Nigeria / consumer-protection risk]

## 2. Claims register (required)

Every "licensed", "insured", "secure", "regulated", "guaranteed" or "compliant" claim has a row in `text-copy.md` §7 with the authority and licence number. If there is no source, the claim does not ship.

## 3. Hero

| Slot | Rule | Example (Ontiver, identity) [OWN] |
|---|---|---|
| Eyebrow | Names the audience or job | "Your identity. Your credentials. Your choice." |
| H1 | Action + result, fragment pair allowed if each carries a claim | "Verify once. / Approve every share." |
| Subtitle | What changes, concretely | "Create one verified identity, then decide exactly what gets shared, with whom, and for how long." |
| Figure | A real number from the product (fee, time, limit) [3P: Wise pattern] | |
| Regulator line | Near the CTA | |
| Microcopy | Honest limit | "Preparing for focused pilots. Checks and integrations are agreed for each workflow." |

Note: Ontiver's live subtitle ends with an em dash clause ("— instead of uploading the same documents everywhere"). Rewrite with a comma or a second sentence in new projects.

## 4. CTAs

| Context | Examples |
|---|---|
| Consumer primary | "Open an account", "Send money", "Join the waitlist" |
| B2B-facing primary | "Get a demo", "Start sandbox" [OWN] |
| Secondary | "See pricing", "Talk to sales", "How we protect your data" [OWN] |

Ontiver uses Title Case strings set uppercase by CSS ("Join the Waitlist") [OWN]. New projects: sentence case in the content file; uppercase only via CSS if the design calls for it.

## 5. Microcopy

| Situation | Copy pattern | Example [SYN] |
|---|---|---|
| Failed transfer | What happened + did money move + next step | "Transfer failed. Your ₦25,000 was not debited. Try again or use a different account." |
| Pending | Status + expected time + what to do if late | "Your transfer is on its way. Most arrive within <n> minutes. If it hasn't arrived by <time>, contact support." (times from the product SLA) |
| Reversed | What happened + where the money is now | "This transfer was reversed. ₦25,000 is back in your balance." |
| Name enquiry | Show resolved name; ask to confirm | "Sending to ADEBAYO OLUWASEUN · GTBank · 0123456789. Is this right?" |
| BVN ask | Why + what we don't do | "We use your BVN to confirm your name and date of birth with your bank. We can't move money with it." (check claim with compliance) |
| NIN ask | Why + tier | "Your NIN lets you send up to ₦… a day." (limit from tier map) |
| Selfie | Guidance + retry | "Face a window or a light. Remove glasses if they reflect. You can retake it." |
| Selfie failed | Calm, specific | "We couldn't see your face clearly. Try again with more light in front of you." |
| Verified | Celebrate + next step | "You're verified! Add money to start sending." |
| Empty transactions | What will appear + action | "Your transactions will show here. Add money to get started." |
| Session timeout | What happened + safe state | "You were signed out after <n> minutes of inactivity. Your money is safe. Sign in again." (timeout from product) |

No "sorry", no "please", no red-alarm language on routine verification steps. [DOC: Atlassian] [3P: Guardian Nigeria]

## 6. Locale

- Nigeria: ₦ with a font that has the glyph; "NGN" where currencies mix.
- Dates: state the format (e.g. 13 Nov 2026) and timezone on receipts.
- British spelling if the brand uses it (Ontiver does).
