export type Market = { reserves: number[]; cred_reserve: number; fee_bps: number };

export function marketQuote(port: Market, good: number, amount: string, side: "buy" | "sell"): string {
  if (!/^\d+$/.test(amount)) return "0";
  const input = BigInt(amount);
  const reserve = BigInt(port.reserves[good]);
  const cred = BigInt(port.cred_reserve);
  const feeFor = (gross: bigint) => {
    const proportional = gross * BigInt(port.fee_bps) / 10000n;
    const fee = proportional > 30n ? proportional : 30n;
    return fee > gross ? gross : fee;
  };
  if (side === "buy") {
    const net = input - feeFor(input);
    return cred + net > 0n ? (reserve * net / (cred + net)).toString() : "0";
  }
  const gross = reserve + input > 0n ? cred * input / (reserve + input) : 0n;
  return (gross - feeFor(gross)).toString();
}
