import { describe, expect, it } from "vitest";
import { SESSION_METHODS, WALLET_METHODS, ambushWindow, arrivalMessage, dockedAt, isFinalHarbour, minimumOutput, voyageProgress, wholeAmount, type Ship } from "./game-state";
describe("game presentation from contract state", () => {
  const ship = { origin_port: null, current_port: null, departed_at: 0 } as Ship;
  it("does not put a newly built ship at sea", () => expect(voyageProgress(ship, undefined, 100).sailing).toBe(false));
  it("counts voyage blocks and caps progress", () => {
    const sailing = { ...ship, origin_port: 1, departed_at: 100 };
    const route = { route_id: 1, from_port: 1, to_port: 2, distance: 12 };
    expect(voyageProgress(sailing, route, 106)).toEqual({ sailing: true, remaining: 6, progress: .5 });
    expect(voyageProgress(sailing, route, 200).progress).toBe(1);
    expect(voyageProgress(sailing, undefined, 200).remaining).toBeNull();
  });
  it("never accepts a zero output trade with slippage rounding", () => {
    expect(minimumOutput("1")).toBe("1"); expect(minimumOutput("100")).toBe("98");
    expect(wholeAmount("-1")).toBe(false); expect(wholeAmount("1.5")).toBe(false);
  });
  it("reports real loss without inventing an escort victory", () => {
    expect(arrivalMessage("4:raided=true:loss=20", 2, [0, 40, 0], false)).toContain("lost 20 Liquidity");
    expect(arrivalMessage("4:raided=false:loss=0", 2, [40, 0, 0], true)).toContain("cargo intact");
    expect(arrivalMessage("4:raided=false:loss=0", 2, [40, 0, 0], true)).not.toContain("drove off");
  });
  it("sells only where a ship is docked, not while it is at sea", () => {
    const docked: [number, Ship] = [1, { ...ship, current_port: 2 }];
    const atSea: [number, Ship] = [2, { ...ship, origin_port: 2, current_port: null }];
    expect(dockedAt([docked], 2)).toBe(true);
    expect(dockedAt([docked], 3)).toBe(false);
    expect(dockedAt([atSea], 2)).toBe(false);
    expect(dockedAt([], 1)).toBe(false);
  });
  it("marks ports without an onward route as final harbours", () => {
    const routes = [{ route_id: 1, from_port: 1, to_port: 2, distance: 12 }, { route_id: 4, from_port: 4, to_port: 5, distance: 20 }];
    expect(isFinalHarbour(routes, 5)).toBe(true);
    expect(isFinalHarbour(routes, 1)).toBe(false);
    expect(isFinalHarbour([], 5)).toBe(false);
  });
  it("reports the chosen ambush window from contract rules", () => {
    const order = { window: 1060, committedAt: 1000 };
    expect(ambushWindow(order, 1000)).toEqual({ start: 1060, end: 1080, opensIn: 60, remaining: 80, span: 80 });
    expect(ambushWindow(order, 1075).remaining).toBe(5);
    expect(ambushWindow(order, 1090)).toMatchObject({ opensIn: 0, remaining: 0 });
    expect(ambushWindow({ window: 130 }, 100).span).toBe(50);
  });
  it("keeps asset-moving methods off the game key", () => {
    for (const method of WALLET_METHODS) expect(SESSION_METHODS).not.toContain(method);
    expect(WALLET_METHODS).toEqual(expect.arrayContaining(["hire_escort", "buy_port", "set_port_sale_price"]));
    expect(SESSION_METHODS).toEqual(expect.arrayContaining(["buy", "sell", "depart", "arrive", "commit_ambush", "reveal_ambush"]));
  });
});
