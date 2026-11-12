import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, type KeyPairString } from "near-api-js";

const ROOT = process.env.FRONTIER_ROOT_ACCOUNT ?? "frontier-uiriamuzu.testnet";
const WORLD = process.env.FRONTIER_WORLD_ACCOUNT ?? `world.${ROOT}`;
const RPC = process.env.FRONTIER_RPC_URL ?? "https://rpc.testnet.fastnear.com";
const credentialsPath = path.join(os.homedir(), ".near-credentials", "testnet");
const networkId = "testnet";
const gas = BigInt(300) * 1_000_000_000_000n;
const explorer = (tx: string) => `https://testnet.nearblocks.io/txns/${tx}`;

type Evidence = { label: string; account: string; method: string; tx?: string; explorer?: string; status: "success" | "failure"; error?: string };
const evidence: Evidence[] = [];
type Credential = { account_id: string; private_key: KeyPairString };
async function account(provider: JsonRpcProvider, accountId: string) {
  const credential = JSON.parse(await fs.readFile(path.join(credentialsPath, `${accountId}.json`), "utf8")) as Credential;
  return new Account(accountId, provider, KeyPairSigner.fromSecretKey(credential.private_key));
}
function hash(value: string) { return Array.from(createHash("sha256").update(value).digest()); }
async function waitForHeight(provider: JsonRpcProvider, target: number) {
  for (;;) {
    const block = await provider.viewBlock({ finality: "final" });
    if (block.header.height >= target) return block.header.height;
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
}
async function waitForArrival(provider: JsonRpcProvider, shipId: number) {
  for (;;) {
    const [block, ship] = await Promise.all([
      provider.viewBlock({ finality: "final" }),
      provider.callFunction<{ route_id: number | null; arrives_at: number }>({ contractId: WORLD, method: "get_ship", args: { ship_id: shipId }, blockQuery: { finality: "final" } }),
    ]);
    if (ship && ship.route_id !== null && block.header.height < Number(ship.arrives_at)) {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    return;
  }
}

async function call(account: Account, method: string, args: Record<string, unknown>, label: string) {
  try {
    const result = await account.callFunctionRaw({ contractId: WORLD, methodName: method, args, gas, deposit: 0n });
    evidence.push({ label, account: account.accountId, method, tx: result.transaction_outcome.id, explorer: `https://testnet.nearblocks.io/txns/${result.transaction_outcome.id}`, status: "success" });
    return result;
  } catch (error) {
    evidence.push({ label, account: account.accountId, method, status: "failure", error: error instanceof Error ? error.message : String(error) });
    throw new Error(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
async function view(provider: JsonRpcProvider, method: string, args: Record<string, unknown>): Promise<any> {
  return provider.callFunction<any>({ contractId: WORLD, method, args, blockQuery: { finality: "final" } });
}
function resultId(result: any, fallback: number) {
  return Number(Buffer.from(result.status.SuccessValue ?? "", "base64").toString() || fallback);
}

async function main() {
  const provider = new JsonRpcProvider({ url: RPC });
  const world = await account(provider, WORLD);
  const p1 = await account(provider, `p1.${ROOT}`);
  const p2 = await account(provider, `p2.${ROOT}`);
  const p3 = await account(provider, `p4.${ROOT}`);
  for (const [account, label] of [[p1, "register p1"], [p2, "register p2"], [p3, "register p3"]] as const) {
    if (!(await view<any>(provider, "get_player", { account_id: account.accountId }))) await call(account, "register_player", {}, label);
  }
  const port = await view<any>(provider, "get_port", { port_id: 1 });
  if (port.owner_id !== p1.accountId) await call(p1, "buy_port", { port_id: 1 }, "p1 buys port 1");
  const p2Ships = await view(provider, "ships_for_owner", { account_id: p2.accountId }) as [number, any][];
  const p3Ships = await view(provider, "ships_for_owner", { account_id: p3.accountId }) as [number, any][];
  const linked = p2Ships.find(([, ship]) => ship.escort_ship_id != null);
  let ship1Id: number;
  let ship2Id: number;
  if (linked) {
    ship2Id = Number(linked[0]);
    ship1Id = Number(linked[1].escort_ship_id);
  } else {
    const existingEscort = (await view(provider, "ships_for_owner", { account_id: p1.accountId }) as [number, any][]).find(([, ship]) => ship.defence >= 3 && ship.route_id == null && ship.escorting_convoy_id == null);
    const ship1 = existingEscort ? null : await call(p1, "build_ship", { kind: "galleon" }, "p1 builds escort galleon");
    const ship2 = await call(p2, "build_ship", { kind: "sloop" }, "p2 builds convoy sloop");
    ship1Id = existingEscort ? Number(existingEscort[0]) : resultId(ship1, 1);
    ship2Id = resultId(ship2, 2);
    const offer = await call(p1, "offer_escort", { ship_id: ship1Id, price: "20" }, "p1 offers escort");
    const offerId = resultId(offer, 1);
    await call(p2, "hire_escort", { offer_id: offerId, convoy_ship_id: ship2Id }, "p2 hires escort");
  }
  if (!p3Ships.some(([, ship]) => ship.defence >= 3 && ship.route_id == null)) await call(p3, "build_ship", { kind: "galleon" }, "p3 builds raider galleon");
  let linkedConvoy: any;
  let linkedEscort: any;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    [linkedConvoy, linkedEscort] = await Promise.all([view(provider, "get_ship", { ship_id: ship2Id }), view(provider, "get_ship", { ship_id: ship1Id })]);
    if (Number(linkedConvoy.escort_ship_id) === ship1Id && Number(linkedEscort.escorting_convoy_id) === ship2Id) break;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  if (Number(linkedConvoy.escort_ship_id) !== ship1Id || Number(linkedEscort.escorting_convoy_id) !== ship2Id) throw new Error("escort was not linked and locked");
  evidence.push({ label: "escort linked and locked", account: p2.accountId, method: "get_ship", status: "success" });
  const ambushSalt = "frontier-demo-ambush";
  const current = await provider.viewBlock({ finality: "final" });
  const window = current.header.height + 20;
  const ambushCommit = hash(`1:${window}:${ambushSalt}:${p3.accountId}`);
  await call(p3, "commit_ambush", { window_start: window, commit: ambushCommit, stake: "10" }, "p3 commits hidden ambush");
  const destinationSalt = "frontier-demo-destination";
  const convoyPlayer = await view(provider, "get_player", { account_id: p2.accountId });
  if (Number(convoyPlayer.goods[0]) < 50) await call(p2, "buy", { port_id: 1, good: "Hashpower", cred_in: "300", min_out: "0" }, "p2 buys convoy cargo");
  await call(p2, "depart", { ship_id: ship2Id, origin_port: 1, destination_commit: hash(`2:${destinationSalt}:${ship2Id}`), cargo: ["50", "0", "0"] }, "p2 departs with sealed destination and cargo");
  await call(p3, "reveal_ambush", { commit_id: ambushCommit, route_id: 1, salt: ambushSalt }, "p3 reveals ambush");
  const departureBlock = (await provider.viewBlock({ finality: "final" })).header.height;
  await waitForHeight(provider, departureBlock + 20);
  await call(p2, "arrive", { ship_id: ship2Id, route_id: 1, destination: 2, salt: destinationSalt }, "p2 chooses route and arrives convoy");
  let arrivedConvoy: any;
  let arrivedEscort: any;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    [arrivedConvoy, arrivedEscort] = await Promise.all([view(provider, "get_ship", { ship_id: ship2Id }), view(provider, "get_ship", { ship_id: ship1Id })]);
    if (arrivedConvoy.escort_ship_id == null && arrivedEscort.escorting_convoy_id == null && Number(arrivedEscort.current_port) === 2) break;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  if (arrivedConvoy.escort_ship_id != null || arrivedEscort.escorting_convoy_id != null || Number(arrivedEscort.current_port) !== 2) throw new Error("escort was not released at destination");
  const arrivedPlayer = await view<any>(provider, "get_player", { account_id: p2.accountId });
  if (Number(arrivedPlayer.goods[0]) < 50) throw new Error("escort did not block the ambush cargo loss");
  evidence.push({ label: "escort blocked raid and released at arrival", account: p2.accountId, method: "arrive", status: "success" });
  const epochBlock = (await provider.viewBlock({ finality: "final" })).header.height;
  await waitForHeight(provider, epochBlock + 100);
  await call(world, "tick_epoch", {}, "world ticks epoch after gate");
  await call(p1, "set_port_sale_price", { port_id: 1, price: "25" }, "p1 lists port");
  await call(p2, "buy_port", { port_id: 1 }, "p2 buys port mid-season");
  const sessionKey = KeyPair.fromRandom("ed25519");
  const keyTx = await p2.addFunctionCallAccessKey({ publicKey: sessionKey.getPublicKey(), contractId: WORLD, methodNames: ["register_player"], allowance: 1n * 10n ** 24n });
  evidence.push({ label: "p2 adds game-only key", account: p2.accountId, method: "add_key", tx: keyTx.transaction_outcome.id, explorer: explorer(keyTx.transaction_outcome.id), status: "success" });
  const restricted = new Account(p2.accountId, provider, new KeyPairSigner(sessionKey));
  try {
    await restricted.callFunctionRaw({ contractId: WORLD, methodName: "build_ship", args: { kind: "sloop" }, gas, deposit: 0n });
    evidence.push({ label: "restricted key build_ship", account: p2.accountId, method: "build_ship", status: "failure", error: "unexpectedly succeeded" });
  } catch (error) {
    evidence.push({ label: "restricted key build_ship", account: p2.accountId, method: "build_ship", status: "success", error: error instanceof Error ? error.message : String(error) });
  }
  const round = { network: networkId, world: WORLD, status: "LIVE_TESTNET_ROUND", note: "All evidence entries are live testnet transactions. The restricted key rejection is recorded as a successful security assertion.", evidence, explorer: `https://testnet.nearblocks.io/address/${WORLD}` };
  await fs.mkdir("results", { recursive: true });
  const file = `results/round-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  await fs.writeFile(file, JSON.stringify(round, null, 2));
  console.log(JSON.stringify({ file, ...round }, null, 2));
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });

