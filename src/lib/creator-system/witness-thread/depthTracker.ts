import type { WitnessThreadPoint } from "./threadLine";

export type WitnessDepth = {
  depthLevel: "new" | "returning" | "familiar" | "deep";
  pointCount: number;
};

export function calculateWitnessDepth(points: WitnessThreadPoint[]): WitnessDepth {
  const pointCount = points.length;

  if (pointCount >= 8) return { depthLevel: "deep", pointCount };
  if (pointCount >= 5) return { depthLevel: "familiar", pointCount };
  if (pointCount >= 2) return { depthLevel: "returning", pointCount };

  return { depthLevel: "new", pointCount };
}
