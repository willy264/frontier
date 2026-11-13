# Professional B2B: PRD additions

Add these sections to `core/templates/PRD.md` after section 13. [SYN unless marked]

## A. Roles and permissions matrix

| Action | Owner | Admin | Member | Viewer | Guest |
|---|---|---|---|---|---|
| View | | | | | |
| Create | | | | | |
| Edit | | | | | |
| Delete | | | | | |
| Export | | | | | |
| Manage billing | | | | | |
| Manage users | | | | | |

Every disabled action explains why (role, plan or state) in a tooltip or inline note.

## B. Audit log

| Field | Required |
|---|---|
| Actor | yes |
| Action | yes |
| Object | yes |
| Before / after | for edits |
| Timestamp with timezone | yes |
| IP / device | if security-relevant |
| Export | CSV |

## C. Tables (states per table)

| Table | Empty | Loading | Partial | Error | No results (filtered) | Permission denied |
|---|---|---|---|---|---|---|
| | | | | | | |

Also specify per table: default sort, sticky header, column visibility, density toggle (32–40px rows), pagination or virtual scroll, selection model.

## D. Bulk actions

| Action | Max items | Confirmation | Undo | Progress feedback |
|---|---|---|---|---|
| | | | | |

## E. Keyboard shortcuts

| Shortcut | Action | Scope | Discoverable where |
|---|---|---|---|
| `?` | Show shortcuts | global | |
| `/` or `⌘K` | Search / command menu | global | |

Shortcuts never replace visible controls.

## F. Export

| Format | Contents | Limits | Delivery (download / email) |
|---|---|---|---|
| CSV | | | |
| PDF | | | |

## G. SSO / SAML and security

| Item | Requirement |
|---|---|
| SSO providers | |
| SAML / SCIM | |
| 2FA | |
| Session length | |
| Security page | Linked from footer, pricing and login |

## H. Marketing proof

| Item | Requirement |
|---|---|
| Case studies | Headline is a metric with a source |
| Logos | Only with a scale number or a named outcome [3P: Utsubo] |
| Compliance strip | Named standards only if certified |
| Pricing | 3–4 tiers; recommended tier marked once; no "Contact us" on every tier |
