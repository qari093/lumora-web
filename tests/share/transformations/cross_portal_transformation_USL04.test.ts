import { describe, expect, it } from "vitest";
import {
  createTransformationManifest,
  createUniversalShareIntent,
  crossPortalAdapterExists,
  listCrossPortalTargets,
  materializeShareIntent,
  transformShareAcrossPortals,
  transformShareForPortal,
} from "@/src/core/share";

function demoShare() {
  const intent = createUniversalShareIntent(
    {
      kind: "video",
      sourcePortal: "fyp",
      destinationPortal: "lumaspace",
      sourceObjectId: "trace_cross_001",
      title: "Cross Portal Trace",
      createdBy: "founder",
      metadata: {
        mood: "wonder",
        atmosphere: "cyan-stardust",
        preferredMode: "silent",
      },
    },
    "lumaspace",
    "silent",
  );

  return materializeShareIntent(intent);
}

describe("USL Mega Pack 04 — Cross-Portal Transformation Ω", () => {
  it("registers all canonical portal adapters", () => {
    const targets = listCrossPortalTargets();

    expect(targets).toContain("fyp");
    expect(targets).toContain("lumaspace");
    expect(targets).toContain("lumalink");
    expect(targets).toContain("live");
    expect(targets).toContain("zendoro");
    expect(targets).toContain("lumexa");
    expect(targets).toContain("creator_hub");
    expect(targets).toContain("memory_vault");
    expect(targets).toContain("community");
    expect(targets).toContain("external");
    expect(crossPortalAdapterExists("lumaspace")).toBe(true);
  });

  it("transforms FYP content into a LumaSpace Memory Star while preserving identity", () => {
    const transformed = transformShareForPortal(demoShare(), "lumaspace");

    expect(transformed.targetPortal).toBe("lumaspace");
    expect(transformed.artifactKind).toBe("memory_star");
    expect(transformed.identityPreserved).toBe(true);
    expect(transformed.payload.canonicalShareId).toBe(transformed.shareId);
    expect(transformed.presentation.visualForm).toContain("constellation");
    expect(transformed.deliveryHints.passiveDiscovery).toBe(true);
    expect(transformed.deliveryHints.notificationIntensity).toBe("silent");
  });

  it("transforms one canonical share into multiple portal-specific artifacts", () => {
    const share = demoShare();
    const transformed = transformShareAcrossPortals(share, [
      "lumaspace",
      "lumalink",
      "live",
      "zendoro",
      "memory_vault",
      "external",
    ]);

    expect(transformed).toHaveLength(6);
    expect(transformed.every((item) => item.shareId === share.id)).toBe(true);
    expect(transformed.map((item) => item.artifactKind)).toContain("conversation_card");
    expect(transformed.map((item) => item.artifactKind)).toContain("watch_moment");
    expect(transformed.map((item) => item.artifactKind)).toContain("giftable_recommendation");
    expect(transformed.map((item) => item.artifactKind)).toContain("archived_memory");
  });

  it("creates a transformation manifest for validation and rollback safety", () => {
    const transformed = transformShareAcrossPortals(demoShare(), ["fyp", "lumaspace", "lumalink", "creator_hub"]);
    const manifest = createTransformationManifest(transformed);

    expect(manifest.version).toBe("usl-cross-portal-v1");
    expect(manifest.count).toBe(4);
    expect(manifest.identityPreserved).toBe(true);
    expect(manifest.targets).toEqual(["fyp", "lumaspace", "lumalink", "creator_hub"]);
    expect(manifest.artifacts).toContain("creator_signal");
  });
});
