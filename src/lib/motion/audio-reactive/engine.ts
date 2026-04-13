export type AudioReactiveState = {
  energy: number;
  pulse: number;
  intensity: "low" | "medium" | "high";
};

export function mapAudioEnergyToMotion(energy: number): AudioReactiveState {
  const normalized = Math.max(0, Math.min(1, energy));
  const pulse = Number((0.8 + normalized * 1.4).toFixed(3));
  const intensity =
    normalized >= 0.7 ? "high" :
    normalized >= 0.35 ? "medium" :
    "low";

  return {
    energy: normalized,
    pulse,
    intensity
  };
}
