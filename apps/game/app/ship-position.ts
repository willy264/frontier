export type ShipPosition = {
  status: "in_port" | "in_transit";
  portId: number;
  destinationId?: number;
  progress: number;
};

type ShipState = {
  current_port: number | null;
  origin_port: number | null;
  departed_at: number;
  arrives_at: number;
};

type RouteState = { from_port: number; to_port: number; distance: number };

export function shipPosition(ship: ShipState, blockHeight: number, route: RouteState | null): ShipPosition {
  if (ship.current_port !== null) return { status: "in_port", portId: ship.current_port, progress: 1 };
  const distance = route?.distance ?? Math.max(1, ship.arrives_at - ship.departed_at);
  const elapsed = Math.max(0, blockHeight - ship.departed_at);
  return {
    status: "in_transit",
    portId: route?.from_port ?? ship.origin_port ?? 0,
    destinationId: route?.to_port,
    progress: Math.min(1, elapsed / distance),
  };
}
