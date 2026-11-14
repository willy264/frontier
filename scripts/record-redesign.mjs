// Real testnet UI round for the redesigned FRONTIER app.
// Full-access credentials stay in Node; the page receives only its scoped game key.
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { chromium } from "playwright";
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner } from "near-api-js";

const siteUrl = new URL(process.env.FRONTIER_VIDEO_SITE ?? "https://frontier-jkp1mo85m-willy264s-projects.vercel.app");
const site = siteUrl.origin;
const world = process.env.FRONTIER_WORLD_ACCOUNT ?? "world3.world3.testnet";
const rootId = process.env.FRONTIER_ROOT_ACCOUNT ?? "world3.testnet";
const rpc = process.env.FRONTIER_RPC_URL ?? "https://rpc.testnet.near.org";
const deploymentCommit = process.env.FRONTIER_DEPLOYMENT_COMMIT ?? "374da82";
const captureVideo = process.env.FRONTIER_VIDEO_CAPTURE !== "0";
const out = path.resolve(process.env.FRONTIER_VIDEO_OUT ?? "data/redesign-video");
const resultFile = path.resolve(process.env.FRONTIER_ROUND_RESULT ?? "results/preview-round.json");
const credentialsDir = path.join(os.homedir(), ".near-credentials", "testnet");
const provider = new JsonRpcProvider({ url: rpc });
const gas = 100_000_000_000_000n;
const evidence = [];
const seenTransactions = new Set();
const scenes = [];
const sessionKeys = [];
const keyCleanup = [];
const accessibility = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const explorer = tx => `https://testnet.nearblocks.io/txns/${tx}`;
const hash = text => Array.from(createHash("sha256").update(text).digest());
const accountSuffix = `${Date.now().toString(36)}${randomBytes(2).toString("hex")}`;
const captainId = process.env.FRONTIER_VIDEO_ACCOUNT ?? `cap${accountSuffix}.${rootId}`;
const escortId = process.env.FRONTIER_ESCORT_ACCOUNT ?? `esc${accountSuffix}.${rootId}`;
const rivalId = process.env.FRONTIER_RIVAL_ACCOUNT ?? `riv${accountSuffix}.${rootId}`;
const existingOfferId = Number(process.env.FRONTIER_ESCORT_OFFER_ID ?? 0);
// Each round moves both markets, so the cargo good and spend are configurable to keep the sale above zero.
const goods = ["Hashpower", "Liquidity", "Blockspace"];
const goodIndex = goods.indexOf(process.env.FRONTIER_ROUND_GOOD ?? "Liquidity");
const goodName = goods[goodIndex];
const spendCred = Number(process.env.FRONTIER_ROUND_SPEND ?? 400);
// "own-key" emulates wallets such as Meteor that add their own key at sign-in and ignore the app's key.
const walletEmulation = process.env.FRONTIER_WALLET_EMULATION ?? "requested-key";
let walletKeyPair = null;
let walletSilentCalls = 0;
const gameKeyMethods = ["register_player", "buy", "sell", "build_ship", "depart", "arrive", "commit_ambush", "reveal_ambush", "offer_escort", "set_fee"];
assert(["requested-key", "own-key"].includes(walletEmulation), "FRONTIER_WALLET_EMULATION must be requested-key or own-key");
assert(goodIndex >= 0 && Number.isSafeInteger(spendCred) && spendCred > 0 && spendCred <= 700, "FRONTIER_ROUND_GOOD or FRONTIER_ROUND_SPEND is invalid");

for (const accountId of [rootId, world, captainId, escortId, rivalId]) assert(accountId.endsWith(".testnet"), `Refusing non-testnet account: ${accountId}`);
await fs.mkdir(out, { recursive: true });
if (process.env.FRONTIER_SETUP_EVIDENCE) {
  const prior = JSON.parse(await fs.readFile(path.resolve(process.env.FRONTIER_SETUP_EVIDENCE), "utf8"));
  for (const entry of prior.evidence ?? []) {
    if (![escortId, rivalId].includes(entry.signer) || entry.receiver !== world || !entry.tx) continue;
    seenTransactions.add(entry.tx);
    evidence.push({ ...entry, source: `reused ${String(entry.source).replace(/^(reused )+/, "")}` });
  }
}

async function account(accountId) {
  const credential = JSON.parse(await fs.readFile(path.join(credentialsDir, `${accountId}.json`), "utf8"));
  if (credential.account_id) assert.equal(credential.account_id, accountId);
  assert.equal(typeof credential.private_key, "string", `Credential has no private key: ${accountId}`);
  return new Account(accountId, provider, KeyPairSigner.fromSecretKey(credential.private_key));
}

async function blockHeight(blockHash) {
  if (!blockHash) return null;
  try { return Number((await provider.viewBlock({ blockId: blockHash })).header.height); }
  catch { return null; }
}

async function saveReceipt(result, source, method = null) {
  const tx = result?.transaction?.hash ?? result?.transaction_outcome?.id;
  if (!tx || seenTransactions.has(tx)) return evidence.find(entry => entry.tx === tx) ?? null;
  const outcomes = result.receipts_outcome ?? [];
  const transactionFailure = typeof result.status === "object" && result.status !== null && "Failure" in result.status ? result.status.Failure : null;
  const failedReceipt = outcomes.find(item => typeof item.outcome?.status === "object" && item.outcome.status !== null && "Failure" in item.outcome.status);
  assert.equal(transactionFailure, null, `Transaction failed: ${tx}`);
  assert.equal(failedReceipt, undefined, `Receipt failed: ${tx}`);
  seenTransactions.add(tx);
  const contractOutcome = outcomes.find(item => item.outcome?.executor_id === world);
  const logs = outcomes.flatMap(item => item.outcome?.logs ?? []).filter(log => log.startsWith("EVENT_JSON:"));
  const entry = {
    source,
    method,
    tx,
    explorer: explorer(tx),
    signer: result.transaction?.signer_id ?? null,
    receiver: result.transaction?.receiver_id ?? null,
    executionBlock: await blockHeight(contractOutcome?.block_hash ?? result.transaction_outcome?.block_hash),
    status: "success",
    events: logs.map(log => JSON.parse(log.slice(11))),
  };
  evidence.push(entry);
  return entry;
}

async function call(actor, method, args, source) {
  const result = await actor.callFunctionRaw({ contractId: world, methodName: method, args, gas, deposit: 0n });
  const receipt = await saveReceipt(result, source, method);
  assert(receipt, `Missing receipt for ${method}`);
  return { result, receipt };
}

async function view(method, args = {}) {
  return provider.callFunction({ contractId: world, method, args, blockQuery: { finality: "final" } });
}

async function waitView(method, args, ready, timeout = 90_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const state = await view(method, args);
    if (ready(state)) return state;
    await delay(1_200);
  }
  throw new Error(`Final state did not catch up: ${method}`);
}

async function waitHeight(target) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    const height = Number((await provider.viewBlock({ finality: "final" })).header.height);
    if (height >= target) return height;
    await delay(800);
  }
  throw new Error(`Testnet did not reach block ${target}`);
}

function resultId(result) {
  const encoded = typeof result.status === "object" ? result.status.SuccessValue : "";
  return Number(Buffer.from(encoded ?? "", "base64").toString());
}

async function createFreshAccount(root, accountId, nearToTransfer) {
  assert.equal(await view("get_player", { account_id: accountId }).catch(() => null), null);
  const key = KeyPair.fromRandom("ed25519");
  const credentialPath = path.join(credentialsDir, `${accountId}.json`);
  await fs.writeFile(credentialPath, JSON.stringify({ account_id: accountId, public_key: key.getPublicKey().toString(), private_key: key.toString() }), { flag: "wx", mode: 0o600 });
  try {
    const created = await root.createAccount({ newAccountId: accountId, publicKey: key.getPublicKey(), nearToTransfer });
    await saveReceipt(created, `setup: create ${accountId}`, "create_account");
  } catch (error) {
    await fs.unlink(credentialPath).catch(() => {});
    throw error;
  }
  return account(accountId);
}

async function launch() {
  try { return await chromium.launch({ channel: "msedge", headless: true }); }
  catch { return chromium.launch({ headless: true }); }
}

function begin(id, title, narration, started) {
  const now = (Date.now() - started) / 1000;
  if (scenes.length) scenes.at(-1).end = now;
  scenes.push({ id, title, narration, start: now });
  console.log(`Scene: ${id}`);
}

async function waitEnabled(locator, timeout = 45_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await locator.isEnabled().catch(() => false)) return;
    await delay(500);
  }
  throw new Error("Timed out waiting for enabled UI action");
}

let browser;
let context;
let page;
let video;
let owner;
let completed;
let started;
const responseTasks = new Set();

try {
  const root = await account(rootId);
  owner = process.env.FRONTIER_VIDEO_ACCOUNT ? await account(captainId) : await createFreshAccount(root, captainId, 600_000_000_000_000_000_000_000n);
  const escort = process.env.FRONTIER_ESCORT_ACCOUNT ? await account(escortId) : await createFreshAccount(root, escortId, 250_000_000_000_000_000_000_000n);
  const rival = process.env.FRONTIER_RIVAL_ACCOUNT ? await account(rivalId) : await createFreshAccount(root, rivalId, 250_000_000_000_000_000_000_000n);

  const initialCaptain = await view("get_player", { account_id: captainId });
  const initialEscort = await view("get_player", { account_id: escortId });
  const initialRival = await view("get_player", { account_id: rivalId });
  assert.equal(initialCaptain, null, "Captain must be fresh and unregistered");

  let escortShipId;
  let offerId;
  let escortOffer;
  if (initialEscort === null) {
    await call(escort, "register_player", {}, "setup: register escort captain");
    const escortBuild = await call(escort, "build_ship", { kind: "galleon" }, "setup: build defence-3 escort galleon");
    escortShipId = resultId(escortBuild.result);
    assert(escortShipId > 0);
    const escortOfferCall = await call(escort, "offer_escort", { ship_id: escortShipId, price: "20" }, "setup: offer defence-3 escort");
    offerId = resultId(escortOfferCall.result);
    escortOffer = await waitView("get_escort", { offer_id: offerId }, offer => offer?.active === true);
  } else {
    assert(existingOfferId > 0, "FRONTIER_ESCORT_OFFER_ID is required when reusing an escort account");
    offerId = existingOfferId;
    escortOffer = await view("get_escort", { offer_id: offerId });
    assert(escortOffer?.active, `Escort offer ${offerId} is not active`);
    escortShipId = Number(escortOffer.ship_id);
  }
  const escortShip = await waitView("get_ship", { ship_id: escortShipId }, ship => Number(ship?.defence) === 3);
  assert.equal(escortShip.owner_id, escortId);
  assert.equal(Number(escortOffer.defence), 3);

  if (initialRival === null) {
    await call(rival, "register_player", {}, "setup: register scripted rival");
    await call(rival, "build_ship", { kind: "sloop" }, "setup: build rival sloop 1");
    await call(rival, "build_ship", { kind: "sloop" }, "setup: build rival sloop 2");
  }
  const rivalShips = await waitView("ships_for_owner", { account_id: rivalId }, ships => ships.length === 2);
  assert(rivalShips.every(([, ship]) => Number(ship.defence) === 1 && ship.route_id === null && ship.origin_port === null && ship.escorting_convoy_id === null));
  const rivalPower = rivalShips.reduce((total, [, ship]) => total + Number(ship.defence), 0);
  assert(rivalPower > 1 && rivalPower <= 4, `Rival power ${rivalPower} is outside the required range`);

  browser = await launch();
  context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
    acceptDownloads: true,
    ...(captureVideo ? { recordVideo: { dir: out, size: { width: 1600, height: 900 } } } : {}),
  });
  await context.exposeBinding("__frontierRecordingLogin", async (_, request) => {
    assert.equal(request.network, "testnet");
    const key = request.addFunctionCallKey;
    assert(key, "The app did not request a scoped function-call key");
    assert.equal(key.contractId, world);
    assert.equal(key.allowMethods.anyMethod, false);
    if (walletEmulation === "own-key") {
      walletKeyPair = KeyPair.fromRandom("ed25519");
      const walletKey = walletKeyPair.getPublicKey().toString();
      const added = await owner.addFunctionCallAccessKey({ publicKey: walletKey, contractId: world, methodNames: [], allowance: 250_000_000_000_000_000_000_000n });
      sessionKeys.push(walletKey);
      await saveReceipt(added, "recording wallet: adds its own key and ignores the app key (Meteor behaviour)", "add_key");
      return [{ accountId: captainId }];
    }
    const approved = await owner.addFunctionCallAccessKey({
      publicKey: key.publicKey,
      contractId: world,
      methodNames: key.allowMethods.methodNames,
      allowance: 1_000_000_000_000_000_000_000_000n,
    });
    sessionKeys.push(key.publicKey);
    await saveReceipt(approved, "recording wallet: scoped game-key approval", "add_key");
    return [{ accountId: captainId }];
  });
  // Escort hires and port trades are wallet-signed in the app; the recording wallet signs them in Node.
  await context.exposeBinding("__frontierRecordingSign", async (_, request) => {
    assert.equal(request.actions.length, 1);
    const [action] = request.actions;
    const json = result => JSON.parse(JSON.stringify(result, (_key, value) => typeof value === "bigint" ? value.toString() : value));
    if (action.type === "AddKey") {
      // The app's fallback when the wallet ignored its key: one AddKey scoped to the game contract.
      const permission = action.params.accessKey.permission;
      assert.equal(request.receiverId, captainId);
      assert(permission !== "FullAccess" && permission.receiverId === world, "AddKey must be scoped to the world contract");
      assert(permission.methodNames.length > 0 && permission.methodNames.every(m => gameKeyMethods.includes(m)), "AddKey methods exceed the game key");
      assert(BigInt(permission.allowance) <= 1_000_000_000_000_000_000_000_000n, "AddKey allowance is above 1 NEAR");
      const added = await owner.addFunctionCallAccessKey({ publicKey: action.params.publicKey, contractId: world, methodNames: permission.methodNames, allowance: BigInt(permission.allowance) });
      sessionKeys.push(action.params.publicKey);
      await saveReceipt(added, "recording wallet: approved the app's game-key AddKey (fallback)", "add_key");
      return json(added);
    }
    if (walletEmulation === "own-key" && action.type === "FunctionCall" && request.receiverId === world && gameKeyMethods.includes(action.params.methodName) && String(action.params.deposit) === "0") {
      // Meteor signs covered game calls locally with the key it added at sign-in: no prompt.
      const walletAccount = new Account(captainId, provider, new KeyPairSigner(walletKeyPair));
      const result = await walletAccount.callFunctionRaw({ contractId: world, methodName: action.params.methodName, args: action.params.args, gas: BigInt(action.params.gas), deposit: 0n });
      walletSilentCalls++;
      await saveReceipt(result, `recording wallet: signed ${action.params.methodName} silently with its own key (Meteor behaviour)`, action.params.methodName);
      return json(result);
    }
    assert.equal(request.receiverId, world);
    assert.equal(action.type, "FunctionCall");
    assert(["hire_escort", "buy_port", "set_port_sale_price"].includes(action.params.methodName), `Unexpected wallet method: ${action.params.methodName}`);
    assert.equal(String(action.params.deposit), "0");
    const result = await owner.callFunctionRaw({ contractId: world, methodName: action.params.methodName, args: action.params.args, gas: BigInt(action.params.gas), deposit: 0n });
    await saveReceipt(result, `recording wallet: approved ${action.params.methodName}`, action.params.methodName);
    return json(result);
  });
  await context.addInitScript(({ origin, captain }) => {
    if (location.origin !== origin) return;
    localStorage.setItem("frontier-intro-seen", "yes");
    let signedIn = false;
    window.addEventListener("near-selector-ready", () => {
      window.dispatchEvent(new CustomEvent("near-wallet-injected", { detail: {
        manifest: {
          id: "frontier-recording",
          name: "Recording wallet (testnet)",
          type: "injected",
          version: "1",
          website: origin,
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><rect width='50' height='50' fill='%230b3b49'/><text x='15' y='36' fill='white' font-size='32'>F</text></svg>",
          features: { testnet: true, signInWithFunctionCallKey: true },
          permissions: {},
        },
        getAccounts: async () => signedIn ? [{ accountId: captain }] : [],
        signIn: async request => { const accounts = await window.__frontierRecordingLogin(request); signedIn = true; return accounts; },
        signOut: async () => { signedIn = false; },
        signAndSendTransaction: async request => window.__frontierRecordingSign(request),
      } }));
    });
  }, { origin: site, captain: captainId });

  page = await context.newPage();
  video = captureVideo ? page.video() : null;
  page.on("response", response => {
    if (!response.url().includes("rpc.testnet") && !response.url().includes("fastnear.com")) return;
    const task = response.json().then(body => body?.result?.transaction ? saveReceipt(body.result, "browser UI") : null).catch(() => null);
    responseTasks.add(task);
    task.finally(() => responseTasks.delete(task));
  });
  page.on("pageerror", error => console.error(`Browser error: ${error.message}`));

  async function uiTransaction(button, method, source, expectedText) {
    const before = new Set(evidence.map(entry => entry.tx));
    const locator = typeof button === "string" ? page.getByRole("button", { name: button, exact: true }).last() : button;
    await waitEnabled(locator);
    await locator.click();
    const deadline = Date.now() + 90_000;
    while (Date.now() < deadline) {
      const entry = evidence.find(item => !before.has(item.tx) && item.signer === captainId && item.receiver === world);
      if (entry) {
        entry.source = source;
        entry.method = method;
        if (expectedText) await page.getByText(expectedText, { exact: false }).first().waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});
        return entry;
      }
      await delay(300);
    }
    throw new Error(`No browser transaction captured for ${method}`);
  }

  async function recoverReads(readyControl, label, timeout = 90_000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const visible = await readyControl.isVisible().catch(() => false);
      const enabled = visible && await readyControl.isEnabled().catch(() => false);
      if (enabled) return;
      await delay(1_000);
    }
    const panel = await page.locator(".panel-body").innerText().catch(() => "unavailable");
    throw new Error(`Timed out waiting for ${label}; captain panel: ${panel.replace(/\s+/g, " ").trim()}`);
  }

  async function scanAccessibility(label) {
    try {
      const { default: AxeBuilder } = await import("@axe-core/playwright");
      const report = await new AxeBuilder({ page }).analyze();
      accessibility.push({
        label,
        passes: report.passes.length,
        incomplete: report.incomplete.length,
        violations: report.violations.map(item => ({ id: item.id, impact: item.impact, help: item.help, nodes: item.nodes.length })),
      });
      await page.screenshot({ path: path.join(out, `axe-${label}.png`), fullPage: true });
    } catch (error) {
      accessibility.push({ label, error: error instanceof Error ? error.message : String(error) });
    }
  }

  started = Date.now();
  await page.goto(siteUrl.href, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.getByRole("heading", { name: "Trade the tides." }).waitFor({ timeout: 30_000 });
  await page.locator(".height-label").getByText(/Block/).waitFor({ timeout: 30_000 });
  begin("intro", "FRONTIER / REDESIGNED LIVE ROUND", "A fresh captain trades, hires an escort, crosses a live ambush window with every unit of cargo intact, and sells at the destination. Every order shown here is a real NEAR testnet transaction.", started);
  await page.screenshot({ path: path.join(out, "poster.png") });

  begin("register", "01 / CONNECT AND REGISTER", "For this recording, an automated wallet approves only the game contract methods. The full-access testnet credential never enters the page. This fresh captain then registers through the redesigned interface.", started);
  await page.locator(".wallet-button").click();
  await page.getByText("Recording wallet (testnet)", { exact: true }).click();
  await page.locator(".captain-name").getByText(captainId, { exact: true }).waitFor({ timeout: 30_000 });
  const registerReceipt = await uiTransaction("Register captain", "register_player", "UI: register fresh captain", "Captain registered");
  const registeredCaptain = await waitView("get_player", { account_id: captainId }, player => Number(player?.cred) === 1000);
  const spendInput = page.getByLabel("Spend CRED", { exact: true });
  await recoverReads(spendInput, "ready market controls");
  await scanAccessibility("authenticated-market");

  begin("trade-build", "02 / BUY CARGO AND BUILD A SLOOP", `The captain spends ${spendCred} CRED on ${goodName} and builds a defence-one sloop. The market quote and resulting inventory both come from the deployed contract.`, started);
  await page.getByRole("combobox", { name: /^Good/ }).selectOption(String(goodIndex));
  await spendInput.fill(String(spendCred));
  const buyReceipt = await uiTransaction("Buy cargo", "buy", `UI: buy ${goodName} cargo`, "Bought");
  const afterBuy = await waitView("get_player", { account_id: captainId }, player => Number(player?.goods?.[goodIndex]) > 0);
  const purchasedCargo = Number(afterBuy.goods[goodIndex]);
  const buildButton = page.getByRole("button", { name: /Build sloop/ }).first();
  await recoverReads(buildButton, "enabled sloop build action");
  const buildReceipt = await uiTransaction(buildButton, "build_ship", "UI: build captain sloop", "Sloop built");
  const captainShips = await waitView("ships_for_owner", { account_id: captainId }, ships => ships.length === 1);
  const captainShipId = Number(captainShips[0][0]);
  assert.equal(Number(captainShips[0][1].defence), 1);
  await recoverReads(page.getByRole("combobox", { name: /Your ship/ }), "ready fleet controls");
  await scanAccessibility("authenticated-fleet");

  begin("escort", "03 / HIRE A DEFENCE-THREE ESCORT", "A second fresh captain has built a galleon with exactly three defence. The convoy looks up that live offer and hires it through the interface before departure.", started);
  await page.getByText("Hire or offer an escort", { exact: true }).click();
  await page.getByLabel("Escort offer number", { exact: true }).fill(String(offerId));
  await page.getByRole("button", { name: "Check escort offer", exact: true }).click();
  await page.getByText(`Ship ${escortShipId}, defence 3.`, { exact: false }).waitFor({ timeout: 30_000 });
  await scanAccessibility("authenticated-escort");
  const hireReceipt = await uiTransaction("Hire escort", "hire_escort", "UI: hire defence-3 galleon", "Escort hired");
  const linkedConvoy = await waitView("get_ship", { ship_id: captainShipId }, ship => Number(ship?.escort_ship_id) === escortShipId);
  const linkedEscort = await view("get_ship", { ship_id: escortShipId });
  assert.equal(Number(linkedEscort.escorting_convoy_id), captainShipId);
  assert.equal(Number(linkedEscort.defence), 3);
  const sailSelect = page.getByRole("combobox", { name: /Sail to/ });
  await recoverReads(sailSelect, "ready escorted voyage controls");

  begin("ambush-depart", "04 / REVEALED AMBUSH AND SEALED DEPARTURE", "A scripted rival has exactly two idle defence, above the sloop alone but below the escorted convoy's total defence of four. Its committed and revealed ambush window is established first; then the captain loads every unit and departs inside that exact window.", started);
  const route = await view("get_route", { route_id: 1 });
  assert.equal(Number(route.from_port), 1);
  assert.equal(Number(route.to_port), 2);
  const beforeAmbushHeight = Number((await provider.viewBlock({ finality: "final" })).header.height);
  // Slow RPCs need several seconds per call, so leave enough blocks for the rival commit to land first.
  const windowStart = beforeAmbushHeight + 40;
  const windowEnd = windowStart + 20;
  const ambushSalt = `redesign-${randomBytes(12).toString("hex")}`;
  const ambushCommit = hash(`1:${windowStart}:${ambushSalt}:${rivalId}`);
  const rivalBeforeAmbush = await view("get_player", { account_id: rivalId });
  assert.equal(Number(rivalBeforeAmbush.active_commits), 0, "Rival must have no pre-existing active ambushes");
  const commitCall = await call(rival, "commit_ambush", { window_start: windowStart, commit: ambushCommit, stake: "10" }, "scripted rival: commit ambush");
  const revealCall = await call(rival, "reveal_ambush", { commit_id: ambushCommit, route_id: 1, salt: ambushSalt }, "scripted rival: reveal ambush");
  const rivalAfterReveal = await waitView("get_player", { account_id: rivalId }, player => Number(player?.active_commits) === 1);
  await sailSelect.selectOption("1");
  await page.getByRole("button", { name: "Load all available cargo", exact: true }).click();
  await waitHeight(windowStart);
  const departReceipt = await uiTransaction("Seal and sail", "depart", "UI: depart escorted convoy with sealed destination", "set sail");
  const departedShip = await waitView("get_ship", { ship_id: captainShipId }, ship => Number(ship?.origin_port) === 1);
  const departureBlock = Number(departedShip.departed_at);
  assert(departureBlock >= windowStart && departureBlock <= windowEnd, `Departure ${departureBlock} missed ambush window ${windowStart}-${windowEnd}`);
  assert.equal(Number(departedShip.escort_ship_id), escortShipId);
  const loadedCargo = departedShip.cargo.map(Number);
  assert.equal(loadedCargo[goodIndex], purchasedCargo);
  assert.equal(loadedCargo.reduce((total, value) => total + value, 0), purchasedCargo);
  const beforeArrivalPlayer = await waitView("get_player", { account_id: captainId }, player => Number(player?.goods?.[goodIndex]) === 0);
  await page.screenshot({ path: path.join(out, "escorted-departure.png") });

  begin("arrive", "05 / ARRIVE WITH FULL CARGO", "The contract resolves the voyage after the route distance. The proof compares the loaded ship cargo with the captain's credited inventory, alongside the exact rival power and window, rather than inferring protection from an event flag.", started);
  await waitHeight(Number(departedShip.arrives_at));
  const arriveButton = page.getByRole("button", { name: "Arrive at port", exact: true });
  await recoverReads(arriveButton, "enabled arrival action");
  const arriveReceipt = await uiTransaction(arriveButton, "arrive", "UI: reveal destination and arrive", "reached");
  const arrivedShip = await waitView("get_ship", { ship_id: captainShipId }, ship => Number(ship?.current_port) === 2 && ship?.origin_port === null);
  const arrivedEscort = await view("get_ship", { ship_id: escortShipId });
  const afterArrival = await view("get_player", { account_id: captainId });
  const rivalAfterArrival = await waitView("get_player", { account_id: rivalId }, player => Number(player?.active_commits) === 0);
  assert.deepEqual(afterArrival.goods.map(Number), beforeArrivalPlayer.goods.map((value, index) => Number(value) + loadedCargo[index]));
  assert.equal(arrivedShip.escort_ship_id, null);
  assert.equal(arrivedEscort.escorting_convoy_id, null);
  assert.equal(Number(arrivedEscort.current_port), 2);
  await page.screenshot({ path: path.join(out, "full-cargo-arrival.png") });
  const sellInput = page.getByLabel(`Sell ${goodName}`, { exact: true });
  await recoverReads(sellInput, "ready destination market controls");

  begin("sell", "06 / SELL AT THE DESTINATION", `At Solana Reef, the captain sells every surviving unit through the live market. The final state confirms the ${goodName} inventory was sold after arriving intact. The sale price is whatever the live market pays; this voyage is not a profit claim.`, started);
  const sellAmount = Number(afterArrival.goods[goodIndex]);
  assert.equal(sellAmount, loadedCargo[goodIndex]);
  await sellInput.fill(String(sellAmount));
  const sellReceipt = await uiTransaction("Sell cargo", "sell", "UI: sell full preserved cargo", "Sold cargo");
  const finalPlayer = await waitView("get_player", { account_id: captainId }, player => Number(player?.goods?.[goodIndex]) === 0);
  assert(Number(finalPlayer.cred) > Number(afterArrival.cred));

  begin("raid", "07 / SET AND SPRING AN AMBUSH", "Now the captain turns raider. The idle sloop sets an ambush on the Bitcoin Isle to Solana Reef route with a window opening in 30 blocks, then springs it through the interface.", started);
  const captainBeforeRaid = await view("get_player", { account_id: captainId });
  await page.getByRole("button", { name: "Ambush", exact: true }).click();
  await page.getByRole("combobox", { name: /Window opens in/ }).selectOption("30");
  await scanAccessibility("authenticated-ambush");
  const raidCommitReceipt = await uiTransaction("Set ambush", "commit_ambush", "UI: captain commits ambush with chosen window", "Ambush set");
  const raidRevealReceipt = await uiTransaction("Spring ambush", "reveal_ambush", "UI: captain springs ambush", "Ambush sprung");
  const captainAfterRaid = await waitView("get_player", { account_id: captainId }, player => Number(player?.active_commits) === Number(captainBeforeRaid.active_commits) + 1);
  await page.screenshot({ path: path.join(out, "captain-ambush.png") });

  const walletKeyState = walletKeyPair ? await provider.viewAccessKey({ accountId: captainId, publicKey: walletKeyPair.getPublicKey().toString() }).catch(() => null) : null;
  begin("evidence", "08 / RECEIPTS AND INDEPENDENT PROOF", "The capture record links every transaction and records the escort's defence, rival's complete fresh fleet, ambush bounds, exact departure block, and equal loaded and arrived cargo. This is live testnet evidence, not a simulated outcome.", started);
  await page.locator(".ship-log").scrollIntoViewIfNeeded();
  await delay(2_000);
  scenes.at(-1).end = (Date.now() - started) / 1000;
  await Promise.all([...responseTasks]);

  completed = {
    network: "testnet",
    status: "LIVE_PREVIEW_UI_ESCORT_ROUND",
    recordedAt: new Date().toISOString(),
    site: siteUrl.href,
    deploymentCommit,
    walletEmulation,
    walletKey: walletKeyPair ? { publicKey: walletKeyPair.getPublicKey().toString(), initialAllowanceNear: 0.25, remainingAllowanceNear: walletKeyState ? Number(BigInt(walletKeyState.permission?.FunctionCall?.allowance ?? 0n)) / 1e24 : null, silentCalls: walletSilentCalls } : null,
    world,
    accounts: {
      captain: { accountId: captainId, freshBeforeRound: initialCaptain === null },
      escort: { accountId: escortId, freshBeforeRound: initialEscort === null },
      rival: { accountId: rivalId, freshBeforeRound: initialRival === null },
    },
    automationDisclosure: "An injected automation wallet approved a real contract-restricted function-call key for the captain. Full-access credentials remained in Node and in ~/.near-credentials/testnet; no retail-wallet walkthrough is claimed.",
    scriptedRivalDisclosure: "The rival account was rule-based test automation, not autonomous AI. Its registration, ship builds, ambush commit, and reveal were live testnet transactions.",
    accessibility,
    proof: {
      freshCaptain: { initialPlayer: initialCaptain, registeredPlayer: registeredCaptain, registerReceipt: registerReceipt.explorer },
      purchaseAndSloop: { good: goodName, spentCred: spendCred, purchasedUnits: purchasedCargo, captainShipId, defence: 1, buyReceipt: buyReceipt.explorer, buildReceipt: buildReceipt.explorer },
      escort: { offerId, shipId: escortShipId, defence: Number(escortOffer.defence), ownerId: escortOffer.owner_id, hireReceipt: hireReceipt.explorer, linkedConvoyShipId: Number(linkedEscort.escorting_convoy_id) },
      rivalPower: { exactIdlePower: rivalPower, requiredBounds: { greaterThan: 1, lessThanOrEqual: 4 }, withinRequiredBounds: rivalPower > 1 && rivalPower <= 4, basis: "The rival account's complete ships_for_owner result contained exactly two idle defence-1 sloops and no other ships.", ships: rivalShips.map(([id, ship]) => ({ shipId: Number(id), defence: Number(ship.defence), routeId: ship.route_id, originPort: ship.origin_port, escortingConvoyId: ship.escorting_convoy_id })) },
      ambushWindow: { routeId: 1, fromPort: Number(route.from_port), toPort: Number(route.to_port), windowStart, windowEnd, departureBlock, enclosesDeparture: windowStart <= departureBlock && departureBlock <= windowEnd, rivalActiveCommits: { before: Number(rivalBeforeAmbush.active_commits), afterReveal: Number(rivalAfterReveal.active_commits), afterArrival: Number(rivalAfterArrival.active_commits), targetedAmbushResolved: Number(rivalBeforeAmbush.active_commits) === 0 && Number(rivalAfterReveal.active_commits) === 1 && Number(rivalAfterArrival.active_commits) === 0 }, commitReceipt: commitCall.receipt.explorer, revealReceipt: revealCall.receipt.explorer, departReceipt: departReceipt.explorer },
      cargoPreservation: { loadedCargo, captainGoodsBeforeArrival: beforeArrivalPlayer.goods.map(Number), captainGoodsAfterArrival: afterArrival.goods.map(Number), fullCargoPreserved: afterArrival.goods.every((value, index) => Number(value) === Number(beforeArrivalPlayer.goods[index]) + loadedCargo[index]), arrivalReceipt: arriveReceipt.explorer },
      captainAmbush: { activeCommits: { before: Number(captainBeforeRaid.active_commits), after: Number(captainAfterRaid.active_commits) }, stakeCred: Number(captainBeforeRaid.cred) - Number(captainAfterRaid.cred), commitReceipt: raidCommitReceipt.explorer, revealReceipt: raidRevealReceipt.explorer },
      sale: { good: goodName, soldUnits: sellAmount, creditedCred: Number(finalPlayer.cred) - Number(afterArrival.cred), finalGoods: finalPlayer.goods.map(Number), finalCred: Number(finalPlayer.cred), saleReceipt: sellReceipt.explorer },
    },
    uiTransactions: [registerReceipt, buyReceipt, buildReceipt, hireReceipt, departReceipt, arriveReceipt, sellReceipt, raidCommitReceipt, raidRevealReceipt].map(entry => ({ method: entry.method, tx: entry.tx, explorer: entry.explorer, executionBlock: entry.executionBlock })),
  };
} catch (error) {
  if (page) {
    console.error(`UI status: ${await page.locator(".event-toast").innerText().catch(() => "unavailable")}`);
    await page.screenshot({ path: path.join(out, "failure.png"), fullPage: true }).catch(() => {});
  }
  await fs.writeFile(path.join(out, "partial-public-evidence.json"), JSON.stringify({ site: siteUrl.href, world, captainId, escortId, rivalId, scenes, evidence, error: error instanceof Error ? error.message : String(error) }, null, 2));
  throw error;
} finally {
  if (scenes.length && !scenes.at(-1).end && started) scenes.at(-1).end = (Date.now() - started) / 1000;
  if (context) await context.close().catch(() => {});
  if (video) {
    try { await fs.copyFile(await video.path(), path.join(out, "capture.webm")); }
    catch (error) { console.error(`Video copy failed: ${error instanceof Error ? error.message : String(error)}`); }
  }
  if (browser) await browser.close().catch(() => {});
  if (owner) {
    for (const publicKey of sessionKeys) {
      try {
        const removed = await owner.deleteKey(publicKey);
        const receipt = await saveReceipt(removed, "recording wallet: scoped key revoked", "delete_key");
        keyCleanup.push({ publicKey, status: "revoked", tx: receipt?.tx ?? null, explorer: receipt?.explorer ?? null });
      } catch (error) {
        keyCleanup.push({ publicKey, status: "failed", error: error instanceof Error ? error.message : String(error) });
      }
    }
  }
}

assert(completed, "Round did not complete");
assert(keyCleanup.every(item => item.status === "revoked"), "Scoped recording key cleanup failed");
const publicResult = { ...completed, keyCleanup, transactions: evidence };
await fs.mkdir(path.dirname(resultFile), { recursive: true });
await fs.writeFile(resultFile, JSON.stringify(publicResult, null, 2));
await fs.writeFile(path.join(out, "capture.json"), JSON.stringify({
  site: siteUrl.href,
  world,
  captain: captainId,
  scenes,
  evidence,
  afterBuy: completed.proof.purchaseAndSloop,
  afterArrival: completed.proof.cargoPreservation,
  finalPlayer: completed.proof.sale,
  recordedAt: completed.recordedAt,
  keyCleanup,
  disclosures: [completed.automationDisclosure, completed.scriptedRivalDisclosure, "All gameplay calls and state reads used live NEAR testnet; no contract responses were mocked."],
}, null, 2));
console.log(`Live redesigned round complete: ${path.relative(process.cwd(), resultFile)}`);
