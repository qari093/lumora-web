export interface LumexaPortalNode {
  id: string;
  priority: number;
  glow: number;
}

export function rankPortalConstellations(
  nodes: LumexaPortalNode[]
): LumexaPortalNode[] {
  return [...nodes].sort((a, b) => b.priority - a.priority);
}

export function generateScentTrailStrength(priority: number): number {
  return Math.min(1, Math.max(0.1, priority));
}
