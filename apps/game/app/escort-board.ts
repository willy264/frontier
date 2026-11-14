export type EscortOffer = { ship_id: number; owner_id: string; price: number; defence: number; active: boolean };
type View = (method: string, args: Record<string, unknown>) => Promise<unknown>;

// Offer ids are dense (escorts.len() + 1) and never deleted, so probe for the newest id
// instead of scanning every offer. Reads run one at a time to stay under RPC rate limits.
export async function newestOfferId(view: View, cap = 4096) {
  const exists = async (id: number) => (await view("get_escort", { offer_id: id })) !== null;
  if (!(await exists(1))) return 0;
  let low = 1, high = 2;
  while (high <= cap && await exists(high)) { low = high; high *= 2; }
  if (high > cap) return low;
  while (high - low > 1) { const mid = Math.floor((low + high) / 2); if (await exists(mid)) low = mid; else high = mid; }
  return low;
}

export async function openEscortOffers(view: View, accountId: string | null, limit = 8, scan = 20) {
  const newest = await newestOfferId(view);
  const offers: Array<EscortOffer & { offer_id: number }> = [];
  for (let id = newest; id > 0 && id > newest - scan && offers.length < limit; id--) {
    const offer = await view("get_escort", { offer_id: id }) as EscortOffer | null;
    if (offer?.active && offer.owner_id !== accountId) offers.push({ ...offer, offer_id: id });
  }
  return offers;
}
