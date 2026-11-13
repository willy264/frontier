import { describe, expect, it } from "vitest";
import { arrivalMessage, minimumOutput, voyageProgress, wholeAmount, type Ship } from "./game-state";
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
});
