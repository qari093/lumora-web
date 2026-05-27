export interface FusionNebula {
  id: string;
  portals: string[];
  atmosphere: string;
  stability: number;
}

export function createFusionNebula(
  portals: string[]
): FusionNebula {
  const joined = portals.join("_");

  return {
    id: `fusion_${joined}`,
    portals,
    atmosphere: resolveAtmosphere(portals),
    stability: 0.92
  };
}

function resolveAtmosphere(portals: string[]): string {
  const key = portals.join(",");

  if (key.includes("gmar") && key.includes("echo")) {
    return "focus_sanctuary";
  }

  if (key.includes("cineverse") && key.includes("lumaspace")) {
    return "dream_drift";
  }

  return "neutral_fusion";
}
