"use client";

import { useState } from "react";

const islands = [
  { name: "Bitcoin Isle", short: "BTC", x: "14%", y: "26%", good: "Hashpower", price: 18, color: "gold" },
  { name: "Solana Reef", short: "SOL", x: "48%", y: "15%", good: "Liquidity", price: 31, color: "aqua" },
  { name: "Base Harbor", short: "BASE", x: "75%", y: "32%", good: "Blockspace", price: 44, color: "coral" },
  { name: "Tron Bay", short: "TRX", x: "25%", y: "68%", good: "Blockspace", price: 39, color: "violet" },
  { name: "NEAR Capital", short: "NEAR", x: "67%", y: "70%", good: "Hashpower", price: 23, color: "mint" }
];

const routeLines = [
  ["14%", "26%", "48%", "15%"], ["48%", "15%", "75%", "32%"],
  ["14%", "26%", "25%", "68%"], ["25%", "68%", "67%", "70%"],
  ["75%", "32%", "67%", "70%"]
];

export default function Home() {
  const [selected, setSelected] = useState(islands[0]);
  const [event, setEvent] = useState("Ready to sail. Pick a port to inspect its market.");
  const [tab, setTab] = useState("map");

  function action(message: string) {
    setEvent(message);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">F</span><span>FRONTIER</span><small>SEASON 01 / TESTNET</small></div>
        <nav className="nav"><button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>World</button><button className={tab === "economy" ? "active" : ""} onClick={() => setTab("economy")}>Economy</button><button onClick={() => action("Wallet connection is staged for the NEAR session-key flow.")}>Connect wallet</button></nav>
      </header>

      <section className="status-row">
        <div><span className="eyebrow">CAPTAIN</span><strong>unclaimed.navigator</strong></div>
        <div><span className="eyebrow">CRED BALANCE</span><strong>1,240 <em>+18 this epoch</em></strong></div>
        <div><span className="eyebrow">NET WORTH</span><strong>2,860 CRED</strong></div>
        <div className="session"><span className="dot" /> GAME KEY READY <small>6 methods / 0.04 NEAR allowance</small></div>
      </section>

      <div className="content-grid">
        <section className="map-panel">
          <div className="panel-heading"><div><span className="eyebrow">LIVE ARCHIPELAGO</span><h1>Routes are open.</h1></div><span className="block">BLOCK 18,420,991 <i>600ms</i></span></div>
          {tab === "map" ? <div className="map" aria-label="Frontier map">
            <div className="sea-grid" />
            {routeLines.map(([x1, y1, x2, y2], index) => <div key={index} className="route" style={{ left: x1, top: y1, width: `${Math.hypot(parseFloat(x2) - parseFloat(x1), parseFloat(y2) - parseFloat(y1))}%`, transform: `rotate(${Math.atan2(parseFloat(y2) - parseFloat(y1), parseFloat(x2) - parseFloat(x1)) * 180 / Math.PI}deg)` }} />)}
            <div className="convoy convoy-one">S</div><div className="convoy convoy-two">?</div>
            {islands.map((island) => <button key={island.name} className={`island ${island.color} ${selected.name === island.name ? "selected" : ""}`} style={{ left: island.x, top: island.y }} onClick={() => setSelected(island)}><span>{island.short}</span><b>{island.name}</b><small>SELL {island.good.toUpperCase()} / {island.price} C</small></button>)}
            <div className="map-legend"><span><i className="legend-dot own" /> Your convoy</span><span><i className="legend-dot unknown" /> Sealed movement</span><span><i className="legend-line" /> Trade route</span></div>
          </div> : <Economy />}
          <div className="event-line"><span className="pulse" />{event}</div>
        </section>

        <aside className="side-column">
          <section className="card market-card"><div className="card-title"><span>PORT MARKET</span><button onClick={() => action("Port ownership offers open after the auction window.")}>Buy port</button></div><h2>{selected.name}</h2><p className="muted">Owned by <strong>{selected.name === "Bitcoin Isle" ? "you" : "Mara.V"}</strong> · market fee <strong>{selected.name === "Bitcoin Isle" ? "3.0%" : "6.5%"}</strong></p><div className="price-row"><div><small>LOCAL SURPLUS</small><strong>{selected.good}</strong><span className="down">-12.4%</span></div><div><small>REFERENCE PRICE</small><strong>{selected.price} CRED</strong><span className="up">+4.8%</span></div></div><div className="trade-actions"><button onClick={() => action(`Bought 20 ${selected.good} at ${selected.name}.`)}>Buy cargo</button><button className="outline" onClick={() => action(`Sell order posted at ${selected.name}; waiting for demand.`)}>Sell cargo</button></div></section>
          <section className="card fleet-card"><div className="card-title"><span>YOUR FLEET</span><span className="count">2 SHIPS</span></div><div className="ship"><div className="ship-icon">S</div><div><strong>Sloop / ALPHA-07</strong><p>Empty · 100 cargo · defence 1</p></div><span className="ready">READY</span></div><div className="ship sailing"><div className="ship-icon">G</div><div><strong>Galleon / BRAVO-02</strong><p>Tron Bay <span>→</span> ? · arrives 00:42</p></div><span className="sailing-tag">SAILING</span></div><button className="wide" onClick={() => action("Destination sealed. Choose a route and depart ALPHA-07.")}>Depart a convoy <span>→</span></button></section>
          <section className="card raid-card"><div className="card-title"><span>AMBUSH WINDOW</span><span className="window">OPEN · 00:28</span></div><h3>Route 03 / Base Harbor</h3><p className="muted">Commit a sealed raid before the convoy departs. Stake required: 24 CRED.</p><button className="danger wide" onClick={() => action("Ambush committed. Reveal opens after departure and closes before arrival.")}>Commit ambush <span>→</span></button><small className="helper">Your route and window stay hidden until reveal.</small></section>
        </aside>
      </div>
      <footer><span>FRONTIER / ON-CHAIN TRADING EMPIRE</span><span>SIMULATED DEMO STATE · NO REAL VALUE</span><span>ECONOMY <b className="good-text">STABLE</b></span></footer>
    </main>
  );
}

function Economy() { return <div className="economy"><div className="economy-head"><span className="eyebrow">ECONOMY PROOF</span><h2>Player behaviour sets the tide.</h2><p>Faucets and sinks across the last 12 epochs. <strong>SIMULATED</strong></p></div><div className="chart"><div className="chart-line" /><div className="chart-labels"><span>10k CRED</span><span>9k</span><span>8k</span><span>7k</span></div></div><div className="economy-metrics"><div><small>SUPPLY</small><strong>8,734</strong><em>bounded</em></div><div><small>FAUCETS / EPOCH</small><strong>160</strong><em>NPC demand cap</em></div><div><small>SINKS / EPOCH</small><strong>288</strong><em>upkeep + loss</em></div></div></div>; }

