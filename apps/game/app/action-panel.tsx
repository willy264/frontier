"use client";
import { useState } from "react";
import type { Game, Mode } from "./page";
import { digest, seal, view } from "./use-game";
import { GOODS, ISLANDS, minimumOutput, portName, voyageProgress, wholeAmount, type Order, type Ship } from "./game-state";
import { marketQuote } from "./quotes";
import { builtShipId } from "./transaction-result";

type Props = { game: Game; mode: Mode; setMode: (mode: Mode) => void; portId: number; setPortId: (id: number) => void; shipId: number | null; setShipId: (id: number) => void; routeId: number };
export function ActionPanel({ game, mode, setMode, portId, setPortId, shipId, setShipId, routeId }: Props) {
  const [good, setGood] = useState(0);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("120");
  const [origin, setOrigin] = useState(1);
  const [sailRoute, setSailRoute] = useState(1);
  const [cargo, setCargo] = useState([0, 0, 0]);
  const [fee, setFee] = useState("3");
  const [offerId, setOfferId] = useState("");
  const [offer, setOffer] = useState<{ ship_id: number; owner_id: string; price: number; defence: number; active: boolean } | null>(null);
  const [offerState, setOfferState] = useState("");
  const busy = !!game.pending || game.readState !== "ready";
  const port = game.ports[portId];
  const selected = game.ships.find(([id]) => id === shipId) ?? game.ships.find(([, s]) => s.origin_port !== null) ?? game.ships[0];
  const ship = selected?.[1]; const id = selected?.[0];
  const goods = game.player?.goods ?? [0, 0, 0];
  const quote = port ? marketQuote(port, good, amount, side) : "0";
  const hasCargo = goods.some(n => Number(n) > 0);
  const activeMode = mode === "next" ? game.ships.some(([, s]) => s.origin_port !== null) || hasCargo ? "fleet" : "market" : mode;
  const route = game.routes.find(r => r.route_id === sailRoute && r.from_port === (ship?.current_port ?? origin)) ?? game.routes.find(r => r.from_port === (ship?.current_port ?? origin));
  const ambushRoute = game.routes.find(r => r.route_id === routeId);
  const nextLabel = !game.accountId ? "Meet your captain" : !game.player ? "Join the archipelago" : !hasCargo && !game.ships.some(([, s]) => s.origin_port !== null) ? "Buy your first cargo" : !game.ships.length ? "Build your first ship" : ship?.origin_port != null ? "Bring your convoy home" : "Load your next voyage";
  function action(text: string, fn: () => unknown, disabled = false, danger = false) {
    return <button className={`action ${danger ? "danger" : ""}`} disabled={busy || disabled} aria-busy={!!game.pending} onClick={() => void fn()}>{game.pending ? "Confirming order…" : text}</button>;
  }
  async function trade() {
    const result = await game.call(side, side === "buy" ? { port_id: portId, good: GOODS[good], cred_in: amount, min_out: minimumOutput(quote) } : { port_id: portId, good: GOODS[good], amount, min_cred: minimumOutput(quote) }, "Trade confirmed.");
    if (result && side === "buy" && !game.ships.length) setMode("fleet");
  }
  async function build(kind: "sloop" | "galleon") {
    const result = await game.call("build_ship", { kind }, `${kind === "sloop" ? "Sloop" : "Galleon"} built. Choose your cargo and destination.`);
    if (result) { const built = builtShipId(result.status); if (built) setShipId(Number(built)); setMode("fleet"); }
  }
  async function depart() {
    if (!id || !ship || !route) return;
    try {
      const salt = seal(); const order: Order = { kind: "departure", id: `voyage-${id}-${Date.now()}`, routeId: route.route_id, origin: route.from_port, shipId: id, destination: route.to_port, salt, createdAt: new Date().toISOString(), confirmed: false };
      game.remember(order);
      const result = await game.call("depart", { ship_id: id, origin_port: route.from_port, destination_commit: await digest(`${order.destination}:${salt}:${id}`), cargo: cargo.map(String) }, `Your convoy set sail from ${portName(route.from_port)}. Back up your hidden orders.`);
      if (result) game.remember({ ...order, confirmed: true });
    } catch { game.notify("Your hidden orders could not be saved. Allow browser storage before sailing.", "danger"); }
  }
  async function arrive(order: Order, state: Ship) {
    const result = await game.call("arrive", { ship_id: order.shipId, route_id: order.routeId, destination: order.destination, salt: order.salt }, `Your convoy reached ${portName(order.destination)}.`, { destination: order.destination, cargo: state.cargo, escorted: state.escort_ship_id !== null });
    if (result) { game.removeOrder(order.id); setPortId(order.destination); setMode("market"); setSide("sell"); setGood(Math.max(0, state.cargo.findIndex(n => n > 0))); setAmount("0"); }
  }
  async function setAmbush() {
    if (!ambushRoute || !game.accountId) return;
    try {
      const salt = seal(), window = game.height + 30;
      const order: Order = { kind: "ambush", id: `ambush-${Date.now()}`, routeId, window, destination: ambushRoute.to_port, salt, createdAt: new Date().toISOString(), confirmed: false };
      game.remember(order);
      const result = await game.call("commit_ambush", { window_start: window, commit: await digest(`${routeId}:${window}:${salt}:${game.accountId}`), stake: "10" }, `Ambush set on the ${portName(ambushRoute.to_port)} route. Spring it before the window closes.`);
      if (result) game.remember({ ...order, confirmed: true });
    } catch { game.notify("Your hidden orders could not be saved. Allow browser storage before setting an ambush.", "danger"); }
  }
  async function spring(order: Order) {
    const result = await game.call("reveal_ambush", { commit_id: await digest(`${order.routeId}:${order.window}:${order.salt}:${game.accountId}`), route_id: order.routeId, salt: order.salt }, `Ambush sprung on the ${portName(order.destination)} route. Waiting for a convoy.`);
    if (result) game.remember({ ...order, revealed: true, confirmed: true });
  }
  async function findEscort() {
    setOffer(null); setOfferState("Looking up the escort offer…");
    try { const found = await view<typeof offer>("get_escort", { offer_id: Number(offerId) }); setOffer(found); setOfferState(found?.active ? "" : "This offer is unavailable. Ask another captain for an active offer number."); }
    catch { setOfferState("Can’t reach testnet. Retry the escort lookup."); }
  }
  let content;
  if (!game.accountId) content = <><span className="eyebrow">Your first voyage</span><h2>Make your own fortune.</h2><p>Buy cargo, sail between player-owned ports and watch for raiders.</p><p className="muted">Explore the map now. To place orders, connect a funded NEAR testnet wallet. Test tokens have no monetary value.</p><button className="action" onClick={game.connect} disabled={!!game.pending}>{game.pending ? "Opening wallet…" : "Connect wallet"}</button><a className="text-link" href="https://testnet.mynearwallet.com/" target="_blank" rel="noreferrer">Create a testnet wallet</a><small>Your wallet approves game controls for this contract only, with a limited network-fee allowance.</small><div className="visitor-market"><h3>{portName(portId)}</h3>{port ? <p>Spend 120 CRED for approximately {marketQuote(port, 0, "120", "buy")} Hashpower, including fees.</p> : <p>{game.readState === "error" ? "Market unavailable. Retry the connection." : "Loading this port’s market…"}</p>}</div></>;
  else if (!game.keyReady) content = <><h2>Enable game controls</h2><p>Approve a game-only key in your wallet. It can call FRONTIER with a limited allowance for testnet network fees.</p><button className="action" onClick={game.connect} disabled={!!game.pending}>Enable controls</button></>;
  else if (game.readState === "loading" && !game.player) content = <><h2>Checking your captain</h2><p>Loading your balance and fleet from testnet…</p></>;
  else if (game.readState === "error") content = <><h2>Harbour connection lost</h2><p>Can’t reach testnet. Retrying…</p><button className="action" onClick={game.retry}>Retry connection</button></>;
  else if (!game.player) content = <><span className="eyebrow">Welcome aboard</span><h2>Claim your captain.</h2><p>Register to receive starter CRED for cargo and ships. All play happens on testnet.</p>{action("Register captain", () => game.call("register_player", {}, "Captain registered. Buy cargo at a port to begin."))}</>;
  else if (activeMode === "market") content = <><span className="eyebrow">Port market</span><h2>{portName(portId)}</h2>{!port ? <p>This port is unavailable. Select another island or retry.</p> : <>
    <p className="muted port-owner">Owned by {port.owner_id}</p><div className="segmented" aria-label="Trade direction"><button aria-pressed={side === "buy"} onClick={() => { setSide("buy"); setAmount("120"); }}>Buy cargo</button><button aria-pressed={side === "sell"} onClick={() => { setSide("sell"); setAmount(String(goods[good])); }}>Sell cargo</button></div>
    <label>Good<select value={good} onChange={e => { setGood(Number(e.target.value)); if (side === "sell") setAmount(String(goods[Number(e.target.value)])); }}>{GOODS.map((name, i) => <option key={name} value={i}>{name} · {goods[i]} held</option>)}</select></label>
    <label>{side === "buy" ? "Spend CRED" : `Sell ${GOODS[good]}`}<input type="number" min="1" step="1" max={side === "buy" ? game.player.cred : goods[good]} value={amount} onChange={e => setAmount(e.target.value)} aria-describedby="quote-hint" /></label>{side === "sell" && <button className="text-button" onClick={() => setAmount(String(goods[good]))}>Use available cargo ({goods[good]})</button>}
    <div className="quote"><span>You receive</span><strong>{quote} <small>{side === "buy" ? GOODS[good] : "CRED"}</small></strong></div><p id="quote-hint" className="muted">Includes port fees. Allow up to 2% price movement. Minimum received: {minimumOutput(quote)}. Trades cost at least 30 CRED in fees.</p>
    {action(side === "buy" ? "Buy cargo" : "Sell cargo", trade, !wholeAmount(amount) || BigInt(quote) === 0n || Number(amount) > (side === "buy" ? game.player.cred : goods[good]))}{hasCargo && <button className="secondary" onClick={() => setMode("fleet")}>{game.ships.length ? "Load a ship" : "Build a ship"}</button>}
    <details><summary>Port ownership</summary><p>Fee {port.fee_bps / 100}%. Treasury {port.treasury} CRED.</p>{port.owner_id === game.accountId ? <><label>Trading fee (%)<input type="number" min="0.3" max="10" step="0.1" value={fee} onChange={e => setFee(e.target.value)} /></label>{action("Set port fee", () => game.call("set_fee", { port_id: portId, fee_bps: Math.round(Number(fee) * 100) }, "Port fee updated."), !Number.isFinite(Number(fee)) || Number(fee) < .3 || Number(fee) > 10)}</> : port.sale_price > 0 ? action(`Buy port · ${port.sale_price}`, () => game.call("buy_port", { port_id: portId }, "Port purchased, including its treasury."), game.player.cred < port.sale_price) : <p>This port is not for sale.</p>}</details>
  </>}</>;
  else if (activeMode === "ambush") content = <><span className="eyebrow danger-text">Route ambush</span><h2>Wait in the narrows.</h2><p>{ambushRoute ? `${portName(ambushRoute.from_port)} to ${portName(ambushRoute.to_port)}` : "Select a route on the map."}</p><p>Your idle ships supply attack power. Set aside 10 CRED, then spring the ambush before its window closes. Unopened orders lose the stake.</p>
    {action("Set ambush", setAmbush, !ambushRoute || game.player.cred < 10 || !game.ships.some(([, s]) => s.origin_port === null && s.escorting_convoy_id === null), true)}
    {game.orders.filter(o => o.kind === "ambush").map(order => { const remaining = Math.max(0, (order.window ?? 0) + 20 - game.height); return <div className="order" key={order.id}><h3>{portName(order.destination)} route</h3><p>{order.revealed ? "Ambush sprung. Watching this route." : remaining > 0 ? `${remaining} blocks left to spring the ambush` : "Window closed. Unopened stakes are lost when the epoch advances."}</p><progress max="50" value={remaining} aria-label="Ambush window remaining" />{!order.revealed && action("Spring ambush", () => spring(order), remaining === 0, true)}{order.confirmed === false && <small>Confirmation uncertain. Check wallet activity before retrying.</small>}</div>; })}<button className="secondary" onClick={game.backup} disabled={!game.orders.length}>Back up hidden orders</button>
  </>;
  else content = <><span className="eyebrow">Your fleet</span><h2>{game.ships.length ? "Make sail, captain." : "Your cargo needs a ship."}</h2>
    {!game.ships.length ? <><p>A sloop costs 100 CRED and has 1 defence. A galleon costs 350 CRED and has 3 defence.</p>{action("Build sloop · 100", () => build("sloop"), game.player.cred < 100)}<button className="secondary" disabled={busy || game.player.cred < 350} onClick={() => build("galleon")}>Build galleon · 350</button></> : <>
      <label>Your ship<select value={id} onChange={e => { setShipId(Number(e.target.value)); setCargo([0, 0, 0]); }}>{game.ships.map(([sid, state]) => <option key={sid} value={sid}>Ship {sid} · {state.escorting_convoy_id !== null ? "Escorting" : state.origin_port !== null ? "At sea" : state.current_port ? portName(state.current_port) : "Ready to launch"}</option>)}</select></label>
      {ship && <><div className="ship-stats"><span>Defence <b>{ship.defence}</b></span><span>{ship.escort_ship_id ? `Escorted by ship ${ship.escort_ship_id}` : "No hired escort"}</span></div>
        {ship.escorting_convoy_id !== null ? <p>Escorting convoy {ship.escorting_convoy_id}. This ship is locked until that convoy arrives.</p> : ship.origin_port !== null ? (() => {
          const order = [...game.orders].reverse().find(o => o.kind === "departure" && o.shipId === id); const currentRoute = game.routes.find(r => r.route_id === order?.routeId); const progress = voyageProgress(ship, currentRoute, game.height);
          return <div className="voyage"><h3>{order ? `Bound for ${portName(order.destination)}` : "Your destination is hidden"}</h3><p>{progress.remaining === null ? "Restore your hidden orders below to recover the destination and arrival control." : progress.remaining > 0 ? `${progress.remaining} blocks to harbour` : "Your convoy is ready to arrive."}</p><progress value={progress.progress} max="1" aria-label="Voyage progress" /><p className="muted">Cargo: {ship.cargo.map((n, i) => `${n} ${GOODS[i]}`).join(", ")}</p>{order && action("Arrive at port", () => arrive(order, ship), progress.remaining === null || progress.remaining > 0)}<button className="secondary" onClick={game.backup}>Back up hidden orders</button></div>;
        })() : <>
          {ship.current_port === null ? <label>Launch from<select value={origin} onChange={e => setOrigin(Number(e.target.value))}>{ISLANDS.filter(i => game.routes.some(r => r.from_port === i.id)).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label> : <p>Docked at {portName(ship.current_port)}.</p>}
          {route ? <><label>Sail to<select value={route.route_id} onChange={e => setSailRoute(Number(e.target.value))}>{game.routes.filter(r => r.from_port === (ship.current_port ?? origin)).map(r => <option key={r.route_id} value={r.route_id}>{portName(r.to_port)} · {r.distance} blocks</option>)}</select></label><fieldset className="cargo"><legend>Load your cargo</legend>{GOODS.map((name, index) => <label key={name}><span>{name}<b>{Math.min(cargo[index], goods[index])} / {goods[index]}</b></span><input type="range" min="0" max={goods[index]} step="1" value={Math.min(cargo[index], goods[index])} onChange={e => setCargo(values => values.map((n, i) => i === index ? Number(e.target.value) : n))} /></label>)}</fieldset><button className="text-button" onClick={() => setCargo(goods.map(Number))}>Load all available cargo</button>{action("Seal and sail", depart, cargo.every(n => n === 0) || cargo.some((n, i) => n > goods[i]))}<p className="muted">Your destination stays hidden until arrival. Keep a backup of your hidden orders.</p></> : <><p>No onward routes leave this port in the current map. Sell cargo here or build another ship at an origin port.</p><button className="secondary" onClick={() => { setPortId(ship.current_port ?? origin); setMode("market"); }}>Open port market</button></>}
          <details><summary>Hire or offer an escort</summary><p>Hire another captain’s escort before sailing. Their ship stays locked until your convoy arrives.</p><label>Escort offer number<input value={offerId} type="number" min="1" onChange={e => { setOfferId(e.target.value); setOffer(null); }} /></label><button className="secondary" disabled={!wholeAmount(offerId) || busy} onClick={findEscort}>Check escort offer</button>{offerState && <p role="status">{offerState}</p>}{offer?.active && <><p>Ship {offer.ship_id}, defence {offer.defence}. Cost: {offer.price} CRED. Captain: {offer.owner_id}.</p>{action("Hire escort", () => game.call("hire_escort", { offer_id: Number(offerId), convoy_ship_id: id }, "Escort hired. Your convoy is protected until arrival."), offer.owner_id === game.accountId || !!ship.escort_ship_id || game.player.cred < offer.price)}</>}<button className="secondary" disabled={busy || !!ship.escort_ship_id} onClick={async () => { const result = await game.call("offer_escort", { ship_id: id, price: "20" }, "Escort offered for 20 CRED."); if (result) { const offerNumber = builtShipId(result.status); if (offerNumber) game.notify(`Share escort offer ${offerNumber} with another captain.`); } }}>Offer this ship · 20 CRED</button></details>
        </>}
      </>}<details><summary>Build another ship</summary>{action("Build sloop · 100", () => build("sloop"), game.player.cred < 100)}<button className="secondary" disabled={busy || game.player.cred < 350} onClick={() => build("galleon")}>Build galleon · 350</button></details>
    </>}
  </>;
  return <><div className="next-step">{nextLabel}</div>{game.accountId && game.player && <div className="panel-tabs" aria-label="Captain actions"><button aria-pressed={activeMode === "market"} onClick={() => setMode("market")}>Market</button><button aria-pressed={activeMode === "fleet"} onClick={() => setMode("fleet")}>Fleet</button><button aria-pressed={activeMode === "ambush"} onClick={() => setMode("ambush")}>Ambush</button></div>}<div className="panel-body">{content}</div></>;
}
