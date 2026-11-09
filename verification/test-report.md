# Verification Report

Updated: 2026-11-08

## Real runs

- `pnpm sim`: passed. `SIMULATED`, 100 players, 200 epochs, supply range 8,613.88-9,962.74, NPC faucet capped at 160 per epoch.
- `pnpm test`: passed. 2 Vitest tests.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm build`: passed. Next.js 16.4.3 compiled and generated the static `/` route.
- `curl.exe -I --max-time 10 http://localhost:3000`: passed with HTTP 200 from the local dev server.

## Not yet run

- Rust contract tests and sandbox integration tests: contract does not exist yet.
- Testnet deployment and transaction evidence: blocked on a human-provided testnet account ID.
- Fresh-clone test: pending after contract and frontend wiring are complete.

