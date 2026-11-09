# FRONTIER Handoff

Exact next action on resume: add `schemars::JsonSchema` derives compatible with `near-sdk` ABI generation to every public contract DTO used by `#[near]`, run `cargo near build non-reproducible-wasm --skip-rust-version-check` in WSL, redeploy and initialize `world.frontier-uiriamuzu.testnet`, then rerun the ignored sandbox test.

Current exact state:

- Local contract native tests pass: 4 tests, including the proptest.
- Windows release WASM build passes and was deployed to testnet in transaction `BUfZUEo3Y9UvrCYwcm9Hehc6Uphn3b3W9NaNWCDxoL8G`.
- `new` on the deployed contract failed with `WebAssembly trap: An unreachable opcode was executed`; no valid initialized-contract evidence exists yet.
- Testnet accounts exist locally under the user credential directory only: root `frontier-uiriamuzu.testnet`, world, and p1-p4. No credentials were copied into the repository.
- WSL `cargo-near` 0.22.0 is now installed. The sandbox test reached execution but failed during ABI generation because public DTO types do not implement `JsonSchema`.
- The current RPC scripts compile against `near-api-js` 7.4.0. The demo script has only been partially exercised and must not be presented as a complete round.
- Next frontend work remains intentionally paused until contract steps 1-4 pass.

Open questions/blockers: decide whether to add `JsonSchema` derives or disable ABI generation for DTOs; after that, determine why the already-deployed Windows-built WASM traps on `new` and replace it with the cargo-near-built artifact. No mainnet action is authorized.

Platform fallback: Windows cannot run near-workspaces 0.24 directly; WSL2 Ubuntu is available and is the supported sandbox runtime. Mainnet remains out of scope and requires explicit approval.

