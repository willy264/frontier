# Text and copy (base layer)

The agent does not write copy that is not in the project's `text-copy.md`. If a string is missing, the agent drafts it with this guide, marks it `DRAFT`, and lists it for the human to approve. Store final copy in typed content modules (`src/content/*.ts`), apart from layout and animation code. [OWN: QuickBite]

Niche files override register and CTA case. Labels: [OWN] [DOC] [3P] [SYN] as elsewhere.

## 1. Voice

| Rule | Detail | Source |
|---|---|---|
| Plain English | Active voice, no jargon, no hype, no over-promising | [DOC: Mailchimp] |
| Describe, don't sell | Say what the thing does for this reader | [DOC: Anthropic skill] |
| Every word does one job | Cut anything that repeats the heading or the line above | [DOC: Anthropic skill] |
| Tone follows the reader's state | Calm for money and errors, warmer for success. When unsure, stay straight-faced. | [DOC: Mailchimp] |
| Honest about limits | "Preparing for focused pilots. Checks and integrations are agreed for each workflow." | [OWN: Ontiver] |
| Local and specific | "We started in Ile-Ife and we're just getting going." | [OWN: QuickBite] |
| Sentence case | Headings, buttons, labels. Uppercase only via CSS where the niche allows. | [DOC: Anthropic skill] |
| Spelling | Set British or US in the brief and keep it. Ontiver uses British. | [OWN] |
| CEO test | "Would our CEO actually say this?" | [3P: 925 Studios] |

## 2. Headlines

| Rule | Example |
|---|---|
| Contains a noun for what the product is or does | "Financial infrastructure for the internet." (Stripe) [3P] |
| Concrete claim over slogan | Good: "Large transactions, small fees, wide reach" (Trustly). Bad: "Designs That Speak. Brands That Shine." (Palletio) [3P] |
| 2–6 words per line | "Verify once. / Approve every share." [OWN] |
| Accent colour on a whole second line, never on one word | Line 2 "Approve every share." in `brand` [OWN] |

### Formulas

| Formula | Pattern | Example |
|---|---|---|
| Action + result | [Verb] [object]. [Verb] [object]. | "Verify once. / Approve every share." [OWN] |
| Number + promise | [Real number] [unit]. [What stops]. | "Three steps. No more repeat paperwork." [OWN] |
| Reader decides | You decide [what] | "You decide what leaves your hands." [OWN] |
| Plain-money (finance) | [Concrete figure] [vs named alternative] | Wise fee vs named bank [3P] |
| Question (playful) | [Sensory question] | "What are you craving?" [OWN] |
| Statement (studio) | [Point of view], lowercase allowed | "Most brands produce content. We prefer ideas." [3P: noth.in] |

### Conditional permissions for the house style

Your own signature moves also appear on published lists of AI tells. They are allowed only under these conditions.

| Move | Allowed when | Never |
|---|---|---|
| Fragment pair ("X. Y.") | H1 or H2 only, and each fragment carries a concrete claim | In body copy, as a closer, or as decoration |
| Accent colour in a headline | On the whole second line | On a single word |
| Uppercase eyebrow | Finance and playful (on); B2B (optional); only when it names the section | Studio (use bracketed labels); stacked "unnecessary labels" over content |
| Numbered steps (01/02/03) | The content is a real sequence | As decoration on unordered features |
| Arrow on a button | Primary CTA only, and only if it animates (slide-through) | On every link; trailing "→" in text |

[DOC: Anthropic skill] [SYN]

## 3. Subtitles and body

- One or two sentences under the headline: who it is for and what changes for them.
- 45–75 characters per line (the `--measure` cap handles layout).
- Body: short sentences, about 25 words or fewer. [SYN: GOV.UK convention, unverified]
- No em dash as a connector. Use a comma, colon or full stop.

## 4. CTAs

| Rule | Detail |
|---|---|
| Verb + object | 1–3 words: "Join the waitlist", "Explore restaurants", "Talk to our team" [OWN] |
| Never | "Submit", "OK", "Click here", "Learn more" alone [DOC: Atlassian] [3P: Duolingo] |
| One primary per section | Secondary is a text link or ghost button |
| Toast mirrors the verb | "Publish" → "Published"; "Save changes" → "Changes saved" [DOC: Anthropic skill] |
| Case | Sentence case by default. Gaming: uppercase ("PLAY FREE"). Studio: lowercase allowed ("book a call"). |
| B2B secondary | "Talk to sales" or "See pricing" [SYN] |

## 5. Microcopy

### 5.1 Errors [DOC: Atlassian]

| Part | Rule |
|---|---|
| Title (optional) | 3–4 words, sentence case, does not tell the user what to do |
| Body | 1–2 sentences: what happened, what to do, what happens if they don't. Don't repeat the title. |
| Unknown cause | Say something went wrong and give a next step. Do not guess. |
| Tone | No "sorry", no "please", no blame. Use "we", not "you". |
| Action | Specific 1–2 word verb, plus dismiss or cancel |
| Placement | Inline next to the field for validation |
| Order | Most likely fix first, then a fallback (contact support) |

| Situation | Before | After |
|---|---|---|
| Field validation | "Invalid input!" | "Enter a phone number with 11 digits, starting with 0." [SYN] |
| Network | "Oops! Something went wrong. Please try again." | "We couldn't load your orders. Check your connection and retry." [SYN] |
| Unknown | "Error 500" | "Something went wrong on our side. Retry, or contact support if it keeps happening." [SYN] |
| Finance | "Transaction failed." | "Transfer failed. Your ₦25,000 was not debited. Try again or use a different account." [SYN from finance notes] |
| Playful | "Wrong." | "Hmm, not quite." [3P: Duolingo] |

### 5.2 Empty states

One sentence on what will appear here, plus one primary action. [DOC: Anthropic skill]

| Before | After |
|---|---|
| "No data." | "Your saved addresses will appear here. Add an address." [SYN] |
| "Nothing to see here yet!" | "No invoices yet. Create your first invoice." [SYN] |

### 5.3 Loading

- Under about 1s: skeleton only, no text.
- Over about 1s: say what is loading. "Loading your statements" [SYN]
- Long or uncertain: give an expected time. Finance pending states must always give one. [SYN]
- Ontiver's page loader: "Preparing your Ontiver experience", with an 8s fail-safe that reveals the page anyway. [OWN]

### 5.4 Success

- Past tense of the action verb, plus the next step if there is one.
- "Changes saved." / "Invite sent to ada@example.com." [SYN]
- Finance KYC end state: "You're verified!" with clear next steps. [3P: Guardian Nigeria]

### 5.5 Forms

- Label every field. Placeholder is an example, not a label.
- Mark required (or optional) fields consistently.
- Say why sensitive data is needed at the moment you ask. [3P: Guardian Nigeria]
- Allow paste and password managers. [WCAG 3.3.8]

## 6. Landing-page section patterns

Typical order: hero → how it works → value or proof → FAQ → closing CTA → footer. About 6–9 sections. [OWN]

| Section | Copy slots | Rules |
|---|---|---|
| Hero | eyebrow, H1 (2 lines), subtitle, primary CTA, secondary link, one honest microcopy line | H1 names the thing. Microcopy states a real limit or a real fact. |
| How it works | eyebrow, H2, 3–4 steps (title + one sentence) | Numbers only because it is a sequence. "Pick your meal / Pay with Paystack / Track to your door" [OWN] |
| Value / promises | eyebrow, H2, 3 promise titles + one line each | Each promise is checkable. "Nothing leaves without your approval" [OWN] |
| Proof | figures with source, named customers, case-study metric headline | Precise figures (99.95%, 0.012%) not "200+". Every testimonial has a source. If no proof yet: show a dash and "Awaiting pilot results". [OWN proof policy] [3P: Trustly] |
| FAQ | intro column + "talk to us" link, 5–8 Q&As | Questions in the reader's words. Answers start with the answer. |
| Closing CTA | one question or statement, one CTA | "Ready to verify once and stay in control?" [OWN] |
| Footer | links, legal line, licence numbers (finance) | Claims register applies |
| Meta | title ≤60 chars, description ≤155 chars [SYN] | Name the product and the job |

## 7. Claims and proof register

Every claim of this kind needs a row before it ships.

| Claim text | Type (regulatory / metric / testimonial / partner) | Exact source | Owner approved |
|---|---|---|---|
| | | | |

- "Licensed", "insured", "secure", "guaranteed", "compliant": name the regulator, licence number or scheme. Never "bank-grade security". [SYN]
- No competitor or proposed-customer logos as filler. [OWN: Ontiver proof policy]
- Never invent names, numbers, quotes or citations. [DOC: blader/humanizer]

## 8. Humanizer list (AI-writing tells)

Based on blader/humanizer, which is built on Wikipedia's "Signs of AI writing" (primary page not fetched; secondary summary used). The first five patterns justify an edit on a single sighting. "Weak alone" patterns (dashes, qualifiers, hyphen pairs, passive voice, curly quotes) count only when several appear in one passage.

| Group | Flag or ban |
|---|---|
| Staging instead of stating | "It's not just X, it's Y"; dramatic one-line closers ("No prior. No nostalgia."); fake-deep sayings ("At its core…"); run-ups ("Let's dive in", "Honestly?"); arguing with nobody ("This isn't mainly about…") |
| Rhythm by rule | reflexive triads; repeated sentence openings; em dashes as the universal connector; stacked qualifiers; reflexive hyphen pairs ("high-quality"); passive voice and missing subjects |
| Inflation | delve, testament, tapestry, pivotal, landscape, foster, underscore, intricate, crucial, enhance, showcase; "marking a pivotal moment"; "The future looks bright"; -ing riders ("symbolizing…"); sales gush ("nestled within the breathtaking…"); "Experts believe…"; "serves as / boasts / features" for is or has; false ranges ("From intimate gatherings to global movements") |
| UI-copy additions [SYN] | seamless, elevate, unlock, leverage, robust, revolutionize, best-in-class, "Build the future of work", "Scale without limits", "In today's fast-paced world", hedging ("may help you") |
| Formatting by rule | decorative bold; bold "Label:" bullets; title-case or emoji headings; trailing "→"; curly quotes inside code |
| Chat leftovers | "Great question!"; "I hope this helps"; knowledge-limit disclaimers; heading repeated in the first sentence; "The table below…"; "Overall", "In conclusion" |

### Before / after

| Before | After | What changed |
|---|---|---|
| "Unlock seamless payments that elevate your business." | "Accept card and bank transfers. Get paid the next working day." [SYN example] | Removed 3 banned words; named the product and a fact |
| "It's not just an app, it's a movement." | "Order from 40 kitchens in Ile-Ife." [SYN example; number must come from the brief] | Removed staging; stated a checkable fact |
| "Fast. Secure. Reliable." | "Payouts in 24 hours. Licensed by the CBN (licence no. …)." [SYN example] | Replaced a triad with claims from the register |
| "We leverage cutting-edge AI to deliver best-in-class insights." | "We flag late invoices before they are due." [SYN example] | Verb the reader cares about |
| "Explore our robust suite of features →" | "See how approvals work" | Specific CTA, no trailing arrow |
| "Oops! Sorry, please try again." | "We couldn't save your draft. Retry, or copy your text first." | No sorry/please; next step |
| "Designs That Speak. Brands That Shine." | "Brand and product design for regulated fintechs in Lagos." [SYN example] | Fragment pair with no claim → a noun and an audience |

## 9. Copy checklist (run before every build)

- [ ] Every visible string exists in `text-copy.md` or is marked `DRAFT`.
- [ ] H1 contains a noun for what the product is or does.
- [ ] Every CTA is a verb + object, 1–3 words.
- [ ] Every error says what happened and what to do next, with no "sorry"/"please".
- [ ] Every empty state names what will appear plus one action.
- [ ] Every proof claim and testimonial has a row in the claims register.
- [ ] Humanizer scan: zero banned words; no "not X but Y"; no em dash connectors; no reflexive triads.
- [ ] Fragment pairs, accent lines, eyebrows, numbers and arrows meet the conditional permissions.
- [ ] Spelling locale is consistent.
- [ ] Alt text, meta title and meta description written.
