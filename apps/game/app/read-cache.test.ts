import { expect, it, vi } from "vitest";
import { createReadCache, pollDelay } from "./read-cache";

it("reuses world reads during polling but refreshes them after expiry or an action", async () => {
  const cache = createReadCache();
  const load = vi.fn(async () => 42);
  await cache.get("ports", 30000, load, 1000);
  await cache.get("ports", 30000, load, 7000);
  expect(load).toHaveBeenCalledTimes(1);
  await cache.get("ports", 30000, load, 31001);
  expect(load).toHaveBeenCalledTimes(2);
  cache.invalidate("ports");
  await cache.get("ports", 30000, load, 31002);
  expect(load).toHaveBeenCalledTimes(3);
});
it("does not cache a failed read and coalesces concurrent refreshes", async () => {
  const cache = createReadCache();
  const load = vi.fn().mockRejectedValueOnce(new Error("429")).mockResolvedValue(7);
  await expect(cache.get("routes", Infinity, load)).rejects.toThrow("429");
  expect(await Promise.all([cache.get("routes", Infinity, load), cache.get("routes", Infinity, load)])).toEqual([7, 7]);
  expect(load).toHaveBeenCalledTimes(2);
});
it("backs off sustained failures and returns to six-second polling after recovery", () => {
  expect([0,1,2,3,4,5].map(pollDelay)).toEqual([6000,12000,24000,30000,30000,30000]);
});
