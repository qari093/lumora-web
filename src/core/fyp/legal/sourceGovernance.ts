export type FypLicenseRisk = "low" | "medium" | "high" | "blocked";
export type FypSourceTier = "A_DIRECT_SAFE" | "B_PUBLIC_ARCHIVE" | "C_EMBED_ONLY" | "D_BLOCKED";

export type FypSourceGovernanceRecord = {
  sourceId: string;
  label: string;
  tier: FypSourceTier;
  commercialUseAllowed: boolean;
  attributionRequired: boolean;
  embedOnly: boolean;
  requiresHumanReview: boolean;
  licenseRisk: FypLicenseRisk;
  minimumVerifiedVideos: number;
};

export const FYP_ALLOWED_SOURCE_REGISTRY: FypSourceGovernanceRecord[] = [
  {
    sourceId: "PEXELS",
    label: "Pexels",
    tier: "A_DIRECT_SAFE",
    commercialUseAllowed: true,
    attributionRequired: false,
    embedOnly: false,
    requiresHumanReview: false,
    licenseRisk: "low",
    minimumVerifiedVideos: 250
  },
  {
    sourceId: "PIXABAY",
    label: "Pixabay",
    tier: "A_DIRECT_SAFE",
    commercialUseAllowed: true,
    attributionRequired: false,
    embedOnly: false,
    requiresHumanReview: false,
    licenseRisk: "low",
    minimumVerifiedVideos: 250
  },
  {
    sourceId: "MIXKIT",
    label: "Mixkit",
    tier: "A_DIRECT_SAFE",
    commercialUseAllowed: true,
    attributionRequired: true,
    embedOnly: false,
    requiresHumanReview: false,
    licenseRisk: "low",
    minimumVerifiedVideos: 250
  },
  {
    sourceId: "NASA",
    label: "NASA",
    tier: "B_PUBLIC_ARCHIVE",
    commercialUseAllowed: true,
    attributionRequired: true,
    embedOnly: false,
    requiresHumanReview: true,
    licenseRisk: "medium",
    minimumVerifiedVideos: 250
  },
  {
    sourceId: "INTERNET_ARCHIVE",
    label: "Internet Archive",
    tier: "B_PUBLIC_ARCHIVE",
    commercialUseAllowed: false,
    attributionRequired: true,
    embedOnly: false,
    requiresHumanReview: true,
    licenseRisk: "high",
    minimumVerifiedVideos: 0
  },
  {
    sourceId: "YOUTUBE_OFFICIAL",
    label: "YouTube Official",
    tier: "C_EMBED_ONLY",
    commercialUseAllowed: false,
    attributionRequired: true,
    embedOnly: true,
    requiresHumanReview: true,
    licenseRisk: "high",
    minimumVerifiedVideos: 0
  }
];

export function getFypSourceGovernance(sourceId: string): FypSourceGovernanceRecord | null {
  const normalized = sourceId.trim().toUpperCase();
  return FYP_ALLOWED_SOURCE_REGISTRY.find((source) => source.sourceId === normalized) ?? null;
}

export function canServeFypSourceDirectly(sourceId: string): boolean {
  const source = getFypSourceGovernance(sourceId);
  return Boolean(
    source &&
      source.commercialUseAllowed &&
      !source.embedOnly &&
      source.licenseRisk !== "blocked" &&
      source.tier !== "D_BLOCKED"
  );
}

export function requiresFypAttribution(sourceId: string): boolean {
  return getFypSourceGovernance(sourceId)?.attributionRequired === true;
}

export function validateFypSourceRegistry(): boolean {
  const ids = new Set(FYP_ALLOWED_SOURCE_REGISTRY.map((source) => source.sourceId));
  return (
    ids.size === FYP_ALLOWED_SOURCE_REGISTRY.length &&
    FYP_ALLOWED_SOURCE_REGISTRY.length >= 5 &&
    FYP_ALLOWED_SOURCE_REGISTRY.every((source) => source.sourceId && source.label && source.tier && source.licenseRisk) &&
    FYP_ALLOWED_SOURCE_REGISTRY.filter((source) => source.tier === "A_DIRECT_SAFE").length >= 3 &&
    FYP_ALLOWED_SOURCE_REGISTRY.some((source) => source.requiresHumanReview) &&
    FYP_ALLOWED_SOURCE_REGISTRY.some((source) => source.embedOnly)
  );
}
