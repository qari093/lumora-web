export type SidePathInput = {
  currentLane: string;
  watchedLanes: string[];
  intensity: number;
};

export type CuriousSidePath = {
  label: string;
  from: string;
  to: string;
  reason: string;
  safeDivergence: boolean;
};

const laneMap: Record<string, string> = {
  "Cosmic Drift": "Calm Earth",
  "Calm Earth": "Analog Memory",
  "Analog Memory": "Silent Wonder",
  "Silent Wonder": "Midnight Cinema",
  "Midnight Cinema": "Cosmic Drift",
  "GMAR Pulse": "Human Energy",
  "Human Energy": "Live Echoes",
  "Live Echoes": "Creator Atmosphere",
  "Creator Atmosphere": "Cosmic Drift"
};

export function createCuriousSidePath(input: SidePathInput): CuriousSidePath {
  const from = input.currentLane || "Cosmic Drift";
  const to = laneMap[from] || "Silent Wonder";
  const safeDivergence = input.intensity <= 8;

  return {
    label: "A path less traveled",
    from,
    to,
    reason: input.watchedLanes.includes(to)
      ? "gentle_return_to_resonance"
      : "healthy_discovery_drift",
    safeDivergence
  };
}
