"use client";

export type Economy = {
  cred_supply: string;
  npc_faucet: string;
  sinks: string;
  spoilage: string;
  epoch: number;
};

export function Economy({ economy }: { economy: Economy | null }) {
  return <div className="economy">
    <div className="economy-head"><span className="eyebrow">ECONOMY PROOF</span><h2>Player behaviour sets the tide.</h2><p>Live faucets and sinks from the deployed world contract.</p></div>
    <div className="chart"><div className="chart-line" /><div className="chart-labels"><span>SUPPLY</span><span>SINKS</span><span>SPOILAGE</span></div></div>
    <div className="economy-metrics"><div><small>SUPPLY</small><strong>{economy?.cred_supply ?? "--"}</strong><em>contract state</em></div><div><small>FAUCETS / EPOCH</small><strong>{economy?.npc_faucet ?? "--"}</strong><em>NPC cap 160</em></div><div><small>SPOILAGE SINK</small><strong>{economy?.spoilage ?? "--"}</strong><em>goods lost</em></div></div>
  </div>;
}
