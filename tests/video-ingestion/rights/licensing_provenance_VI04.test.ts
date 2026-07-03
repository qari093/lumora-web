import { describe, expect, it } from "vitest";
import {
  applyRightsDecision,
  createCanonicalVideoAsset,
  createEmbedOnlyRightsPolicy,
  createOwnedRightsPolicy,
  createProvenanceRecord,
  createRestrictedRightsPolicy,
  createRightsAuditLog,
  createVideoLicense,
  evaluateAssetRights,
  verifyProvenanceRecord,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 04 Licensing & Provenance", () => {
  function demoAsset() {
    return createCanonicalVideoAsset({
      providerId: "genesis",
      sourceAssetId: "rights_trace_001",
      sourceUrl: "https://lumora.app/media/rights_trace_001.mp4",
      title: "Rights Trace",
      durationSeconds: 30,
      width: 1920,
      height: 1080,
      hasAudio: true,
      mimeType: "video/mp4",
      attribution: "Lumora Genesis Collection",
      license: createVideoLicense({
        id: "owned",
        label: "Owned",
        commercialUse: true,
        derivativesAllowed: true,
        attributionRequired: false,
        sourceUrl: "https://lumora.app/license",
      }),
      tags: ["genesis", "rights"],
    });
  }

  it("creates and verifies provenance records", () => {
    const policy = createOwnedRightsPolicy();
    const record = createProvenanceRecord(demoAsset(), policy);
    const verification = verifyProvenanceRecord(record);

    expect(record.assetId).toContain("video_");
    expect(record.policyId).toBe(policy.id);
    expect(record.licenseSourceUrl).toBe("https://lumora.app/license");
    expect(verification.ok).toBe(true);
  });

  it("allows owned assets across canonical surfaces", () => {
    const evaluation = evaluateAssetRights(demoAsset(), createOwnedRightsPolicy());

    expect(evaluation.decision).toBe("allow");
    expect(evaluation.allowedSurfaces).toContain("fyp");
    expect(evaluation.allowedSurfaces).toContain("lumaspace");
    expect(evaluation.allowedSurfaces).toContain("universal_share");
    expect(evaluation.allowedSurfaces).toContain("embed");
  });

  it("keeps embed-only media out of native FYP surfaces", () => {
    const evaluation = evaluateAssetRights(demoAsset(), createEmbedOnlyRightsPolicy());

    expect(evaluation.decision).toBe("allow");
    expect(evaluation.allowedSurfaces).toEqual(["universal_share", "embed"]);
  });

  it("rejects restricted media and quarantines applied assets", () => {
    const asset = demoAsset();
    const evaluation = evaluateAssetRights(asset, createRestrictedRightsPolicy());
    const updated = applyRightsDecision(asset, evaluation);

    expect(evaluation.decision).toBe("reject");
    expect(updated.lifecycle).toBe("quarantined");
    expect(updated.metadata.rightsDecision).toBe("reject");
  });

  it("creates rights audit summaries", () => {
    const audit = createRightsAuditLog([demoAsset(), demoAsset()], createOwnedRightsPolicy());

    expect(audit.summary.total).toBe(2);
    expect(audit.summary.allowed).toBe(2);
    expect(audit.summary.quarantined).toBe(0);
    expect(audit.summary.rejected).toBe(0);
  });
});
