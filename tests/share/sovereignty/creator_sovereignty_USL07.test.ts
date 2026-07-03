import { describe, expect, it } from "vitest";
import {
  appendProvenanceTrail,
  applySovereigntyWatermark,
  assertCreatorRights,
  createCreatorRightsPolicy,
  createProvenanceEntry,
  createRightsAuditLog,
  createSovereigntyWatermark,
  evaluateCreatorRights,
  inheritCreatorRightsPolicy,
  summarizeRightsAudit,
  verifyProvenanceTrail,
} from "@/src/core/share";

describe("USL Mega Pack 07 — Creator Sovereignty Ω", () => {
  it("creates creator rights policies and inherits them safely", () => {
    const policy = createCreatorRightsPolicy({
      creatorId: "creator_1",
      objectId: "memory_1",
      remixAllowed: true,
      licenseScopes: ["private", "remix_allowed"],
    });

    const child = inheritCreatorRightsPolicy(policy, "remix_1", "creator_2");

    expect(policy.attributionRequired).toBe(true);
    expect(policy.watermarkRequired).toBe(true);
    expect(child.objectId).toBe("remix_1");
    expect(child.remixAllowed).toBe(true);
    expect(child.attributionRequired).toBe(true);
  });

  it("enforces remix, download, and commercial rights", () => {
    const policy = createCreatorRightsPolicy({
      creatorId: "creator_1",
      objectId: "trace_1",
      remixAllowed: false,
      downloadAllowed: false,
      commercialUseAllowed: false,
    });

    expect(evaluateCreatorRights(policy, "share").allowed).toBe(true);
    expect(evaluateCreatorRights(policy, "remix").reason).toBe("remix_not_allowed");
    expect(evaluateCreatorRights(policy, "download").reason).toBe("download_not_allowed");
    expect(evaluateCreatorRights(policy, "commercial_use").reason).toBe("commercial_use_not_allowed");
    expect(() => assertCreatorRights(policy, "remix")).toThrow("creator_rights_denied");
  });

  it("creates and verifies provenance trails", () => {
    const created = createProvenanceEntry({
      objectId: "memory_1",
      actorId: "creator_1",
      action: "created",
    });

    const shared = createProvenanceEntry({
      objectId: "memory_1",
      actorId: "creator_1",
      action: "shared",
      parentObjectId: "memory_0",
    });

    const trail = appendProvenanceTrail([created], shared);

    expect(trail).toHaveLength(2);
    expect(verifyProvenanceTrail(trail)).toBe(true);
    expect(trail[0].hash).toHaveLength(64);
  });

  it("applies watermarking and rights audit logs", () => {
    const policy = createCreatorRightsPolicy({
      creatorId: "creator_1",
      objectId: "memory_1",
    });

    const decision = evaluateCreatorRights(policy, "share");
    const log = createRightsAuditLog({
      objectId: policy.objectId,
      actorId: "viewer_1",
      decision,
    });

    expect(createSovereigntyWatermark(policy)).toContain("Lumora Sovereign Share");
    expect(applySovereigntyWatermark(policy, "Memory Title")).toContain("creator_1");
    expect(summarizeRightsAudit([log]).allowed).toBe(1);
  });
});
