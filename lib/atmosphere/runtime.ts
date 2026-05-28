export type EmotionalLane =
  | "cosmic-drift"
  | "human-energy"
  | "midnight-cinema"
  | "analog-memory"
  | "gmar-pulse"
  | "calm-earth"
  | "emotional-velocity"
  | "silent-wonder"
  | "live-echoes"
  | "creator-atmosphere";

export type AtmosphereMoment = {
  id: string;
  lane: EmotionalLane;
  emotion: string;
  intensity: number;
  durationSeconds: number;
};

export const atmosphereLanes: EmotionalLane[] = [
  "cosmic-drift",
  "human-energy",
  "midnight-cinema",
  "analog-memory",
  "gmar-pulse",
  "calm-earth",
  "emotional-velocity",
  "silent-wonder",
  "live-echoes",
  "creator-atmosphere"
];

export function classifyAtmosphere(input: Partial<AtmosphereMoment>): AtmosphereMoment {
  return {
    id: input.id ?? "seed-moment",
    lane: input.lane ?? "cosmic-drift",
    emotion: input.emotion ?? "wonder",
    intensity: Math.min(1, Math.max(0, input.intensity ?? 0.6)),
    durationSeconds: Math.max(15, input.durationSeconds ?? 90)
  };
}

export function buildAtmosphereSession(seed: AtmosphereMoment[]): AtmosphereMoment[] {
  const safeSeed = seed.length ? seed : [classifyAtmosphere({})];
  return safeSeed.map(classifyAtmosphere);
}

export function validateAtmosphereRuntime(): boolean {
  return atmosphereLanes.length === 10 && buildAtmosphereSession([]).length > 0;
}

export type AtmosphereState = {
  lane: string;
  intensity: number;
  active: boolean;
};

export function createAtmosphereState(lane = "COSMIC_DRIFT"): AtmosphereState {
  return {
    lane,
    intensity: 0.72,
    active: true
  };
}
