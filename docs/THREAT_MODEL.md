# FRONTIER Threat Model

| Threat | Control |
|---|---|
| Front-running destination | Commit destination before departure; reveal only after travel. |
| Late ambush commitment | Record departure block and require raid commitment earlier than it. |
| Late ambush reveal | Close reveal window before `arrive` opens. |
| Session key abuse | Scope receiver, explicit method list, and finite allowance. |
| Wash trading | Fees, capped NPC demand, visible event logs, and per-account limits. |
| Port treasury theft on transfer | Transfer ownership and port state in one contract call. |
| Randomness manipulation | Use random seed only for low-value storms/map reshuffles and document the limitation. |

