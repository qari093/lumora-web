export type IntegrationTier =
  | "tier1"
  | "tier2"
  | "tier2_5"
  | "tier3";

export interface MeshPortal {
  id: string;
  tier: IntegrationTier;
}

export function resolveMeshCapability(
  portal: MeshPortal
): number {
  switch (portal.tier) {
    case "tier1":
      return 1;

    case "tier2":
      return 0.7;

    case "tier2_5":
      return 0.5;

    default:
      return 0.2;
  }
}
