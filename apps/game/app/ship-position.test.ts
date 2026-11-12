import { describe, expect, it } from "vitest";
import { shipPosition } from "./ship-position";

describe("contract ship marker position", () => {
  it("reports a ship in port from current contract state", () => {
    expect(shipPosition({ current_port: 2, origin_port: null, departed_at: 0, arrives_at: 0 }, 100, null)).toEqual({ status: "in_port", portId: 2, progress: 1 });
  });

  it("reports live transit progress from blocks elapsed and route distance", () => {
    expect(shipPosition({ current_port: null, origin_port: 1, departed_at: 100, arrives_at: 112 }, 106, { from_port: 1, to_port: 2, distance: 12 })).toEqual({ status: "in_transit", portId: 1, destinationId: 2, progress: 0.5 });
  });
});
