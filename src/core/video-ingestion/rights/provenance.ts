import type { CanonicalVideoAsset } from "../runtime";
import type { ProvenanceRecord, RightsPolicy } from "./types";

export function createProvenanceRecord(
  asset: CanonicalVideoAsset,
  policy: RightsPolicy,
): ProvenanceRecord {
  const verifiedAt = new Date().toISOString();

  return {
    id: `prov_${asset.id}`,
    assetId: asset.id,
    providerId: asset.providerId,
    sourceAssetId: asset.sourceAssetId,
    sourceUrl: asset.sourceUrl,
    licenseId: asset.license.id,
    licenseSourceUrl: asset.license.sourceUrl,
    attribution: asset.attribution,
    checksum: asset.checksum,
    capturedAt: asset.createdAt,
    verifiedAt,
    policyId: policy.id,
  };
}

export function verifyProvenanceRecord(record: ProvenanceRecord) {
  const issues: string[] = [];

  if (!record.assetId) issues.push("missing_asset");
  if (!record.providerId) issues.push("missing_provider");
  if (!record.sourceUrl) issues.push("missing_source_url");
  if (!record.licenseId) issues.push("missing_license");
  if (!record.licenseSourceUrl) issues.push("missing_license_url");
  if (!record.checksum) issues.push("missing_checksum");

  return {
    ok: issues.length === 0,
    issues,
  };
}
