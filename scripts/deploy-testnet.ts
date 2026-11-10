import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, type KeyPairString } from "near-api-js";

const ROOT = process.env.FRONTIER_ROOT_ACCOUNT ?? "frontier-uiriamuzu.testnet";
const WORLD = process.env.FRONTIER_WORLD_ACCOUNT ?? `world.${ROOT}`;
const RPC = process.env.FRONTIER_RPC_URL ?? "https://rpc.testnet.fastnear.com";
const networkId = "testnet";
const credentialsPath = path.join(os.homedir(), ".near-credentials", "testnet");
const wasmPath = path.resolve("contracts/world/target/near/frontier_world.wasm");

type Credential = { account_id?: string; public_key: string; private_key: KeyPairString };
async function readCredential(accountId: string): Promise<Credential & { account_id: string }> {
  const credential = JSON.parse(await fs.readFile(path.join(credentialsPath, `${accountId}.json`), "utf8")) as Credential;
  return { ...credential, account_id: accountId };
}
async function writeCredential(accountId: string, key: KeyPair) {
  await fs.mkdir(credentialsPath, { recursive: true });
  await fs.writeFile(path.join(credentialsPath, `${accountId}.json`), JSON.stringify({ account_id: accountId, public_key: key.getPublicKey().toString(), private_key: key.toString() }, null, 2));
}
function makeAccount(provider: JsonRpcProvider, credential: Credential) { return new Account(credential.account_id, provider, KeyPairSigner.fromSecretKey(credential.private_key)); }
async function exists(provider: JsonRpcProvider, accountId: string) { try { await provider.viewAccount({ accountId, blockQuery: { finality: "final" } }); return true; } catch { return false; } }

async function ensureSubaccount(root: Account, provider: JsonRpcProvider, accountId: string, amount: bigint) {
  if (await exists(provider, accountId)) return;
  const key = KeyPair.fromRandom("ed25519");
  await root.createAccount({ newAccountId: accountId, publicKey: key.getPublicKey(), nearToTransfer: amount });
  await writeCredential(accountId, key);
}
function txHash(outcome: { transaction_outcome: { id: string } }) { return outcome.transaction_outcome.id; }

async function main() {
  const provider = new JsonRpcProvider({ url: RPC });
  const root = makeAccount(provider, await readCredential(ROOT));
  await ensureSubaccount(root, provider, WORLD, 4n * 10n ** 24n);
  for (const name of ["p1", "p2", "p3", "p4"]) await ensureSubaccount(root, provider, `${name}.${ROOT}`, 1n * 10n ** 24n);
  const world = makeAccount(provider, await readCredential(WORLD));
  const wasm = await fs.readFile(wasmPath);
  const deploy = await world.deployContract(new Uint8Array(wasm));
  const initialized = await world
    .callFunctionRaw({ contractId: WORLD, methodName: "new", args: {}, gas: 200n * 10n ** 12n, deposit: 0n })
    .catch(async (error) => {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("already been initialized")) return { error: message };
      try {
        await provider.callFunction({ contractId: WORLD, method: "get_port", args: { port_id: 1 }, blockQuery: { finality: "final" } });
        return { alreadyInitialized: true };
      } catch {
        return { error: message };
      }
    });
  const output = {
    network: networkId,
    root: ROOT,
    world: WORLD,
    players: ["p1", "p2", "p3", "p4"].map((name) => `${name}.${ROOT}`),
    deployTx: txHash(deploy),
    initializationTx: "error" in initialized || "alreadyInitialized" in initialized ? undefined : txHash(initialized),
    initStatus: "alreadyInitialized" in initialized ? "already_initialized" : "error" in initialized ? "failed" : "initialized",
    initError: "error" in initialized ? initialized.error : undefined,
    wasmSha256: (await import("node:crypto")).createHash("sha256").update(wasm).digest("hex"),
    explorer: `https://testnet.nearblocks.io/address/${WORLD}`,
  };
  await fs.mkdir("results", { recursive: true });
  await fs.writeFile("results/deploy-testnet.json", JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });

