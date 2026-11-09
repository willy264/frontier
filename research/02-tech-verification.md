# FRONTIER Technical Verification

## Session key

- **VERIFIED:** A NEAR function-call access key is scoped to a receiver account, a list of method names, and an allowance. An empty method list means all methods, so FRONTIER must use an explicit allow-list.
- **DECISION:** The game-only key will allow only gameplay methods such as `buy`, `sell`, `depart`, `arrive`, `commit_ambush`, `reveal_ambush`, `hire_escort`, and `tick_epoch`. It will not allow account transfer methods or arbitrary contract calls.
- **UNKNOWN:** The exact near-connect session-key UX must be confirmed against the selected wallet before claiming one-click onboarding. Until then, the UI describes this as planned/verified only after a real wallet test.

## Token standards

- **VERIFIED:** NEP-245 supports batch transfers and standard events, which fits ships and goods.
- **DECISION:** The MVP keeps port inventories and treasury state in the world contract keyed by port token ID. This makes NFT transfer atomic with treasury transfer without the complexity of sub-accounts.

## Randomness

- **VERIFIED:** `env::random_seed()` is available to a NEAR contract.
- **DECISION:** Use it only for low-stakes storm/map reshuffle presentation in the MVP. It is not used for valuable hidden decisions and the validator-influence limitation is documented.

## NEAR Intents

- **VERIFIED:** 1Click uses quote -> deposit -> status flow and has no testnet; live deposits require explicit human approval.
- **DECISION:** Keep the Season Pass integration out of the core demo and show a labelled optional integration state until a human approves a tiny mainnet transaction.

## Sources

- Function-call permission reference: https://docs.rs/near-primitives-v01/latest/near_primitives_v01/account/struct.FunctionCallPermission.html
- NEP-245: https://github.com/near/NEPs/blob/master/neps/nep-0245.md
- NEP-171: https://github.com/near/NEPs/blob/master/neps/nep-0171.md
- 1Click lifecycle: https://github.com/near/agent-skills/blob/main/skills/near-intents/references/concepts.md
- Random seed: https://docs.rs/near-sdk/latest/near_sdk/env/fn.random_seed.html

