export const WORLD = process.env.NEXT_PUBLIC_FRONTIER_WORLD_ACCOUNT ?? "world3.world3.testnet";
export const RPC = process.env.NEXT_PUBLIC_FRONTIER_RPC_URL ?? "https://rpc.testnet.fastnear.com";
export const GOODS = ["Hashpower", "Liquidity", "Blockspace"] as const;
export const ISLANDS = [
  { id: 1, name: "Bitcoin Isle", short: "BTC", x: 15, y: 32, good: "Hashpower" },
  { id: 2, name: "Solana Reef", short: "SOL", x: 46, y: 20, good: "Liquidity" },
  { id: 3, name: "Base Harbor", short: "BASE", x: 80, y: 36, good: "Blockspace" },
  { id: 4, name: "Tron Bay", short: "TRX", x: 28, y: 72, good: "Blockspace" },
  { id: 5, name: "NEAR Capital", short: "NEAR", x: 68, y: 75, good: "Hashpower" },
];
export type Port = { owner_id: string; fee_bps: number; treasury: number; sale_price: number; reserves: number[]; cred_reserve: number };
export type Route = { route_id: number; from_port: number; to_port: number; distance: number };
export type Ship = { token_id: string; owner_id: string; cargo: number[]; defence: number; origin_port: number | null; current_port: number | null; departed_at: number; arrives_at: number; escort_ship_id: number | null; escorting_convoy_id: number | null };
export type Player = { cred: number; goods: number[]; active_commits: number; last_epoch_seen: number };
export type EconomySnapshot = { cred_supply: string; npc_faucet: string; sinks: string; spoilage: string; epoch: number };
export type Order = { kind: "ambush" | "departure"; id: string; routeId: number; origin?: number; window?: number; committedAt?: number; shipId?: number; destination: number; salt: string; createdAt: string; revealed?: boolean; confirmed?: boolean };
export type GameEvent = { id: string; text: string; tone: "normal" | "danger" | "escort"; tx?: string; time: string };
// The game-only key may sign these without a wallet prompt.
export const SESSION_METHODS = ["register_player", "buy", "sell", "build_ship", "depart", "arrive", "commit_ambush", "reveal_ambush", "offer_escort", "set_fee"];
// These move CRED or ports to another account, or advance the world for everyone, so the wallet signs each one.
export const WALLET_METHODS = ["hire_escort", "buy_port", "set_port_sale_price", "tick_epoch"];
export const AMBUSH_SPAN = 20;
// Wallet prompts take seconds, so the shortest lead leaves room to approve. Testnet blocks are about 0.65 s.
export const AMBUSH_LEAD_OPTIONS = [30, 60, 120];
export const BLOCK_SECONDS = 0.65;
export const aboutSeconds = (blocks: number) => `about ${Math.max(1, Math.round(blocks * BLOCK_SECONDS))} s`;
// The chain executed an order and rejected it (contract panic, or a wallet reporting a failed outcome).
// Network errors are not rejections: the order may still have landed, so its hidden salt must be kept.
export const isRejected = (detail: string) => /ERR_[A-Z_]+|Smart contract panicked|publishing_transaction_failed|ActionError|FunctionCallError/.test(detail);
// The contract accepts a reveal up to window_start + 20, so an order is closed only after that block.
export const closedAmbushOrders = (orders: Order[], height: number) => height > 0 ? orders.filter(o => o.kind === "ambush" && (o.window ?? 0) + AMBUSH_SPAN < height) : [];
// Escort hires happen on another captain's transaction. Compare each ship's escort link with the last
// state this browser saw; a ship seen for the first time produces no message.
export function escortTransitions(before: Record<string, number | null>, ships: Array<[number, Ship]>) {
  const now: Record<string, number | null> = {}, hired: Array<[number, number]> = [], released: number[] = [];
  for (const [shipId, ship] of ships) {
    now[shipId] = ship.escorting_convoy_id;
    const was = before[shipId];
    if (was === null && ship.escorting_convoy_id !== null) hired.push([shipId, ship.escorting_convoy_id]);
    if (typeof was === "number" && ship.escorting_convoy_id === null) released.push(shipId);
  }
  return { now, hired, released };
}
export const portName = (id: number) => ISLANDS.find(p => p.id === id)?.name ?? "an unknown port";
// Client rule: the contract does not check where goods are, so this client only sells where a ship is docked.
export const dockedAt = (ships: Array<[number, Ship]>, portId: number) => ships.some(([, s]) => s.current_port === portId && s.origin_port === null);
export const isFinalHarbour = (routes: Route[], portId: number) => routes.length > 0 && !routes.some(r => r.from_port === portId);
export function ambushWindow(order: Pick<Order, "window" | "committedAt">, height: number) {
  const start = order.window ?? 0, end = start + AMBUSH_SPAN;
  return { start, end, opensIn: Math.max(0, start - height), remaining: Math.max(0, end - height), span: end - (order.committedAt ?? start - 30) };
}
export const wholeAmount = (value: string) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
export function minimumOutput(quote: string) { const n = BigInt(quote); return (n > 0n ? (n * 98n + 99n) / 100n : 0n).toString(); }
export function voyageProgress(ship: Ship, route: Route | undefined, height: number) {
  if (ship.origin_port === null) return { sailing: false, remaining: 0, progress: 0 };
  if (!route) return { sailing: true, remaining: null, progress: 0 };
  const elapsed = Math.max(0, height - ship.departed_at);
  return { sailing: true, remaining: Math.max(0, route.distance - elapsed), progress: Math.min(1, elapsed / route.distance) };
}
export function arrivalMessage(value: string, destination: number, cargo: number[], escorted: boolean) {
  const match = /^(\d+):raided=(true|false):loss=(\d+)$/.exec(value);
  if (!match) return `Your convoy reached ${portName(destination)}.`;
  const loss = Number(match[3]);
  if (match[2] === "true") {
    const nonzero = cargo.map((n, i) => n > 0 ? GOODS[i] : null).filter(Boolean);
    return `Ambush on the ${portName(destination)} route: you lost ${loss} ${nonzero.length === 1 ? nonzero[0] : "goods"}.`;
  }
  // The deployed event does not distinguish no raid from a blocked raid.
  // Never invent a successful defence just because an escort was hired.
  return escorted ? `Your escorted convoy reached ${portName(destination)} with its cargo intact.` : `Your convoy reached ${portName(destination)}.`;
}
