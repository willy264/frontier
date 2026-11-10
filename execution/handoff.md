# FRONTIER Handoff

Exact next action on resume: review the final diff and run the local CI commands once more, then inspect the frontend in a browser. Do not add a remote or publish anything without human instruction.

Current exact state:

- WSL `cargo near build non-reproducible-wasm --skip-rust-version-check` passes using `#[near(serializers = [json, borsh])]` DTO annotations.
- The sandbox acceptance test passes: three players, escort, ambush, arrival, port sale, and forbidden method on a restricted key.
- The contract unit suite passes 37 tests single-threaded, plus the proptest.
- Testnet world `world.frontier-uiriamuzu.testnet` was recreated and initialized from the cargo-near artifact. Latest deployment evidence is committed in `results/deploy-testnet.json`.
- `pnpm demo:round` passed and wrote `results/round-2026-11-10T08-11-25-715Z.json` with live explorer links.
- Frontend now reads testnet port/economy views, submits selected contract calls, and uses NEAR Connect with a session-only function-call key.
- CI, README, X draft, submission JSON, video plan, and fresh-clone verification are committed or staged for the next checkpoint commit.

Open questions/blockers: CI cannot be observed remotely because no git remote/push is authorized. The frontend needs a browser-level visual check. Submission still needs a public repo URL, hosted demo/video, X post, and human form submission. Mainnet remains out of scope.

Platform note: Windows cannot run near-workspaces 0.24 directly; WSL2 Ubuntu is the supported sandbox runtime.
