export type LumexaAtmosphereMode = "neutral" | "calm" | "energized" | "inward" | "social";

export interface LumexaAtmosphereState {
  mode: LumexaAtmosphereMode;
  energy: number;
  inward: number;
  confidence: number;
  hue: number;
  saturation: number;
  depth: number;
}

function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

export function resolveAtmosphereMode(energy: number, inward: number): LumexaAtmosphereMode {
  const e = clamp01(energy);
  const i = clamp01(inward);

  if (e <= 0.35 && i >= 0.65) return "calm";
  if (e >= 0.72 && i <= 0.45) return "social";
  if (e >= 0.65) return "energized";
  if (i >= 0.7) return "inward";
  return "neutral";
}

export function createNeutralAtmosphere(): LumexaAtmosphereState {
  return {
    mode: "neutral",
    energy: 0.5,
    inward: 0.5,
    confidence: 0.5,
    hue: 220,
    saturation: 0.45,
    depth: 0.5
  };
}

export function createAtmosphereState(
  energy: number = 0.5,
  inward: number = 0.5,
  confidence: number = 0.5
): LumexaAtmosphereState {
  const e = clamp01(energy);
  const i = clamp01(inward);
  const c = clamp01(confidence);
  const mode = resolveAtmosphereMode(e, i);

  return {
    mode,
    energy: e,
    inward: i,
    confidence: c,
    hue: mode === "calm" ? 210 : mode === "energized" ? 42 : mode === "social" ? 190 : mode === "inward" ? 270 : 220,
    saturation: mode === "calm" ? 0.32 : mode === "energized" ? 0.72 : mode === "social" ? 0.68 : mode === "inward" ? 0.52 : 0.45,
    depth: Number(((e + i + c) / 3).toFixed(3))
  };
}

export function evolveAtmosphere(
  currentOrEnergy: LumexaAtmosphereState | number = createNeutralAtmosphere(),
  energy?: number,
  inward?: number
): LumexaAtmosphereState {
  if (typeof currentOrEnergy === "number") {
    return createAtmosphereState(currentOrEnergy, energy ?? 0.5, 0.72);
  }

  return createAtmosphereState(
    energy ?? currentOrEnergy.energy,
    inward ?? currentOrEnergy.inward,
    Math.max(currentOrEnergy.confidence, 0.72)
  );
}
