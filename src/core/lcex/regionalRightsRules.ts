export type RegionalRightsRule = {
  id: string;
  sourceId: string;
  region: string;
  allowed: boolean;
  displayState:
    | "safe-display"
    | "safe-embed"
    | "metadata-only"
    | "thumbnail-only"
    | "blocked"
    | "manual-review";
  notes?: string;
};

export const REGIONAL_RIGHTS_RULES: RegionalRightsRule[] = [];

export function registerRegionalRightsRule(
  rule: RegionalRightsRule
): void {
  REGIONAL_RIGHTS_RULES.push({
    ...rule,
    region: rule.region.trim().toLowerCase(),
    sourceId: rule.sourceId.trim(),
  });
}

export function getRegionalRightsRule(
  sourceId: string,
  region: string
): RegionalRightsRule | undefined {
  const normalizedSourceId = sourceId.trim();
  const normalizedRegion = region.trim().toLowerCase();

  return REGIONAL_RIGHTS_RULES.find(
    (rule) =>
      rule.sourceId === normalizedSourceId &&
      rule.region === normalizedRegion
  );
}

export function isRegionAllowedByRightsRule(
  sourceId: string,
  region: string
): boolean {
  const rule = getRegionalRightsRule(sourceId, region);
  return rule ? rule.allowed : false;
}
