export type RegionRestrictInput = {
  entityId: string;
  originRegion: string;
  allowedRegions: string[];
  reason:
    | "cultural_risk"
    | "rights_limit"
    | "regional_sensitivity"
    | "ops_override";
};

export type RegionRestrictResult = {
  restricted: true;
  entityId: string;
  originRegion: string;
  allowedRegions: string[];
  blockedOutsideAllowedRegions: boolean;
  reason: RegionRestrictInput["reason"];
};

function normalizeRegion(value: string): string {
  return value.trim().toLowerCase();
}

export function applyRegionRestrictAction(
  input: RegionRestrictInput
): RegionRestrictResult {
  const allowedRegions = [...new Set(input.allowedRegions.map(normalizeRegion).filter(Boolean))];

  return {
    restricted: true,
    entityId: input.entityId,
    originRegion: normalizeRegion(input.originRegion),
    allowedRegions,
    blockedOutsideAllowedRegions: true,
    reason: input.reason,
  };
}

export function shouldRegionRestrict(
  reason: RegionRestrictInput["reason"]
): boolean {
  return (
    reason === "cultural_risk" ||
    reason === "rights_limit" ||
    reason === "regional_sensitivity" ||
    reason === "ops_override"
  );
}
