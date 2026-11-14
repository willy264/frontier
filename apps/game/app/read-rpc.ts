import { RPC, WORLD } from "./game-state";

// Public reads need no wallet, signer or cryptography bundle.
export async function readRpc<T>(method: string, params: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(RPC, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: "frontier-read", method, params }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Testnet HTTP ${response.status}`);
    const value = await response.json();
    if (value.error || value.result === undefined) throw new Error("Testnet read failed");
    return value.result as T;
  } finally { clearTimeout(timeout); }
}

export async function view<T>(method: string, args: Record<string, unknown> = {}): Promise<T> {
  const bytes = new TextEncoder().encode(JSON.stringify(args));
  const argsBase64 = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(""));
  const value = await readRpc<{ result: number[] }>("query", {
    request_type: "call_function", account_id: WORLD, method_name: method,
    args_base64: argsBase64, finality: "final",
  });
  if (!Array.isArray(value.result) || !value.result.length) throw new Error("Empty view response");
  return JSON.parse(new TextDecoder().decode(new Uint8Array(value.result))) as T;
}
