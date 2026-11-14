import { afterEach, expect, it, vi } from "vitest";
import { readRpc, view } from "./read-rpc";

afterEach(() => vi.unstubAllGlobals());
it("preserves UTF-8 arguments and nullable contract responses", async () => {
  const fetcher = vi.fn(async () => Response.json({ result: { result: [...new TextEncoder().encode("null")] } }));
  vi.stubGlobal("fetch", fetcher);
  expect(await view("get_player", { label: "船" })).toBeNull();
  const request = JSON.parse((fetcher.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
  expect(new TextDecoder().decode(Uint8Array.from(atob(request.params.args_base64), c => c.charCodeAt(0)))).toBe('{"label":"船"}');
});
it.each([Response.json({}, { status: 503 }), Response.json({ error: { code: -32000 } }), Response.json({})])("rejects failed RPC reads", async response => {
  vi.stubGlobal("fetch", vi.fn(async () => response));
  await expect(readRpc("block", {})).rejects.toThrow(/Testnet/);
});
it("rejects empty contract output instead of showing stale data", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({ result: { result: [] } })));
  await expect(view("get_port")).rejects.toThrow("Empty view response");
});
