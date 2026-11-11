// Real testnet UI recording. Install optional tools into ignored data/video-tools.
// Full-access credentials stay in Node; the page receives only its own scoped key.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chromium } from '../data/video-tools/node_modules/playwright/index.mjs';
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner } from 'near-api-js';

const site = 'https://frontier-willy264s-projects.vercel.app';
const world = 'world.frontier-final.testnet';
const captain = process.env.FRONTIER_VIDEO_ACCOUNT ?? `video${Date.now()}.frontier-final.testnet`;
assert(captain.endsWith('.testnet'));
const out = path.resolve('data/video');
await fs.mkdir(out, { recursive: true });
const provider = new JsonRpcProvider({ url: 'https://rpc.testnet.fastnear.com' });
async function account(id) {
  assert(id.endsWith('.testnet'));
  const credential = JSON.parse(await fs.readFile(path.join(os.homedir(), '.near-credentials/testnet', `${id}.json`), 'utf8'));
  return new Account(id, provider, KeyPairSigner.fromSecretKey(credential.private_key));
}
const evidence = [];
if (!process.env.FRONTIER_VIDEO_ACCOUNT) {
  const root = await account('frontier-final.testnet');
  const key = KeyPair.fromRandom('ed25519');
  // Save recoverable credentials outside the repository before funding the account.
  await fs.writeFile(path.join(os.homedir(), '.near-credentials/testnet', `${captain}.json`), JSON.stringify({ account_id: captain, public_key: key.getPublicKey().toString(), private_key: key.toString() }), { flag: 'wx', mode: 0o600 });
  const created = await root.createAccount({ newAccountId: captain, publicKey: key.getPublicKey(), nearToTransfer: 600000000000000000000000n });
  saveReceipt(created, 'recording setup: fresh testnet account');
  console.log(`Created fresh testnet captain: ${captain}`);
}
const owner = await account(captain);
const rival = await account('p3.frontier-final.testnet');
const sessions = [];
const scenes = [];
const view = (method, args = {}) => provider.callFunction({ contractId: world, method, args, blockQuery: { finality: 'final' } });
const delay = (ms) => new Promise(r => setTimeout(r, ms));
const hash = (text) => Array.from(createHash('sha256').update(text).digest());
async function waitView(method, args, ready) {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    const state = await view(method, args);
    if (ready(state)) return state;
    await delay(1200);
  }
  throw new Error(`Final state did not catch up: ${method}`);
}
function saveReceipt(result, source) {
  if (!result?.transaction?.hash) return;
  if (evidence.some(e => e.tx === result.transaction.hash)) return;
  const logs = result.receipts_outcome.flatMap(r => r.outcome.logs).filter(l => l.startsWith('EVENT_JSON:'));
  evidence.push({ source, tx: result.transaction.hash, explorer: `https://testnet.nearblocks.io/txns/${result.transaction.hash}`, signer: result.transaction.signer_id, receiver: result.transaction.receiver_id, status: result.status, events: logs.map(l => JSON.parse(l.slice(11))) });
}
async function call(actor, methodName, args) {
  const result = await actor.callFunctionRaw({ contractId: world, methodName, args, gas: 100000000000000n, deposit: 0n });
  saveReceipt(result, `scripted rival: ${methodName}`);
  return result;
}
async function waitHeight(target) {
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    if ((await provider.viewBlock({ finality: 'final' })).header.height >= target) return;
    await delay(1200);
  }
  throw new Error('Testnet height wait timed out');
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, recordVideo: { dir: out, size: { width: 1600, height: 900 } }, acceptDownloads: true });
await context.exposeBinding('__frontierRecordingLogin', async (_, request) => {
  assert.equal(request.network, 'testnet');
  const key = request.addFunctionCallKey;
  if (key) {
    assert.equal(key.contractId, world);
    assert.equal(key.allowMethods.anyMethod, false);
    const result = await owner.addFunctionCallAccessKey({ publicKey: key.publicKey, contractId: world, methodNames: key.allowMethods.methodNames, allowance: 1000000000000000000000000n });
    sessions.push(key.publicKey);
    saveReceipt(result, 'recording wallet: scoped key approval');
  }
  return [{ accountId: captain }];
});
await context.addInitScript(({ site, captain }) => {
  if (location.origin !== site) return;
  let signedIn = false;
  window.addEventListener('near-selector-ready', () => {
    window.dispatchEvent(new CustomEvent('near-wallet-injected', { detail: {
      manifest: { id: 'frontier-recording', name: 'Recording wallet (testnet)', type: 'injected', version: '1', website: site, icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="%23152936"/><text x="15" y="36" fill="white" font-size="32">F</text></svg>', features: { testnet: true, signInWithFunctionCallKey: true }, permissions: {} },
      getAccounts: async () => signedIn ? [{ accountId: captain }] : [],
      signIn: async (request) => { const result = await window.__frontierRecordingLogin(request); signedIn = true; return result; },
      signOut: async () => { signedIn = false; },
    } }));
  });
}, { site, captain });

let page;
let started;
const begin = (id, title, narration) => {
  if (scenes.length) scenes.at(-1).end = (Date.now() - started) / 1000;
  scenes.push({ id, title, narration, start: (Date.now() - started) / 1000 });
  console.log(`Recording: ${id}`);
};
async function click(name, expected) {
  await page.getByRole('button', { name, exact: true }).click();
  if (expected) await page.waitForFunction(text => document.querySelector('.event-line')?.textContent.includes(text), expected, { timeout: 65000 });
  await delay(800);
}
async function show(selector) {
  await page.locator(selector).evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  await delay(1000);
}

try {
  const initial = await view('get_player', { account_id: captain });
  assert(!initial, 'Use a fresh testnet player for this recording.');
  started = Date.now();
  page = await context.newPage();
  page.on('response', async response => {
    if (!response.url().includes('rpc.testnet')) return;
    try { saveReceipt((await response.json()).result, 'browser UI'); } catch { /* unrelated views */ }
  });
  await page.goto(site, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => !document.querySelector('.market-card')?.textContent.includes('loading testnet state'));
  begin('intro', 'FRONTIER / REAL TESTNET GAMEPLAY', 'Trade goods. Choose your route. Risk an ambush. This is Frontier, a strategy and trading game on NEAR testnet. These are real transactions in the deployed app.');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(out, 'poster.png') });
  await delay(6000);

  begin('login', '01 / CONNECT AND REGISTER', 'For this recording, an automated testnet wallet approves a game-only key. The key is restricted to this contract. Registering gives our new captain one thousand CRED, the non-redeemable game currency.');
  await click('Connect wallet');
  await page.getByText('Recording wallet (testnet)', { exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.session')?.textContent.includes('GAME KEY READY'));
  await click('Register player', 'Captain registered');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(2000);

  begin('market', '02 / BUY CARGO AND BUILD A SHIP', 'The port market reads its reserves and owner fee from the contract. We spend three hundred CRED on Hashpower, then build a sloop. Every purchase changes the market and our on-chain inventory.');
  await page.getByLabel('Buy CRED', { exact: true }).fill('300');
  await click('Buy at quote', 'Bought');
  const afterBuy = await waitView('get_player', { account_id: captain }, p => p?.goods[0] > 0);
  const cargoAmount = Math.min(50, afterBuy.goods[0]);
  await click('Build a sloop', 'Sloop built');
  await page.waitForFunction(() => document.querySelector('.fleet-card input')?.value !== '', undefined, { timeout: 65000 });
  const shipId = Number(await page.getByLabel('Ship ID', { exact: true }).inputValue());
  assert(shipId > 0);
  await show('.fleet-card');
  await delay(1500);

  begin('depart', '03 / SEAL THE DESTINATION', `We load ${cargoAmount} units of Hashpower and seal the destination with a browser-generated salt. A scripted rival has placed a real ambush on this route. The backup download preserves the secret needed for arrival.`);
  await page.getByLabel('Hashpower', { exact: true }).fill(String(cargoAmount));
  const window = (await provider.viewBlock({ finality: 'final' })).header.height + 12;
  const salt = `video-rival-${Date.now()}`;
  const commit = hash(`1:${window}:${salt}:${rival.accountId}`);
  await call(rival, 'commit_ambush', { window_start: window, commit, stake: '10' });
  await call(rival, 'reveal_ambush', { commit_id: commit, route_id: 1, salt });
  await waitHeight(window);
  await click('Depart with sealed destination', 'departed from');
  const ship = await waitView('get_ship', { ship_id: shipId }, s => s?.origin_port === 1);
  assert(ship.departed_at <= window + 20, 'Departure missed scripted ambush window');
  assert.equal(ship.origin_port, 1);
  const downloadPromise = page.waitForEvent('download');
  await click('Download salt backup');
  const download = await downloadPromise;
  await download.saveAs(path.join(out, 'private-salt-backup.json'));
  await show('.secret-card');

  begin('arrive', '04 / REVEAL AND RESOLVE', 'Once the travel time passes, we reveal the destination. The contract validates the route and resolves the ambush. The result feed reports the raid and cargo loss. These outcomes come from contract events.');
  await waitHeight(ship.departed_at + 12);
  await click('Reveal destination / arrive', 'arrived at');
  await show('.feed-card');
  await delay(3000);
  await waitView('get_ship', { ship_id: shipId }, s => s?.origin_port === null);
  const afterArrival = await view('get_player', { account_id: captain });
  assert(afterArrival.goods[0] < afterBuy.goods[0], 'Expected real cargo loss from scripted rival');
  await page.screenshot({ path: path.join(out, 'arrival.png') });

  begin('sell', '05 / SELL THE SURVIVING GOODS', 'Back at the market panel, we sell the surviving Hashpower at the current quote. The CRED balance changes again. This run shows the cost of fees and a raid; it does not promise a trading profit.');
  await page.getByLabel('Sell goods', { exact: true }).fill(String(afterArrival.goods[0]));
  await click('Sell at quote', 'Sold');
  await show('.market-card');
  await delay(2200);

  begin('ambush', '06 / COMMIT AND REVEAL AN AMBUSH', 'A player can also become a raider. We choose another route, stake ten CRED, save the salt, and reveal the ambush. The browser exposes the reveal control and keeps a downloadable backup.');
  await page.locator('.raid-card select').selectOption('3');
  await click('Commit ambush and save salt', 'Ambush committed');
  await show('.secret-card');
  await click('Reveal ambush', 'Ambush revealed');
  await show('.feed-card');
  await delay(2000);

  begin('economy', '07 / INSPECT THE ON-CHAIN ECONOMY', 'The economy panel reads live supply, faucet, and spoilage totals. Ports collect trading fees for their owners. This is a testnet MVP; cross-chain Intents settlement and production season rollover are future work.');
  await page.evaluate(() => window.scrollTo(0, 0));
  await click('Economy');
  await show('.economy');
  await delay(5000);
  begin('outro', 'PLAY FRONTIER / BUILT AT NEAR HACKATHON', 'Try Frontier at the link on screen. The repository includes the contract, tests, and transaction evidence. Built at NEAR Hackathon. Synthetic narration; real testnet gameplay.');
  await click('World');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(5000);
  scenes.at(-1).end = (Date.now() - started) / 1000;
  const finalPlayer = await view('get_player', { account_id: captain });
  await fs.writeFile(path.join(out, 'capture.json'), JSON.stringify({ site, world, captain, scenes, evidence, initial, afterBuy, afterArrival, finalPlayer, recordedAt: new Date().toISOString(), disclosures: ['Automated injected recording wallet uses a real contract-restricted key.', 'All contract calls and state reads use live testnet; no mocked responses.', 'Rival ambush is rule-based scripting, not autonomous AI.', 'Market sale uses the selected port; this is not proof of profitable arbitrage.', 'No retail wallet-provider login walkthrough is claimed.'] }, null, 2));
} catch (error) {
  if (page) {
    console.error('UI result:', await page.locator('.event-line').innerText().catch(() => 'unavailable'));
    const secrets = await page.evaluate(() => localStorage.getItem('frontier-commit-secrets')).catch(() => null);
    if (secrets) await fs.writeFile(path.join(out, 'private-salt-backup.json'), secrets);
    await page.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {});
  }
  throw error;
} finally {
  if (scenes.length && !scenes.at(-1).end) scenes.at(-1).end = (Date.now() - started) / 1000;
  await context.close();
  if (page) {
    const raw = await page.video().path();
    await fs.copyFile(raw, path.join(out, 'capture.webm'));
  }
  await browser.close();
  for (const publicKey of sessions) {
    try { await owner.deleteKey(publicKey); } catch { console.log('Recording key cleanup requires review.'); }
  }
  await fs.writeFile(path.join(out, 'partial-public-evidence.json'), JSON.stringify({ scenes, evidence }, null, 2));
}
console.log('Real testnet recording complete: data/video/capture.json');
