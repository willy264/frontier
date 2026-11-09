import { describe, expect, it } from "vitest";
import { runEconomy } from "./economy";

describe("economy simulation", () => {
  it("keeps supply bounded over 200 epochs", () => {
    const snapshots = runEconomy();
    const supplies = snapshots.map((snapshot) => snapshot.supply);
    expect(snapshots).toHaveLength(200);
    expect(Math.min(...supplies)).toBeGreaterThan(7_500);
    expect(Math.max(...supplies)).toBeLessThan(12_500);
  });

  it("never exceeds the NPC faucet cap", () => {
    for (const snapshot of runEconomy()) {
      expect(snapshot.faucet).toBeLessThanOrEqual(160);
    }
  });
});

