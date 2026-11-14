"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NearConnector } from "@hot-labs/near-connect";
import { hasGameKey, readRpc, view } from "./read-rpc";
import { createReadCache, pollDelay } from "./read-cache";
export { view } from "./read-rpc";
import { arrivalMessage, WORLD, RPC, SESSION_METHODS, WALLET_METHODS, type Port, type Route, type Ship, type Player, type Order, type GameEvent, type EconomySnapshot } from "./game-state";

const keySlot = `frontier-game-key:${WORLD}`;
const GAME_KEY_ALLOWANCE = "1000000000000000000000000";
// Game calls burn 2.7 to 7.2 Tgas. Wallet-held keys pay attached gas from a small allowance
// (Meteor defaults to 0.25 NEAR: 8 calls at 300 Tgas, 50 calls at 50 Tgas).
const CALL_GAS = 50n * 10n ** 12n;
type TxResult = Awaited<ReturnType<import("near-api-js").Account["callFunctionRaw"]>>;
// near-api-js 7 reports a missing signer key as "Access key ed25519:… does not exist at block height …".
const isKeyMissing = (error: unknown) => (error instanceof Error && /AccessKeyDoesNotExist/.test(error.name)) || /access ?key.*does not exist|InvalidAccessKey|InvalidSignature|missing from this browser/i.test(error instanceof Error ? error.message : String(error));
let client: Promise<import("near-api-js").JsonRpcProvider> | undefined;
const provider = () => client ??= import("near-api-js").then(({ JsonRpcProvider }) => new JsonRpcProvider({ url: RPC }));
export async function digest(text: string) { return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))); }
export function seal() { return Array.from(crypto.getRandomValues(new Uint8Array(24)), n => n.toString(16).padStart(2, "0")).join(""); }
function readOrders(slot: string): Order[] { try { const v: unknown = JSON.parse(localStorage.getItem(slot) ?? "[]"); return Array.isArray(v) ? v : []; } catch { return []; } }

export function useGame() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [ports, setPorts] = useState<Record<number, Port>>({});
  const [routes, setRoutes] = useState<Route[]>([]);
  const [ships, setShips] = useState<Array<[number, Ship]>>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  const [economy, setEconomy] = useState<EconomySnapshot | null>(null);
  const [height, setHeight] = useState(0);
  const [readState, setReadState] = useState<"loading" | "ready" | "error">("loading");
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [keyReady, setKeyReady] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [snapshots, setSnapshots] = useState<EconomySnapshot[]>([]);
  const connector = useRef<NearConnector | null>(null);
  const [walletRequested, setWalletRequested] = useState(false);
  const connectIntent = useRef(false);
  const lock = useRef(false);
  const signer = useRef<"session" | "wallet" | null>(null);
  const ordersRef = useRef<Order[]>([]);
  const reads = useRef(createReadCache());
  const slot = `frontier-orders:${WORLD}:${accountId ?? "guest"}`;
  const notify = useCallback((text: string, tone: GameEvent["tone"] = "normal", tx?: string) => {
    setMessage(text);
    setEvents(items => [{ id: crypto.randomUUID(), text, tone, tx, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...items].slice(0, 20));
  }, []);
  const retry = useCallback(() => {
    reads.current.invalidate("ports"); reads.current.invalidate("economy");
    setRefresh(n => n + 1);
  }, []);
  const saveOrders = useCallback((next: Order[]) => {
    // Persist BEFORE signing. If storage is full or blocked, do not sail.
    localStorage.setItem(slot, JSON.stringify(next));
    ordersRef.current = next; setOrders(next);
  }, [slot]);
  useEffect(() => { const next = readOrders(slot); ordersRef.current = next; setOrders(next); }, [slot]);
  useEffect(() => { setPlayer(null); setShips([]); setEvents([]); setMessage(""); }, [accountId]);
  useEffect(() => {
    let active = true;
    setReadState("loading");
    let timer: ReturnType<typeof setTimeout>;
    let failures = 0;
    async function portsRead() {
      const result: Array<Port | null> = [];
      for (const id of [1, 2, 3, 4, 5]) result.push(await view<Port | null>("get_port", { port_id: id }));
      return result;
    }
    async function routesRead() {
      const result: Array<Route | null> = [];
      for (const id of [1, 2, 3, 4, 5]) result.push(await view<Route | null>("get_route", { route_id: id }));
      return result;
    }
    const poll = async () => {
      try {
        const [portList, routeList, nextEconomy, block, nextPlayer, nextShips] = await Promise.all([
          reads.current.get("ports", 30000, portsRead),
          reads.current.get("routes", Infinity, routesRead),
          reads.current.get("economy", 30000, () => view<EconomySnapshot>("economy_dashboard")), readRpc<{ header: { height: number } }>("block", { finality: "final" }),
          accountId ? view<Player | null>("get_player", { account_id: accountId }) : Promise.resolve(null),
          accountId ? view<Array<[number, Ship]>>("ships_for_owner", { account_id: accountId }) : Promise.resolve([]),
        ]);
        if (!active) return;
        setPorts(Object.fromEntries(portList.flatMap((port, i) => port ? [[i + 1, port]] : [])));
        setRoutes(routeList.filter((route): route is Route => route !== null));
        setEconomy(nextEconomy); setHeight(block.header.height); setPlayer(nextPlayer); setShips(nextShips);
        setReadState("ready");
        failures = 0;
        setSnapshots(items => [...items.filter(item => item.epoch !== nextEconomy.epoch), nextEconomy].slice(-20));
      } catch { failures++; if (active) setReadState("error"); }
      if (active) timer = setTimeout(poll, pollDelay(failures));
    };
    void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [accountId, refresh]);
  useEffect(() => {
    if (!walletRequested) return;
    let active = true;
    import("@hot-labs/near-connect").then(async ({ NearConnector }) => {
      if (!active) return;
      const next = new NearConnector({ network: "testnet", providers: { testnet: [RPC] }, footerBranding: null });
      connector.current = next;
      next.on("wallet:signIn", ({ accounts }) => { if (active) { signer.current = null; setAccountId(accounts[0]?.accountId ?? null); setKeyReady(!!accounts[0]); } });
      next.on("wallet:signOut", () => { if (active) { setAccountId(null); setKeyReady(false); } });
      try { const connected = await next.getConnectedWallet(); if (active) { signer.current = null; setAccountId(connected.accounts[0]?.accountId ?? null); setKeyReady(!!connected.accounts[0]); } } catch { /* browsing without a wallet */ }
      if (active && connectIntent.current) { connectIntent.current = false; await connect(); }
    }).catch(() => { if (active) setMessage("Wallet tools could not load. Reload the page to retry."); });
    return () => { active = false; connector.current?.removeAllListeners(); };
  }, [walletRequested]);
  // Some wallets (Meteor) add and keep their own function-call key at sign-in, ignore ours, and sign
  // covered game calls with it without a prompt. Sign locally only when the chain holds our key.
  async function chooseSigner(account: string): Promise<"session" | "wallet"> {
    const saved = sessionStorage.getItem(keySlot);
    if (!saved) return "wallet";
    const { KeyPair } = await import("near-api-js");
    const publicKey = KeyPair.fromString(saved as import("near-api-js").KeyPairString).getPublicKey().toString();
    return await hasGameKey(account, publicKey).catch(() => false) ? "session" : "wallet";
  }
  async function sendViaWallet(method: string, args: Record<string, unknown>) {
    const wallet = await connector.current!.wallet();
    const outcome = await wallet.signAndSendTransaction({ receiverId: WORLD, actions: [{ type: "FunctionCall", params: { methodName: method, args, gas: CALL_GAS.toString(), deposit: "0" } }] });
    // Same RPC transaction JSON; near-connect and near-api-js type it from different packages.
    return outcome as unknown as TxResult;
  }
  async function sendWithSessionKey(account: string, method: string, args: Record<string, unknown>) {
    const saved = sessionStorage.getItem(keySlot);
    if (!saved) throw new Error("Game key missing from this browser");
    const { Account, KeyPairSigner } = await import("near-api-js");
    const signerAccount = new Account(account, await provider(), KeyPairSigner.fromSecretKey(saved as import("near-api-js").KeyPairString));
    return signerAccount.callFunctionRaw({ contractId: WORLD, methodName: method, args, gas: CALL_GAS, deposit: 0n });
  }
  async function connect() {
    if (lock.current) return;
    if (!connector.current) { connectIntent.current = true; setWalletRequested(true); setMessage("Loading wallet tools…"); return; }
    lock.current = true; setPending("connect");
    try {
      const { KeyPair } = await import("near-api-js");
      const key = KeyPair.fromRandom("ed25519");
      // Store before redirects, without assuming that the wallet approved it.
      sessionStorage.setItem(keySlot, key.toString());
      await connector.current.connect({ addFunctionCallKey: { contractId: WORLD, publicKey: key.getPublicKey().toString(), allowMethods: { anyMethod: false, methodNames: SESSION_METHODS }, gasAllowance: { kind: "limited", amount: GAME_KEY_ALLOWANCE } } });
      const connected = await connector.current.getConnectedWallet();
      const account = connected.accounts[0]?.accountId ?? null;
      setAccountId(account);
      signer.current = account ? await chooseSigner(account) : null;
      setKeyReady(!!account);
      if (account) notify("Wallet connected. Your captain is ready to join.");
    } catch { setKeyReady(false); setMessage("Wallet connection was not completed. Try connecting again."); }
    finally { lock.current = false; setPending(null); }
  }
  async function enableControls() {
    if (!accountId || !connector.current) return connect();
    if (lock.current) return;
    lock.current = true; setPending("connect");
    try {
      signer.current = await chooseSigner(accountId);
      setKeyReady(true);
      notify("Game controls enabled. Your captain is ready to join.");
    } catch { setMessage("Game controls were not enabled. Reconnect your wallet and try again."); }
    finally { lock.current = false; setPending(null); }
  }
  async function disconnect() { await connector.current?.disconnect(); setAccountId(null); setKeyReady(false); sessionStorage.removeItem(keySlot); }
  async function call(method: string, args: Record<string, unknown>, success: string, arrival?: { destination: number; cargo: number[]; escorted: boolean }) {
    if (lock.current) return null;
    if (!accountId) { setMessage("Connect your testnet wallet to play."); return null; }
    if (!connector.current) { setMessage("Wallet tools are still loading. Try again in a moment."); return null; }
    const walletOnly = WALLET_METHODS.includes(method);
    lock.current = true; setPending(method); setMessage(walletOnly ? "Approve this order in your wallet." : "Sending your order. Waiting for testnet confirmation…");
    try {
      if (!walletOnly && signer.current === null) signer.current = await chooseSigner(accountId);
      const result: TxResult = walletOnly || signer.current === "wallet" ? await sendViaWallet(method, args) : await sendWithSessionKey(accountId, method, args).catch(error => {
        if (!isKeyMissing(error)) throw error;
        // Our key is not on the account (the wallet kept its own). Let the wallet sign from now on.
        signer.current = "wallet";
        return sendViaWallet(method, args);
      });
      if (typeof result.status === "object" && "Failure" in result.status) throw new Error(JSON.stringify(result.status.Failure));
      const tx = result.transaction.hash;
      let confirmedMessage = success;
      let tone: GameEvent["tone"] = "normal";
      for (const log of result.receipts_outcome.flatMap(r => r.outcome.logs)) {
        if (!log.startsWith("EVENT_JSON:")) continue;
        try {
          const event = JSON.parse(log.slice(11)) as { event: string; data: Array<{ value: string }> };
          if (event.event === "arrived" && arrival) {
            confirmedMessage = arrivalMessage(event.data[0].value, arrival.destination, arrival.cargo, arrival.escorted);
            tone = event.data[0].value.includes("raided=true") ? "danger" : arrival.escorted ? "escort" : "normal";
          }
          if (event.event === "trade") {
            const [side, , good, amount] = event.data[0].value.split(":");
            confirmedMessage = side === "buy" ? `Bought ${amount} ${["Hashpower", "Liquidity", "Blockspace"][Number(good)]}.` : `Sold cargo for ${amount} CRED.`;
          }
        } catch { /* Unknown events stay in the explorer, not invented UI results. */ }
      }
      notify(confirmedMessage, tone, tx); retry(); return result;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      const errors: Record<string, string> = { ERR_SLIPPAGE: "The market price moved. Review the new quote and try again.", ERR_CRED_FUNDS: "You need more CRED for this order.", ERR_CARGO_FUNDS: "Your available cargo changed. Reload the port and adjust the load.", ERR_TOO_EARLY: "Your convoy is still sailing. Wait for the countdown.", ERR_REVEAL_LATE: "The ambush window has closed.", ERR_PLAYER_EXISTS: "This captain is already registered. Refresh your fleet.", ERR_ESCORT_LOCKED: "This ship is escorting a convoy. Wait for its arrival.", ERR_WINDOW: "That ambush window had already started. Choose a later window and try again.", ERR_COMMIT_SPAM: "You already have three active ambushes. Spring one or wait for it to expire.", publishing_transaction_failed: "The contract rejected this order. For ambushes this usually means the window passed while the wallet was open; check the countdown and try again." };
      if (isKeyMissing(error)) { signer.current = "wallet"; setMessage("Your wallet could not sign this order. Try again; your wallet may ask you to approve it."); return null; }
      setMessage(Object.entries(errors).find(([code]) => detail.includes(code))?.[1] ?? "The order was not confirmed. Refresh before retrying; check your wallet activity if it persists.");
      return null;
    } finally { lock.current = false; setPending(null); }
  }
  function remember(order: Order) { saveOrders([...ordersRef.current.filter(item => item.id !== order.id), order]); }
  function removeOrder(id: string) { saveOrders(ordersRef.current.filter(item => item.id !== id)); }
  function backup() {
    const blob = new Blob([JSON.stringify({ world: WORLD, accountId, orders: ordersRef.current }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "frontier-hidden-orders.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function restore(file: File) {
    try {
      const data = JSON.parse(await file.text()) as { world?: string; accountId?: string; orders?: Order[] };
      if (data.world !== WORLD || data.accountId !== accountId || !Array.isArray(data.orders)) throw new Error("Wrong captain");
      if (!data.orders.every(o => ["ambush", "departure"].includes(o.kind) && typeof o.salt === "string" && typeof o.id === "string" && Number.isInteger(o.routeId))) throw new Error("Invalid backup");
      saveOrders([...ordersRef.current.filter(o => !data.orders!.some(n => n.id === o.id)), ...data.orders]); notify("Hidden orders restored for this captain.");
    } catch { setMessage("This backup does not match your captain and world, or could not be read."); }
  }
  return { accountId, ports, routes, ships, player, economy, height, readState, pending, message, events, orders, keyReady, snapshots, connect, enableControls, disconnect, call, retry, notify, remember, removeOrder, backup, restore };
}
