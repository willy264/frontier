# Demo script

The completed narrated video is at https://frontier-willy264s-projects.vercel.app/demo/index.html. Use `voiceover-script.md` for the exact narration and `video-plan.md` for chapter timings.

For a live presentation:

1. Open the public app and connect a testnet wallet that the wallet list offers (for example Meteor; MyNearWallet and HOT are not listed on testnet). Approve the game key, then register a fresh captain for 1,000 non-redeemable CRED.
2. At Bitcoin Isle, buy a good at the live quote. Each trade pays at least 30 CRED in fees, so small purchases can quote zero.
3. Build a sloop. Under "Hire or offer an escort", choose "Show open offers" and hire one; the wallet asks you to approve the hire.
4. Choose a route, load the cargo, seal the destination and sail. Save the hidden-orders backup, wait for the countdown, then arrive. A rival ambush requires another captain; the guided tutorial does not create one.
5. Sell where your ship docked. No profit is guaranteed.
6. Open the Ambush tab, choose a route and window, set the ambush and spring it before convoys reach harbour. Open Economy to inspect current totals.

For a reproducible rival-assisted capture use `scripts/record-redesign.mjs`, documented in `docs/VIDEO.md`. It performs real testnet actions through the UI while scripted escort and rival captains supply the escort offer and the ambush. Public account IDs and explorer links can be shown; private credentials and secret backups must remain private.
