"use client";

import { useId, useRef, type CSSProperties, type KeyboardEvent } from "react";

export type SeaMapIsland = {
  id: number;
  name: string;
  short: string;
  x: number;
  y: number;
  good: string;
};

export type SeaMapRoute = {
  id: number;
  from: number;
  to: number;
  blocks: number;
};

export type SeaMapShip = {
  id: number;
  x: number;
  y: number;
  label: string;
  status: string;
  progress: number;
};

export type SeaMapProps = {
  islands: SeaMapIsland[];
  routes: SeaMapRoute[];
  ships: SeaMapShip[];
  selectedIsland: number;
  selectedRoute: number | null;
  selectedShip: number | null;
  onIsland: (id: number) => void;
  onRoute: (id: number) => void;
  onShip: (id: number) => void;
};

type PositionedStyle = CSSProperties & {
  "--sea-x": string;
  "--sea-y": string;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : minimum, minimum), maximum);

const positionStyle = (x: number, y: number): PositionedStyle => ({
  "--sea-x": `${clamp(x, 0, 100)}%`,
  "--sea-y": `${clamp(y, 0, 100)}%`,
});

function goodClass(good: string) {
  const normalized = good.toLowerCase();
  if (normalized.includes("hash")) return "sea-island--hashpower";
  if (normalized.includes("liquid")) return "sea-island--liquidity";
  if (normalized.includes("block")) return "sea-island--blockspace";
  return "sea-island--neutral";
}

function shipEdgeClass(ship: SeaMapShip) {
  const horizontal = ship.x < 18 ? "sea-ship--left" : ship.x > 82 ? "sea-ship--right" : "";
  const vertical = ship.y < 18 ? "sea-ship--top" : ship.y > 82 ? "sea-ship--bottom" : "";
  return `${horizontal} ${vertical}`.trim();
}

function readableStatus(status: string) {
  return status.replaceAll("_", " ").replaceAll("-", " ");
}

function routeLabelPosition(from: SeaMapIsland, to: SeaMapIsland) {
  const x1 = from.x * 10;
  const y1 = from.y * 6;
  const x2 = to.x * 10;
  const y2 = to.y * 6;
  const distance = Math.hypot(x2 - x1, y2 - y1) || 1;
  const normalX = -((y2 - y1) / distance) * 18;
  const normalY = ((x2 - x1) / distance) * 18;

  return {
    x1,
    y1,
    x2,
    y2,
    labelX: clamp((x1 + x2) / 2 + normalX, 54, 946),
    labelY: clamp((y1 + y2) / 2 + normalY, 28, 572),
  };
}

function ControlIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

export function SeaMap({
  islands,
  routes,
  ships,
  selectedIsland,
  selectedRoute,
  selectedShip,
  onIsland,
  onRoute,
  onShip,
}: SeaMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const patternId = `sea-chart-${useId().replaceAll(":", "")}`;
  const islandById = new Map(islands.map((island) => [island.id, island]));

  function pan(direction: -1 | 1) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({ left: direction * Math.max(240, viewport.clientWidth * 0.72) });
  }

  function handleRouteKey(event: KeyboardEvent<SVGGElement>, routeId: number) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onRoute(routeId);
  }

  return (
    <section className="sea-map" aria-label="Archipelago navigation map">
      <div className="sea-map__mobile-tools" aria-label="Map controls">
        <button type="button" onClick={() => pan(-1)} aria-label="Pan map left" title="Pan map left">
          <ControlIcon direction="left" />
        </button>
        <button type="button" onClick={() => pan(1)} aria-label="Pan map right" title="Pan map right">
          <ControlIcon direction="right" />
        </button>
      </div>

      <div
        ref={viewportRef}
        className="sea-map__viewport"
        role="region"
        aria-label="Scrollable sea chart"
        tabIndex={0}
      >
        <div className="sea-map__canvas">
          <svg
            className="sea-map__chart"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-label="Trade routes between island ports"
          >
            <defs>
              <pattern id={patternId} width="100" height="100" patternUnits="userSpaceOnUse">
                <path className="sea-chart-grid" d="M100 0H0V100" />
                <path className="sea-chart-grid sea-chart-grid--minor" d="M50 0V100M0 50H100" />
              </pattern>
            </defs>

            <rect className="sea-chart-field" width="1000" height="600" />
            <rect className="sea-chart-grid-fill" width="1000" height="600" fill={`url(#${patternId})`} />

            <g className="sea-chart-contours" aria-hidden="true">
              <path d="M30 158C130 92 244 104 326 164S500 264 612 214 818 110 970 186" />
              <path d="M18 438C148 370 250 392 350 454S566 518 674 462 852 344 982 398" />
              <path d="M102 34C196 86 190 192 126 252S62 390 120 566" />
              <path d="M878 28C800 104 816 204 894 256S974 412 900 574" />
            </g>

            <g className="sea-chart-north" aria-hidden="true">
              <path d="M948 74V30M948 30l-8 16M948 30l8 16" />
              <text x="948" y="96" textAnchor="middle">N</text>
            </g>

            {routes.map((route) => {
              const from = islandById.get(route.from);
              const to = islandById.get(route.to);
              if (!from || !to) return null;
              const points = routeLabelPosition(from, to);
              const selected = selectedRoute === route.id;

              return (
                <g
                  key={route.id}
                  className={`sea-route-group${selected ? " sea-route-group--selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={`${from.name} to ${to.name}, ${route.blocks} travel blocks`}
                  onClick={() => onRoute(route.id)}
                  onKeyDown={(event) => handleRouteKey(event, route.id)}
                >
                  <line
                    className="sea-route-hit"
                    x1={points.x1}
                    y1={points.y1}
                    x2={points.x2}
                    y2={points.y2}
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    className="sea-route-line"
                    x1={points.x1}
                    y1={points.y1}
                    x2={points.x2}
                    y2={points.y2}
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle className="sea-route-endpoint" cx={points.x1} cy={points.y1} r="5" />
                  <circle className="sea-route-endpoint" cx={points.x2} cy={points.y2} r="5" />
                  <g className="sea-route-label" transform={`translate(${points.labelX} ${points.labelY})`}>
                    <rect x="-43" y="-14" width="86" height="28" />
                    <text textAnchor="middle" dominantBaseline="central">{route.blocks} blocks</text>
                  </g>
                </g>
              );
            })}

            <g className="sea-chart-harbors" aria-hidden="true">
              {islands.map((island) => (
                <g key={island.id} transform={`translate(${island.x * 10} ${island.y * 6})`}>
                  <circle r="52" />
                  <circle r="34" />
                  <path d="M-66 0h18M48 0h18M0-66v18M0 48v18" />
                </g>
              ))}
            </g>
          </svg>

          <div className="sea-map__islands">
            {islands.map((island) => {
              const selected = selectedIsland === island.id;
              return (
                <button
                  key={island.id}
                  type="button"
                  className={`sea-island ${goodClass(island.good)}${selected ? " sea-island--selected" : ""}`}
                  style={positionStyle(island.x, island.y)}
                  aria-pressed={selected}
                  aria-label={`Select ${island.name}, trading ${island.good}`}
                  onClick={() => onIsland(island.id)}
                >
                  <span className="sea-island__code" aria-hidden="true">{island.short}</span>
                  <span className="sea-island__copy">
                    <strong>{island.name}</strong>
                    <span className="sea-island__good">{island.good}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="sea-map__ships">
            {ships.map((ship) => {
              const progress = Math.round(clamp(ship.progress, 0, 1) * 100);
              const selected = selectedShip === ship.id;
              return (
                <button
                  key={ship.id}
                  type="button"
                  className={`sea-ship ${shipEdgeClass(ship)}${selected ? " sea-ship--selected" : ""}`}
                  style={positionStyle(ship.x, ship.y)}
                  aria-pressed={selected}
                  aria-label={`${ship.label}, ${readableStatus(ship.status)}, ${progress}% progress`}
                  onClick={() => onShip(ship.id)}
                >
                  <svg className="sea-ship__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 3v11M12 5h5l-1 6h-4M12 7H8l1 4h3M5 14h14l-2 5H8l-3-5Z" />
                  </svg>
                  <span className="sea-ship__callout">
                    <strong>{ship.label}</strong>
                    <span>{readableStatus(ship.status)} / {progress}%</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeaMap;
