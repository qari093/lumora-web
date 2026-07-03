import type { CanonicalVideoAsset } from "../runtime";

export type RightsDecision = "allow" | "quarantine" | "reject";

export type LicenseFamily =
  | "owned"
  | "public_domain"
  | "creative_commons"
  | "commercial_stock"
  | "embed_only"
  | "partner"
  | "restricted";

export type RightsPolicy = {
  id: string;
  family: LicenseFamily;
  allowCommercialUse: boolean;
  allowDerivatives: boolean;
  requireAttribution: boolean;
  allowNativeIngestion: boolean;
  allowEmbed: boolean;
  allowFyp: boolean;
  allowLumaSpace: boolean;
  allowUniversalShare: boolean;
  expiresAt?: string;
};

export type ProvenanceRecord = {
  id: string;
  assetId: string;
  providerId: string;
  sourceAssetId: string;
  sourceUrl: string;
  licenseId: string;
  licenseSourceUrl: string;
  attribution: string;
  checksum: string;
  capturedAt: string;
  verifiedAt: string;
  policyId: string;
};

export type RightsEvaluation = {
  assetId: string;
  providerId: string;
  decision: RightsDecision;
  policy: RightsPolicy;
  provenance: ProvenanceRecord;
  issues: string[];
  allowedSurfaces: Array<"fyp" | "lumaspace" | "universal_share" | "embed">;
};

export type RightsInput = {
  asset: CanonicalVideoAsset;
  policy: RightsPolicy;
};
