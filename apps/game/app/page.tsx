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
const routes = [{ id: 1, from: 1, to: 2, blocks: 12 }, { id: 2, from: 2, to: 3, blocks: 15 }, { id: 3, from: 1, to: 4, blocks: 18 }, { id: 4, from: 4, to: 5, blocks: 20 }, { id: 5, from: 3, to: 5, blocks: 14 }];
const routeLines = [["14%", "26%", "48%", "15%"], ["48%", "15%", "75%", "32%"], ["14%", "26%", "25%", "68%"], ["25%", "68%", "67%", "70%"], ["75%", "32%", "67%", "70%"]];
type LivePort = { owner_id: string; fee_bps: number; treasury: number; sale_price: number };
type Economy = { cred_supply: string; npc_faucet: string; sinks: string; spoilage: string; epoch: number };
type Island = (typeof islands)[number];
type SecretRecord = { kind: "ambush" | "departure"; id: string; routeId: number; window?: number; shipId?: number; destination: number; salt: string; createdAt: string; revealed?: boolean };

function loadSecrets(): SecretRecord[] { try { return JSON.parse(localStorage.getItem("frontier-commit-secrets") ?? "[]") as SecretRecord[]; } catch { return []; } }
function saveSecrets(records: SecretRecord[]) { localStorage.setItem("frontier-commit-secrets", JSON.stringify(records)); }
function randomSalt() { const bytes = new Uint8Array(18); crypto.getRandomValues(bytes); return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""); }
async function digest(text: string) { const bytes = new TextEncoder().encode(text); return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))); }

export default function Home() {
  const [selected, setSelected] = useState<Island>(islands[0]);
  const [tab, setTab] = useState<"map" | "economy">("map");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [livePort, setLivePort] = useState<LivePort | null>(null);
  const [economy, setEconomy] = useState<Economy | null>(null);
  const [player, setPlayer] = useState<{ cred: string; goods: string[] } | null>(null);
  const [event, setEvent] = useState("Read the six steps, then connect a testnet wallet.");
  const [feed, setFeed] = useState<string[]>([]);
  const [secrets, setSecrets] = useState<SecretRecord[]>([]);
  const [shipId, setShipId] = useState("");
  const [routeId, setRouteId] = useState("1");
  const [destination, setDestination] = useState("2");
  const [practiceRunning, setPracticeRunning] = useState(false);
  const connector = useRef<NearConnector | null>(null);

  useEffect(() => { setSecrets(loadSecrets()); }, []);
  useEffect(() => {
    let active = true;
    import("@hot-labs/near-connect").then(async ({ NearConnector }) => {
      if (!active) return;
      const next = new NearConnector({ network: "testnet", providers: { testnet: [RPC] }, footerBranding: null });
      next.on("wallet:signIn", ({ accounts }) => { if (accounts[0]) { setAccountId(accounts[0].accountId); setEvent(`Connected ${accounts[0].accountId}.`); addFeed(`Game-only key active for ${accounts[0].accountId}.`); } });
      next.on("wallet:signOut", () => { setAccountId(null); setEvent("Wallet disconnected."); });
      connector.current = next;
      try { const connected = await next.getConnectedWallet(); if (active && connected.accounts[0]) setAccountId(connected.accounts[0].accountId); } catch { /* no session */ }
    });
    return () => { active = false; connector.current?.removeAllListeners(); };
  }, []);
  useEffect(() => {
    let active = true;
    const reads: Promise<unknown>[] = [
      provider.callFunction<LivePort>({ contractId: WORLD, method: "get_port", args: { port_id: selected.id }, blockQuery: { finality: "final" } }),
      provider.callFunction<Economy>({ contractId: WORLD, method: "economy_dashboard", args: {}, blockQuery: { finality: "final" } }),
    ];
    if (accountId) reads.push(provider.callFunction<{ cred: string; goods: string[] }>({ contractId: WORLD, method: "get_player", args: { account_id: accountId }, blockQuery: { finality: "final" } }));
    Promise.all(reads).then(([port, nextEconomy, nextPlayer]) => { if (active) { setLivePort(port as LivePort); setEconomy(nextEconomy as Economy); if (nextPlayer) setPlayer(nextPlayer as { cred: string; goods: string[] }); } }).catch(() => { if (active) setEvent("Read-only mode: the testnet RPC is unavailable."); });
    return () => { active = false; };
  }, [selected.id, accountId, event]);

  function addFeed(message: string) { setFeed((items) => [`${new Date().toLocaleTimeString()}  ${message}`, ...items].slice(0, 8)); }
  function remember(record: SecretRecord) { const next = [...secrets.filter((item) => item.id !== record.id), record]; setSecrets(next); saveSecrets(next); }
  function downloadBackup() { const blob = new Blob([JSON.stringify(secrets, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "frontier-commit-secrets.json"; link.click(); URL.revokeObjectURL(link.href); }
  async function connectWallet() {
    if (!connector.current) { setEvent("NEAR Connect is still loading."); return; }
    try {
      const saved = sessionStorage.getItem("frontier-game-key");
      const key = saved ? KeyPair.fromString(saved as KeyPairString) : KeyPair.fromRandom("ed25519");
      await connector.current.connect({ addFunctionCallKey: saved ? undefined : { contractId: WORLD, publicKey: key.getPublicKey().toString(), allowMethods: { anyMethod: false, methodNames: GAME_METHODS }, gasAllowance: { kind: "limited", amount: "1000000000000000000000000" } } });
      sessionStorage.setItem("frontier-game-key", key.toString());
      const connected = await connector.current.getConnectedWallet();
      if (connected.accounts[0]) { setAccountId(connected.accounts[0].accountId); setEvent("Game-only key ready. Register to receive starter CRED."); }
    } catch (error) { setEvent(error instanceof Error ? error.message : "Wallet connection cancelled."); }
  }
  async function gameCall(methodName: string, args: Record<string, unknown>, message: string) {
    if (!accountId) { setEvent("Connect a testnet wallet first."); return false; }
    const saved = sessionStorage.getItem("frontier-game-key");
    if (!saved) { setEvent("Connect again to provision the game-only key."); return false; }
    try { const account = new Account(accountId, provider, new KeyPairSigner(KeyPair.fromString(saved as KeyPairString))); await account.callFunction({ contractId: WORLD, methodName, args, gas: 300n * 10n ** 12n, deposit: 0n }); setEvent(message); addFeed(message); return true; }
    catch (error) { setEvent(error instanceof Error ? error.message : "Transaction failed."); addFeed("Transaction rejected: check the result and try again."); return false; }
  }
  async function commitAmbush() {
    const chosenRoute = routes.find((item) => item.id === Number(routeId)) ?? routes[0]; const salt = randomSalt(); const window = (await provider.viewBlock({ finality: "final" })).header.height + 20; const commit = await digest(`${chosenRoute.id}:${salt}`); const id = `ambush-${chosenRoute.id}-${window}`;
    remember({ kind: "ambush", id, routeId: chosenRoute.id, window, destination: chosenRoute.to, salt, createdAt: new Date().toISOString() });
    await gameCall("commit_ambush", { route_id: chosenRoute.id, window, commit, stake: "10" }, `Ambush committed on route ${chosenRoute.id}; reveal before block ${window + 20}.`);
  }
  async function revealAmbush(record: SecretRecord) { if (await gameCall("reveal_ambush", { route_id: record.routeId, window: record.window, salt: record.salt, power: "3" }, `Ambush revealed on route ${record.routeId}.`)) { const next = secrets.map((item) => item.id === record.id ? { ...item, revealed: true } : item); setSecrets(next); saveSecrets(next); } }
  async function depart() {
    const chosenRoute = routes.find((item) => item.id === Number(routeId)) ?? routes[0]; const salt = randomSalt(); const commit = await digest(`${Number(destination)}:${chosenRoute.id}:${salt}`); const id = `departure-${shipId}-${Date.now()}`;
    remember({ kind: "departure", id, routeId: chosenRoute.id, shipId: Number(shipId), destination: Number(destination), salt, createdAt: new Date().toISOString() });
    await gameCall("depart", { ship_id: Number(shipId), route_id: chosenRoute.id, destination_commit: commit, cargo: ["0", "0", "0"] }, `Ship ${shipId} departed with a sealed destination. Save the salt backup.`);
  }
  async function arrive(record: SecretRecord) { if (await gameCall("arrive", { ship_id: record.shipId, destination: record.destination, salt: record.salt }, `Ship ${record.shipId} arrived at ${islands.find((item) => item.id === record.destination)?.name}.`)) { const next = secrets.filter((item) => item.id !== record.id); setSecrets(next); saveSecrets(next); } }
  function startPractice() {
    if (practiceRunning) return; setPracticeRunning(true); const steps = ["SCRIPTED p1 buys Hashpower on Bitcoin Isle.", "SCRIPTED p2 sails a sealed convoy toward Base Harbor.", "SCRIPTED p3 commits a route ambush with a deterministic salt.", "SCRIPTED p3 reveals inside the ambush window.", "SCRIPTED p2 reaches the route: ambush result is now visible."]; steps.forEach((step, index) => setTimeout(() => { addFeed(step); if (index === steps.length - 1) { setPracticeRunning(false); setEvent("Practice round complete. Connect a wallet to play the live loop."); } }, index * 30000)); addFeed("Scripted practice started; the next ambush resolves in about 2 minutes.");
  }

  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">F</span><span>FRONTIER</span><small>SEASON 01 / TESTNET</small></div><nav className="nav"><button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>World</button><button className={tab === "economy" ? "active" : ""} onClick={() => setTab("economy")}>Economy</button><button onClick={accountId ? () => connector.current?.disconnect() : connectWallet}>{accountId ? "Disconnect" : "Connect wallet"}</button></nav></header>
    <section className="status-row"><div><span className="eyebrow">CAPTAIN</span><strong>{accountId ?? "unclaimed.navigator"}</strong></div><div><span className="eyebrow">CRED BALANCE</span><strong>{player?.cred ?? "--"}<em>live contract</em></strong></div><div><span className="eyebrow">SAVED SECRETS</span><strong>{secrets.length}<em>browser vault</em></strong></div><div className="session"><span className="dot" /> {accountId ? "GAME KEY READY" : "TESTNET LOGIN REQUIRED"}<small>{accountId ? "contract calls enabled" : "read-only map"}</small></div></section>
    {!accountId && <section className="how-to card"><div><span className="eyebrow">HOW TO PLAY / 6 STEPS</span><h2>One loop, fully on-chain.</h2></div><ol><li>Connect a testnet wallet and register for starter CRED.</li><li>Buy a scarce good at the selected port.</li><li>Build a sloop and copy its ID into Fleet.</li><li>Choose a route and depart; the destination is sealed.</li><li>Commit an ambush, then reveal it inside the window.</li><li>Arrive with your saved salt, sell high, and watch spoilage in Economy.</li></ol></section>}
    <div className="content-grid"><section className="map-panel"><div className="panel-heading"><div><span className="eyebrow">LIVE ARCHIPELAGO</span><h1>Routes are open.</h1></div><span className="block">TESTNET <i>600ms</i></span></div>{tab === "map" ? <div className="map" aria-label="Frontier map"><div className="sea-grid" />{routeLines.map(([x1, y1, x2, y2], index) => <div key={index} className="route" style={{ left: x1, top: y1, width: `${Math.hypot(parseFloat(x2) - parseFloat(x1), parseFloat(y2) - parseFloat(y1))}%`, transform: `rotate(${Math.atan2(parseFloat(y2) - parseFloat(y1), parseFloat(x2) - parseFloat(x1)) * 180 / Math.PI}deg)` }} />)}<div className="convoy convoy-one">S</div><div className="convoy convoy-two">?</div>{islands.map((island) => <button key={island.name} className={`island ${island.color} ${selected.name === island.name ? "selected" : ""}`} style={{ left: island.x, top: island.y }} onClick={() => setSelected(island)}><span>{island.short}</span><b>{island.name}</b><small>SELL {island.good.toUpperCase()} / {island.price} C</small></button>)}<div className="map-legend"><span><i className="legend-dot own" /> Your convoy</span><span><i className="legend-dot unknown" /> Sealed movement</span><span><i className="legend-line" /> Trade route</span></div></div> : <Economy economy={economy} />}<div className="event-line"><span className="pulse" />{event}</div></section>
      <aside className="side-column"><section className="card market-card"><div className="card-title"><span>PORT MARKET</span><button onClick={() => gameCall("buy_port", { port_id: selected.id }, `Port purchase submitted for ${selected.name}.`)}>Buy port</button></div><h2>{selected.name}</h2><p className="muted">Owned by <strong>{livePort?.owner_id ?? "loading testnet state"}</strong> / fee <strong>{livePort ? `${(livePort.fee_bps / 100).toFixed(1)}%` : "--"}</strong></p><div className="price-row"><div><small>LOCAL GOOD</small><strong>{selected.good}</strong></div><div><small>REFERENCE PRICE</small><strong>{selected.price} CRED</strong></div></div><div className="trade-actions"><button onClick={() => gameCall("buy", { port_id: selected.id, good: selected.good, cred_in: "10", min_out: "0" }, `Bought ${selected.good} at ${selected.name}.`)}>Buy cargo</button><button className="outline" onClick={() => gameCall("sell", { port_id: selected.id, good: selected.good, amount: "1", min_cred: "0" }, `Sold cargo at ${selected.name}.`)}>Sell cargo</button></div>{!accountId && <button className="wide" onClick={() => gameCall("register_player", {}, "Captain registered. Starter CRED is ready.")}>Register player</button>}</section>
        <section className="card fleet-card"><div className="card-title"><span>FLEET / HIDDEN DEPARTURE</span><span className="count">{player?.goods?.join(" / ") ?? "--"}</span></div><div className="form-row"><label>Ship ID<input value={shipId} onChange={(e) => setShipId(e.target.value)} placeholder="from build result" /></label><label>Route<select value={routeId} onChange={(e) => setRouteId(e.target.value)}>{routes.map((route) => <option key={route.id} value={route.id}>R{route.id} / {route.blocks} blocks</option>)}</select></label></div><label>Destination<select value={destination} onChange={(e) => setDestination(e.target.value)}>{islands.map((island) => <option key={island.id} value={island.id}>{island.name}</option>)}</select></label><button className="wide" onClick={() => gameCall("build_ship", { kind: "sloop" }, "Sloop built. Copy the returned ship ID into Fleet.")}>Build a sloop</button><button className="wide outline-wide" onClick={depart}>Depart with sealed destination</button></section>
        <section className="card raid-card"><div className="card-title"><span>AMBUSH / COMMIT-REVEAL</span><span className="window">STAKE 10 CRED</span></div><label>Route<select value={routeId} onChange={(e) => setRouteId(e.target.value)}>{routes.map((route) => <option key={route.id} value={route.id}>Route {route.id}</option>)}</select></label><button className="danger wide" onClick={commitAmbush}>Commit ambush and save salt</button><button className="wide outline-wide" onClick={downloadBackup}>Download salt backup</button><small className="helper">Reveal buttons appear below after the transaction.</small></section>
        <section className="card practice-card"><div className="card-title"><span>PRACTICE MODE</span><span className="window">SCRIPTED</span></div><p className="muted">Rule-based p1-p4 rivals trade, sail, and set an ambush. No AI agent is involved.</p><button className="wide" onClick={startPractice} disabled={practiceRunning}>{practiceRunning ? "Practice running..." : "Spawn scripted rivals"}</button></section>
      </aside></div>
    <section className="card secret-card"><div className="card-title"><span>COMMIT-REVEAL WINDOW</span><span>LOCAL STORAGE + BACKUP</span></div>{secrets.length === 0 ? <p className="muted">No saved departure or ambush secrets yet.</p> : secrets.map((record) => <div className="secret-row" key={record.id}><span><strong>{record.kind === "ambush" ? "AMBUSH" : "DEPARTURE"}</strong> / route {record.routeId} / {record.kind === "ambush" ? `window ${record.window}` : `ship ${record.shipId}`}</span>{record.kind === "ambush" ? <button onClick={() => revealAmbush(record)} disabled={record.revealed}>{record.revealed ? "Revealed" : "Reveal ambush"}</button> : <button onClick={() => arrive(record)}>Reveal destination / arrive</button>}</div>)}</section>
    <section className="card feed-card"><div className="card-title"><span>RESULT FEED</span><span>NEP-297 EVENTS / UI LOG</span></div>{feed.length === 0 ? <p className="muted">Trade, sail, or start practice mode to see results here.</p> : feed.map((item) => <div className="feed-item" key={item}>{item}</div>)}</section>
    <footer><span>FRONTIER / ON-CHAIN TRADING EMPIRE</span><span>TESTNET CONTRACT STATE</span><span>ECONOMY <b className="good-text">{economy ? "LIVE" : "READ ONLY"}</b></span></footer>
  </main>;
}

function Economy({ economy }: { economy: Economy | null }) { return <div className="economy"><div className="economy-head"><span className="eyebrow">ECONOMY PROOF</span><h2>Player behaviour sets the tide.</h2><p>Live faucets and sinks from the deployed world contract.</p></div><div className="chart"><div className="chart-line" /><div className="chart-labels"><span>SUPPLY</span><span>SINKS</span><span>SPOILAGE</span></div></div><div className="economy-metrics"><div><small>SUPPLY</small><strong>{economy?.cred_supply ?? "--"}</strong><em>contract state</em></div><div><small>FAUCETS / EPOCH</small><strong>{economy?.npc_faucet ?? "--"}</strong><em>NPC cap 160</em></div><div><small>SPOILAGE SINK</small><strong>{economy?.spoilage ?? "--"}</strong><em>goods lost</em></div></div></div>; }
