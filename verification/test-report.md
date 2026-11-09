# Verification Report

Updated: 2026-11-09

## Real runs

- `pnpm sim`: passed. `SIMULATED`, 100 players, 200 epochs, supply range 8,613.88-9,962.74, NPC faucet capped at 160 per epoch.
- `pnpm test`: passed. 2 Vitest tests.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm build`: passed. Next.js 16.4.3 compiled and generated the static `/` route.
- `cargo check --target wasm32-unknown-unknown`: passed.
- `cargo build --target wasm32-unknown-unknown --release --locked`: passed.
- `cargo test --jobs 1`: passed. 4 Rust tests, including the proptest.
- WSL `cargo test --test sandbox_round -- --ignored --nocapture`: failed during `cargo near` ABI generation because public DTOs lack `JsonSchema`; the ignored test body did not run.
- Testnet deploy transaction succeeded: `BUfZUEo3Y9UvrCYwcm9Hehc6Uphn3b3W9NaNWCDxoL8G`.
- Testnet initialization failed with a WebAssembly `unreachable` trap; see `results/deploy-testnet.json`.

## Not yet run

- Full cargo-near ABI build, sandbox acceptance assertions, and initialized testnet contract: pending the `JsonSchema`/WASM fix.
- Fresh-clone test: pending after contract and frontend wiring are complete.

