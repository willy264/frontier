# Verification Report

Updated: 2026-11-10

## Real runs

- `pnpm sim`: passed. `SIMULATED`, 100 players, 200 epochs, supply range 8,613.88-9,962.74, NPC faucet capped at 160 per epoch.
- `pnpm test`: passed. 2 Vitest tests.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec next build apps/game --webpack`: passed. Frontend compiles with NEAR Connect and contract RPC wiring.
- `cargo check --target wasm32-unknown-unknown`: passed.
- `cargo build --target wasm32-unknown-unknown --release --locked`: passed.
- `cargo test -- --test-threads=1`: passed. 37 Rust tests, one per current error code, ambush timing edges, and the proptest.
- WSL `cargo near build non-reproducible-wasm --skip-rust-version-check`: passed. ABI and optimized WASM produced at `contracts/world/target/near/frontier_world.wasm`.
- WSL `cargo test --test sandbox_round -- --ignored --nocapture`: passed. Three-player round, escort, ambush, arrival, port sale, and restricted-key rejection.
- Testnet deployment and initialization passed. Latest evidence is in `results/deploy-testnet.json`.
- `pnpm demo:round`: passed. Latest full evidence is `results/round-2026-11-10T08-11-25-715Z.json`.

## Not yet run

- Fresh clone: passed. Frozen pnpm install, tests, typecheck, and webpack production build.
- GitHub CI has been added but cannot be observed as green until a remote is configured; no remote or push was authorized.
- Hosted frontend, recorded video, X post, and form submission remain intentionally human-owned actions.

