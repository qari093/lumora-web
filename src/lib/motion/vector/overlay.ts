export type VectorOverlayLayer = {
  id: string;
  kind: "line" | "ring" | "burst";
  opacity: number;
  scale: number;
};

export function buildVectorOverlay(): VectorOverlayLayer[] {
  return [
    { id: "ring_core", kind: "ring", opacity: 0.85, scale: 1.0 },
    { id: "line_energy", kind: "line", opacity: 0.55, scale: 1.1 },
    { id: "burst_accent", kind: "burst", opacity: 0.35, scale: 0.95 }
  ];
}
