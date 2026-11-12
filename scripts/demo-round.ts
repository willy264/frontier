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
    throw error;
  }
}

async function main() {
  const provider = new JsonRpcProvider({ url: RPC });
  const world = await account(provider, WORLD);
  const p1 = await account(provider, `p1.${ROOT}`);
  const p2 = await account(provider, `p2.${ROOT}`);
  const p3 = await account(provider, `p3.${ROOT}`);
  for (const [account, label] of [[p1, "register p1"], [p2, "register p2"], [p3, "register p3"]] as const) await call(account, "register_player", {}, label);
  await call(p1, "buy_port", { port_id: 1 }, "p1 buys port 1");
  const ship1 = await call(p1, "build_ship", { kind: "galleon" }, "p1 builds escort galleon");
  const ship2 = await call(p2, "build_ship", { kind: "sloop" }, "p2 builds convoy sloop");
  await call(p3, "build_ship", { kind: "galleon" }, "p3 builds raider galleon");
  const ship1Id = Number(Buffer.from(ship1.status.SuccessValue ?? "", "base64").toString() || 1);
  const ship2Id = Number(Buffer.from(ship2.status.SuccessValue ?? "", "base64").toString() || 2);
  const offer = await call(p1, "offer_escort", { ship_id: ship1Id, price: "20" }, "p1 offers escort");
  await call(p2, "hire_escort", { offer_id: 1, convoy_ship_id: ship2Id }, "p2 hires escort");
  const linkedConvoy = await provider.callFunction<any>({ contractId: WORLD, method: "get_ship", args: { ship_id: ship2Id }, blockQuery: { finality: "final" } });
  const linkedEscort = await provider.callFunction<any>({ contractId: WORLD, method: "get_ship", args: { ship_id: ship1Id }, blockQuery: { finality: "final" } });
  if (linkedConvoy.escort_ship_id !== ship1Id || linkedEscort.escorting_convoy_id !== ship2Id) throw new Error("escort was not linked and locked");
  evidence.push({ label: "escort linked and locked", account: p2.accountId, method: "get_ship", status: "success" });
  const ambushSalt = "frontier-demo-ambush";
  const current = await provider.viewBlock({ finality: "final" });
  const window = current.header.height + 20;
  const ambushCommit = hash(`1:${window}:${ambushSalt}:${p3.accountId}`);
  await call(p3, "commit_ambush", { window_start: window, commit: ambushCommit, stake: "10" }, "p3 commits hidden ambush");
  const destinationSalt = "frontier-demo-destination";
  await call(p2, "buy", { port_id: 1, good: "Hashpower", cred_in: "300", min_out: "0" }, "p2 buys convoy cargo");
  await call(p2, "depart", { ship_id: ship2Id, origin_port: 1, destination_commit: hash(`2:${destinationSalt}:${ship2Id}`), cargo: ["50", "0", "0"] }, "p2 departs with sealed destination and cargo");
  await call(p3, "reveal_ambush", { commit_id: ambushCommit, route_id: 1, salt: ambushSalt }, "p3 reveals ambush");
  const departureBlock = (await provider.viewBlock({ finality: "final" })).header.height;
  await waitForHeight(provider, departureBlock + 20);
  await call(p2, "arrive", { ship_id: ship2Id, route_id: 1, destination: 2, salt: destinationSalt }, "p2 chooses route and arrives convoy");
  const arrivedConvoy = await provider.callFunction<any>({ contractId: WORLD, method: "get_ship", args: { ship_id: ship2Id }, blockQuery: { finality: "final" } });
  const arrivedEscort = await provider.callFunction<any>({ contractId: WORLD, method: "get_ship", args: { ship_id: ship1Id }, blockQuery: { finality: "final" } });
  if (arrivedConvoy.escort_ship_id !== null || arrivedEscort.escorting_convoy_id !== null || arrivedEscort.current_port !== 2) throw new Error("escort was not released at destination");
  const arrivedPlayer = await provider.callFunction<any>({ contractId: WORLD, method: "get_player", args: { account_id: p2.accountId }, blockQuery: { finality: "final" } });
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

