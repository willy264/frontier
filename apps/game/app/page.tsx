"use client";
import { useEffect, useRef, useState } from "react";
import { SeaMap } from "./sea-map";
import { Economy } from "./components";
import { ActionPanel } from "./action-panel";
import { useGame } from "./use-game";
import { ISLANDS, WORLD, voyageProgress } from "./game-state";
export type Game = ReturnType<typeof useGame>;
export type Mode = "next" | "market" | "fleet" | "ambush";

export default function Home() {
  const game = useGame();
  const [tab, setTab] = useState("world");
  const [mode, setMode] = useState<Mode>("next");
  const [portId, setPortId] = useState(1);
  const [shipId, setShipId] = useState<number | null>(null);
  const [routeId, setRouteId] = useState(1);
  const [onboarding, setOnboarding] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const restoreInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (localStorage.getItem("frontier-intro-seen") !== "yes") setOnboarding(true); }, []);
  useEffect(() => { if (onboarding) dialog.current?.showModal(); else dialog.current?.close(); }, [onboarding]);
  function closeIntro() { localStorage.setItem("frontier-intro-seen", "yes"); setOnboarding(false); }
  function openPanel(next: Mode) { setMode(next); setTab("world"); if (matchMedia("(max-width: 900px)").matches) setTimeout(() => panel.current?.scrollIntoView({ block: "start", behavior: "instant" }), 0); }
  const markers = game.ships.flatMap(([id, ship]) => {
    const order = [...game.orders].reverse().find(o => o.kind === "departure" && o.shipId === id);
    const route = game.routes.find(r => r.route_id === order?.routeId);
    const progress = voyageProgress(ship, route, game.height);
    const from = ISLANDS.find(i => i.id === (ship.origin_port ?? ship.current_port));
    if (!from || ship.escorting_convoy_id !== null) return [];
    const to = progress.sailing && route ? ISLANDS.find(i => i.id === route.to_port) : undefined;
    return [{ id, x: to ? from.x + (to.x - from.x) * progress.progress : from.x + 4, y: to ? from.y + (to.y - from.y) * progress.progress : from.y - 9,
      label: `Ship ${id}`, status: progress.sailing ? progress.remaining === null ? "Orders needed" : progress.remaining > 0 ? `${progress.remaining} blocks` : "Ready to arrive" : "Docked", progress: progress.progress }];
  });
  return <main className="game-shell">
    <a className="skip-link" href="#captain-actions">Skip to captain actions</a>
    <header className="masthead"><a className="wordmark" href="/" aria-label="FRONTIER home">Frontier<span>Trading on the high seas</span></a><nav aria-label="Game views"><button aria-pressed={tab === "world"} onClick={() => setTab("world")}>World</button><button aria-pressed={tab === "economy"} onClick={() => setTab("economy")}>Economy</button><button onClick={() => setOnboarding(true)}>How to play</button></nav><button className="wallet-button" disabled={!!game.pending} onClick={game.accountId ? game.disconnect : game.connect}>{game.accountId ? "Disconnect" : "Connect wallet"}</button></header>
    <div className="captain-bar"><span className="network-label">NEAR testnet</span><span className="captain-name">{game.accountId ?? "Uncharted fortunes await"}</span><span className="balance">{game.accountId ? game.player ? `${game.player.cred} CRED` : game.readState === "ready" ? "Captain not registered" : game.readState === "error" ? "Balance unavailable" : "Checking balance…" : "Explore before connecting"}</span>{game.player && <span className="cargo-summary">{game.player.goods.reduce((a, b) => a + Number(b), 0)} goods in storage</span>}</div>
    {tab === "world" ? <section className="world-stage" aria-label="The archipelago">
      <div className="world-heading"><div><span className="eyebrow">The archipelago</span><h1>Trade the tides.</h1></div><p>Choose a port. Find your edge.<br /><span className="muted">Select a sea route to plan an ambush.</span></p><div className="world-status"><span className="height-label" role="status">{game.readState === "error" ? "Can’t reach testnet. Retrying…" : game.height ? `Block ${game.height.toLocaleString()}` : "Reading the tide…"}</span><button className="text-button" disabled={game.readState === "loading"} onClick={game.retry}>{game.readState === "error" ? "Retry connection" : "Refresh world"}</button></div></div>
      <div className="stage-layout"><div className="chart-stage"><SeaMap islands={ISLANDS} routes={game.routes.map(r => ({ id: r.route_id, from: r.from_port, to: r.to_port, blocks: r.distance }))} ships={markers} selectedIsland={portId} selectedRoute={mode === "ambush" ? routeId : null} selectedShip={shipId} onIsland={id => { setPortId(id); openPanel("market"); }} onRoute={id => { setRouteId(id); openPanel("ambush"); }} onShip={id => { setShipId(id); openPanel("fleet"); }} />
        <div className="map-caption"><span>One-way trade routes</span><span>{game.readState === "ready" ? `${game.ships.length} ships in your fleet` : game.readState === "error" ? "Position updates interrupted" : "Reading fleet positions…"}</span><button onClick={() => openPanel("fleet")}>Open fleet</button></div>
        <section className="ship-log" aria-label="Recent events"><div className="section-title"><h2>Captain’s log</h2><span>Confirmed orders</span></div>{game.events.length === 0 ? <p className="muted">Your trade and voyage results will appear here. Choose an island to inspect its market.</p> : <ol>{game.events.slice(0, 5).map(event => <li className={`log-entry ${event.tone}`} key={event.id}><time>{event.time}</time><span>{event.text}</span>{event.tx && <a href={`https://testnet.nearblocks.io/txns/${event.tx}`} target="_blank" rel="noreferrer">View receipt</a>}</li>)}</ol>}</section>
      </div><aside className="action-panel" id="captain-actions" tabIndex={-1} ref={panel}><div className="panel-context"><span>Captain’s orders</span><button className="text-button" onClick={() => setMode("next")}>Next step</button></div><ActionPanel game={game} mode={mode} setMode={setMode} portId={portId} setPortId={setPortId} shipId={shipId} setShipId={setShipId} routeId={routeId} /></aside></div>
    </section> : <><h1 className="economy-title">Economy</h1><Economy economy={game.economy} state={game.readState} snapshots={game.snapshots} retry={game.retry} /></>}
    {game.message && <div className={`event-toast ${game.events[0]?.tone ?? "normal"}`} role="status" aria-live="polite" key={game.message}><span>{game.pending ? "Order pending" : "Captain’s update"}</span><p>{game.message}</p></div>}
    <footer className="game-footer"><span>Frontier <small>Testnet strategy game</small></span><div><button className="text-button" onClick={() => setOnboarding(true)}>How to play</button><a href="/demo/index.html">Watch demo</a><a href="https://github.com/willy264/frontier#readme">Read the guide</a></div></footer>
    <details className="chain-details"><summary>How it works on-chain</summary><p>World: {WORLD}. Orders use a scoped NEAR function-call key. Hidden destinations and ambushes use commit-reveal. Backups contain secrets: keep them private. Disconnecting clears this browser session; revoke old keys in your wallet settings.</p><p>The current arrival event reports cargo losses, but does not distinguish a blocked raid from a route with no raid. Rival destinations are hidden; this map does not invent rival traffic.</p>{game.accountId && <div className="backup-actions"><button className="secondary" disabled={!game.orders.length} onClick={game.backup}>Back up your hidden orders</button><button className="secondary" onClick={() => restoreInput.current?.click()}>Restore hidden orders</button><input className="visually-hidden" ref={restoreInput} type="file" accept="application/json" aria-label="Hidden orders backup" onChange={e => { const file = e.target.files?.[0]; if (file) void game.restore(file); }} /></div>}</details>
    <dialog ref={dialog} onCancel={closeIntro} onClose={() => setOnboarding(false)} className="onboarding" aria-labelledby="intro-title"><span className="eyebrow">Welcome to Frontier</span><h2 id="intro-title">Your first trading voyage</h2><ol><li><b>Meet your captain.</b> Connect a testnet wallet and register.</li><li><b>Buy cargo.</b> Select an island and spend CRED at its market.</li><li><b>Build a ship.</b> Start with a sloop for 100 CRED.</li><li><b>Load and sail.</b> Choose an onward route and back up your hidden orders.</li><li><b>Reach the harbour.</b> Wait for the countdown, then arrive. Escorts can protect cargo.</li><li><b>Sell your cargo.</b> Review the live quote, sell, and plan your next voyage.</li></ol><p className="muted">Ambushes are optional. Select a sea route to set one. This tutorial does not move rival accounts.</p><button className="action" onClick={closeIntro}>Explore the map</button></dialog>
  </main>;
}
