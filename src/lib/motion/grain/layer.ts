export type GrainLayer = {
  enabled: boolean;
  intensity: number;
  blendMode: "soft-light" | "overlay";
  animated: boolean;
};

export function buildGrainLayer(intensity = 0.08): GrainLayer {
  return {
    enabled: true,
    intensity: Number(Math.max(0, Math.min(0.25, intensity)).toFixed(3)),
    blendMode: "soft-light",
    animated: true
  };
}
