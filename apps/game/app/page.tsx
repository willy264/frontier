"use client";

import { useEffect, useRef, useState } from "react";
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, type KeyPairString } from "near-api-js";
import type { NearConnector } from "@hot-labs/near-connect";

const WORLD = process.env.NEXT_PUBLIC_FRONTIER_WORLD_ACCOUNT ?? "world.frontier-uiriamuzu.testnet";
const RPC = process.env.NEXT_PUBLIC_FRONTIER_RPC_URL ?? "https://rpc.testnet.fastnear.com";
const GAME_METHODS = ["register_player", "buy", "sell", "build_ship", "depart", "arrive", "commit_ambush", "reveal_ambush", "offer_escort", "hire_escort", "set_port_sale_price", "buy_port"];
const provider = new JsonRpcProvider({ url: RPC });

const islands = [
  { id: 1, name: "Bitcoin Isle", short: "BTC", x: "14%", y: "26%", good: "Hashpower", price: 18, color: "gold" },
  { id: 2, name: "Solana Reef", short: "SOL", x: "48%", y: "15%", good: "Liquidity", price: 31, color: "aqua" },
  { id: 3, name: "Base Harbor", short: "BASE", x: "75%", y: "32%", good: "Blockspace", price: 44, color: "coral" },
  { id: 4, name: "Tron Bay", short: "TRX", x: "25%", y: "68%", good: "Blockspace", price: 39, color: "violet" },
  { id: 5, name: "NEAR Capital", short: "NEAR", x: "67%", y: "70%", good: "Hashpower", price: 23, color: "mint" },
] as const;
const routeLines = [["14%", "26%", "48%", "15%"], ["48%", "15%", "75%", "32%"], ["14%", "26%", "25%", "68%"], ["25%", "68%", "67%", "70%"], ["75%", "32%", "67%", "70%"]];
type LivePort = { owner_id: string; fee_bps: number; treasury: number; sale_price: number };
type Island = (typeof islands)[number];

export default function Home() {
  const [selected, setSelected] = useState<Island>(islands[0]);
  const [event, setEvent] = useState("Ready to sail. Pick a port to inspect its market.");
  const [tab, setTab] = useState<"map" | "economy">("map");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [livePort, setLivePort] = useState<LivePort | null>(null);
  const [economy, setEconomy] = useState<[string, string, string, number] | null>(null);
  const connector = useRef<NearConnector | null>(null);

  useEffect(() => {
    let active = true;
    import("@hot-labs/near-connect").then(async ({ NearConnector }) => {
      if (!active) return;
      const next = new NearConnector({ network: "testnet", providers: { testnet: [RPC] }, footerBranding: null });
      next.on("wallet:signIn", ({ accounts }) => {
        if (accounts[0]) { setAccountId(accounts[0].accountId); setEvent(`Connected ${accounts[0].accountId}.`); }
      });
      next.on("wallet:signOut", () => { setAccountId(null); setEvent("Wallet disconnected."); });
      connector.current = next;
      try {
        const connected = await next.getConnectedWallet();
        if (active && connected.accounts[0]) setAccountId(connected.accounts[0].accountId);
      } catch { /* no existing session */ }
    });
    return () => { active = false; connector.current?.removeAllListeners(); };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      provider.callFunction<LivePort>({ contractId: WORLD, method: "get_port", args: { port_id: selected.id }, blockQuery: { finality: "final" } }),
      provider.callFunction<[string, string, string, number]>({ contractId: WORLD, method: "economy", args: {}, blockQuery: { finality: "final" } }),
    ]).then(([port, nextEconomy]) => {
      if (active) { setLivePort(port ?? null); setEconomy(nextEconomy ?? null); }
    }).catch(() => { if (active) { setLivePort(null); setEconomy(null); } });
    return () => { active = false; };
  }, [selected.id, event]);

  async function connectWallet() {
    if (!connector.current) { setEvent("NEAR Connect is still loading."); return; }
    try {
      const saved = sessionStorage.getItem("frontier-game-key");
      const key = saved ? KeyPair.fromString(saved as KeyPairString) : KeyPair.fromRandom("ed25519");
      await connector.current.connect({ addFunctionCallKey: saved ? undefined : {
        contractId: WORLD,
        publicKey: key.getPublicKey().toString(),
        allowMethods: { anyMethod: false, methodNames: GAME_METHODS },
        gasAllowance: { kind: "limited", amount: "1000000000000000000000000" },
      } });
      sessionStorage.setItem("frontier-game-key", key.toString());
      const connected = await connector.current.getConnectedWallet();
      if (connected.accounts[0]) { setAccountId(connected.accounts[0].accountId); setEvent("Game-only key ready. Actions use the FRONTIER contract only."); }
    } catch (error) { setEvent(error instanceof Error ? error.message : "Wallet connection cancelled."); }
  }

  async function gameCall(methodName: string, args: Record<string, unknown>, message: string) {
    if (!accountId) { setEvent("Connect a testnet wallet first."); return; }
    const saved = sessionStorage.getItem("frontier-game-key");
    if (!saved) { setEvent("Connect again to provision the game-only key."); return; }
    try {
      const account = new Account(accountId, provider, new KeyPairSigner(KeyPair.fromString(saved as KeyPairString)));
      await account.callFunction({ contractId: WORLD, methodName, args, gas: 300n * 10n ** 12n, deposit: 0n });
      setEvent(message);
    } catch (error) { setEvent(error instanceof Error ? error.message : "Transaction failed."); }
  }

  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">F</span><span>FRONTIER</span><small>SEASON 01 / TESTNET</small></div><nav className="nav"><button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>World</button><button className={tab === "economy" ? "active" : ""} onClick={() => setTab("economy")}>Economy</button><button onClick={accountId ? () => connector.current?.disconnect() : connectWallet}>{accountId ? "Disconnect" : "Connect wallet"}</button></nav></header>
    <section className="status-row"><div><span className="eyebrow">CAPTAIN</span><strong>{accountId ?? "unclaimed.navigator"}</strong></div><div><span className="eyebrow">CRED BALANCE</span><strong>1,240 <em>+18 this epoch</em></strong></div><div><span className="eyebrow">NET WORTH</span><strong>2,860 CRED</strong></div><div className="session"><span className="dot" /> {accountId ? "GAME KEY READY" : "TESTNET LOGIN REQUIRED"}<small>{accountId ? `${GAME_METHODS.length} methods / 1 NEAR allowance` : "read-only map available"}</small></div></section>
    <div className="content-grid"><section className="map-panel"><div className="panel-heading"><div><span className="eyebrow">LIVE ARCHIPELAGO</span><h1>Routes are open.</h1></div><span className="block">TESTNET <i>600ms</i></span></div>{tab === "map" ? <div className="map" aria-label="Frontier map"><div className="sea-grid" />{routeLines.map(([x1, y1, x2, y2], index) => <div key={index} className="route" style={{ left: x1, top: y1, width: `${Math.hypot(parseFloat(x2) - parseFloat(x1), parseFloat(y2) - parseFloat(y1))}%`, transform: `rotate(${Math.atan2(parseFloat(y2) - parseFloat(y1), parseFloat(x2) - parseFloat(x1)) * 180 / Math.PI}deg)` }} />)}<div className="convoy convoy-one">S</div><div className="convoy convoy-two">?</div>{islands.map((island) => <button key={island.name} className={`island ${island.color} ${selected.name === island.name ? "selected" : ""}`} style={{ left: island.x, top: island.y }} onClick={() => setSelected(island)}><span>{island.short}</span><b>{island.name}</b><small>SELL {island.good.toUpperCase()} / {island.price} C</small></button>)}<div className="map-legend"><span><i className="legend-dot own" /> Your convoy</span><span><i className="legend-dot unknown" /> Sealed movement</span><span><i className="legend-line" /> Trade route</span></div></div> : <Economy economy={economy} />}<div className="event-line"><span className="pulse" />{event}</div></section>
      <aside className="side-column"><section className="card market-card"><div className="card-title"><span>PORT MARKET</span><button onClick={() => gameCall("buy_port", { port_id: selected.id }, `Port purchase submitted for ${selected.name}.`)}>Buy port</button></div><h2>{selected.name}</h2><p className="muted">Owned by <strong>{livePort?.owner_id ?? "loading testnet state"}</strong> · market fee <strong>{livePort ? `${(livePort.fee_bps / 100).toFixed(1)}%` : "--"}</strong></p><div className="price-row"><div><small>LOCAL SURPLUS</small><strong>{selected.good}</strong><span className="down">-12.4%</span></div><div><small>REFERENCE PRICE</small><strong>{selected.price} CRED</strong><span className="up">+4.8%</span></div></div><div className="trade-actions"><button onClick={() => gameCall("buy", { port_id: selected.id, good: selected.good, cred_in: "10", min_out: "0" }, `Buy order submitted at ${selected.name}.`)}>Buy cargo</button><button className="outline" onClick={() => gameCall("sell", { port_id: selected.id, good: selected.good, amount: "1", min_cred: "0" }, `Sell order submitted at ${selected.name}.`)}>Sell cargo</button></div></section><section className="card fleet-card"><div className="card-title"><span>YOUR FLEET</span><span className="count">2 SHIPS</span></div><div className="ship"><div className="ship-icon">S</div><div><strong>Sloop / ALPHA-07</strong><p>Empty · 100 cargo · defence 1</p></div><span className="ready">READY</span></div><div className="ship sailing"><div className="ship-icon">G</div><div><strong>Galleon / BRAVO-02</strong><p>Tron Bay → ? · arrives 00:42</p></div><span className="sailing-tag">SAILING</span></div><button className="wide" onClick={() => gameCall("build_ship", { kind: "sloop" }, "Sloop build submitted to the world contract.")}>Build a sloop <span>→</span></button></section><section className="card raid-card"><div className="card-title"><span>AMBUSH WINDOW</span><span className="window">OPEN · 00:28</span></div><h3>Route 03 / Base Harbor</h3><p className="muted">Commit a sealed raid before the convoy departs. Stake required: 10 CRED.</p><button className="danger wide" onClick={() => gameCall("commit_ambush", { route_id: 1, window: Math.floor(Date.now() / 1000) + 60, commit: Array.from(new Uint8Array(32)), stake: "10" }, "Ambush commitment submitted to the world contract.")}>Commit ambush <span>→</span></button><small className="helper">Your route and window stay hidden until reveal.</small></section></aside></div>
    <footer><span>FRONTIER / ON-CHAIN TRADING EMPIRE</span><span>TESTNET CONTRACT STATE</span><span>ECONOMY <b className="good-text">{economy ? "LIVE" : "READ ONLY"}</b></span></footer>
  </main>;
}

function Economy({ economy }: { economy: [string, string, string, number] | null }) { return <div className="economy"><div className="economy-head"><span className="eyebrow">ECONOMY PROOF</span><h2>Player behaviour sets the tide.</h2><p>Faucets and sinks from the deployed world contract. <strong>{economy ? "LIVE TESTNET" : "READ ONLY"}</strong></p></div><div className="chart"><div className="chart-line" /><div className="chart-labels"><span>10k CRED</span><span>9k</span><span>8k</span><span>7k</span></div></div><div className="economy-metrics"><div><small>SUPPLY</small><strong>{economy?.[0] ?? "--"}</strong><em>contract state</em></div><div><small>FAUCETS / EPOCH</small><strong>{economy?.[1] ?? "--"}</strong><em>NPC demand cap</em></div><div><small>EPOCH</small><strong>{economy?.[3] ?? "--"}</strong><em>world clock</em></div></div></div>; }
