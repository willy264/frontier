export type EpochSnapshot = {
  epoch: number;
  supply: number;
  faucet: number;
  sinks: number;
};

const PLAYERS = 100;
const EPOCHS = 200;
const STARTER_GRANT = 100;
const NPC_CAP_PER_PLAYER = 1.6;
const UPKEEP_PER_PLAYER = 1.1;
const MAINTENANCE_PER_PLAYER = 0.52;
const SPOILAGE_RATE = 0.012;
const RAID_LOSS_RATE = 0.018;

export function runEconomy(seed = 7): EpochSnapshot[] {
  let random = seed;
  let supply = PLAYERS * STARTER_GRANT;
  let activeInventory = PLAYERS * 28;
  const snapshots: EpochSnapshot[] = [];

  for (let epoch = 1; epoch <= EPOCHS; epoch += 1) {
    random = (random * 1664525 + 1013904223) >>> 0;
    const activity = 0.8 + (random / 0xffffffff) * 0.35;
    const faucet = Math.min(PLAYERS * NPC_CAP_PER_PLAYER, activeInventory * 0.045 * activity);
    const upkeep = PLAYERS * UPKEEP_PER_PLAYER * activity;
    const maintenance = PLAYERS * MAINTENANCE_PER_PLAYER * (0.9 + activity / 10);
    const spoilage = activeInventory * SPOILAGE_RATE;
    const raidLoss = activeInventory * RAID_LOSS_RATE * (0.7 + activity / 3);
    const sinks = upkeep + maintenance + spoilage + raidLoss;

    supply = supply + faucet - upkeep - maintenance;
    activeInventory = Math.max(PLAYERS * 10, activeInventory + faucet * 0.8 - spoilage - raidLoss);
    snapshots.push({ epoch, supply, faucet, sinks });
  }

  return snapshots;
}

if (process.argv[1]?.endsWith("economy.ts")) {
  const snapshots = runEconomy();
  const first = snapshots[0];
  const last = snapshots.at(-1);
  const min = Math.min(...snapshots.map((snapshot) => snapshot.supply));
  const max = Math.max(...snapshots.map((snapshot) => snapshot.supply));
  console.log(JSON.stringify({
    label: "SIMULATED",
    players: PLAYERS,
    epochs: EPOCHS,
    first,
    last,
    minSupply: Number(min.toFixed(2)),
    maxSupply: Number(max.toFixed(2)),
    bounded: max - min < PLAYERS * STARTER_GRANT * 0.5,
  }, null, 2));
}

