import { describe, expect, it } from "vitest";
import { newestOfferId, openEscortOffers } from "./escort-board";

function chain(count: number, inactive: number[] = [], owners: Record<number, string> = {}) {
  const calls: number[] = [];
  const view = async (_method: string, args: Record<string, unknown>) => {
    const id = Number(args.offer_id); calls.push(id);
    return id >= 1 && id <= count ? { ship_id: id + 100, owner_id: owners[id] ?? `captain${id}.testnet`, price: 20, defence: 3, active: !inactive.includes(id) } : null;
  };
  return { view, calls };
}

describe("escort board", () => {
  it("finds the newest dense offer id with few reads", async () => {
    for (const count of [0, 1, 2, 3, 17, 64, 1000]) {
      const { view, calls } = chain(count);
      expect(await newestOfferId(view)).toBe(count);
      expect(calls.length).toBeLessThanOrEqual(2 * Math.ceil(Math.log2(count + 2)) + 2);
    }
  });
  it("lists newest open offers from other captains first", async () => {
    const { view } = chain(12, [12, 9], { 11: "me.testnet" });
    const offers = await openEscortOffers(view, "me.testnet", 3);
    expect(offers.map(o => o.offer_id)).toEqual([10, 8, 7]);
  });
  it("stops after its scan window when most offers are closed", async () => {
    const { view, calls } = chain(500, Array.from({ length: 500 }, (_, i) => i + 1));
    expect(await openEscortOffers(view, null, 8, 20)).toEqual([]);
    expect(calls.filter(id => id <= 500).length).toBeLessThan(45);
  });
});
