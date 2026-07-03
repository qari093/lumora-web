import { describe, expect, it } from "vitest";
import {
  createUniversalShareIntent,
  getShareDestination,
  getSupportedShareModes,
  materializeShareIntent,
  rankShareDestinations,
} from "@/src/core/share";

describe("USL Mega Pack 02A — Universal Share Experience Core", () => {
  it("registers canonical destinations", () => {
    expect(getShareDestination("lumaspace")?.label).toBe("LumaSpace");
    expect(getShareDestination("lumalink")?.portal).toBe("lumalink");
    expect(getShareDestination("external_qr")?.supportsQr).toBe(true);
  });

  it("ranks FYP to LumaSpace as primary path", () => {
    const ranked = rankShareDestinations({ sourcePortal: "fyp", mood: "wonder" });
    expect(ranked[0].id).toBe("lumaspace");
  });

  it("filters unsupported modes per destination", () => {
    const live = getShareDestination("live");
    if (!live) throw new Error("missing_live_destination");
    const modes = getSupportedShareModes(live).map((mode) => mode.id);
    expect(modes).toContain("instant");
    expect(modes).not.toContain("silent");
  });

  it("creates a destination-aware share intent", () => {
    const intent = createUniversalShareIntent(
      {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "external",
        sourceObjectId: "trace_002",
        title: "Trace to LumaSpace",
        createdBy: "founder",
      },
      "lumaspace",
      "silent",
    );

    expect(intent.destination.portal).toBe("lumaspace");
    expect(intent.mode).toBe("silent");
    expect(intent.input.destinationPortal).toBe("lumaspace");
  });

  it("materializes share intent through canonical SDK", () => {
    const intent = createUniversalShareIntent(
      {
        kind: "memory",
        sourcePortal: "lumaspace",
        destinationPortal: "external",
        sourceObjectId: "memory_002",
        title: "Memory to LumaLink",
        createdBy: "founder",
      },
      "lumalink",
      "echo",
    );

    const share = materializeShareIntent(intent);
    expect(share.id).toMatch(/^uso_/);
    expect(share.destinationPortal).toBe("lumalink");
    expect(share.metadata.transformation).toBe("lumalink");
  });

  it("rejects unsupported share modes", () => {
    expect(() =>
      createUniversalShareIntent(
        {
          kind: "live_room",
          sourcePortal: "live",
          destinationPortal: "external",
          sourceObjectId: "room_002",
          title: "Live silent attempt",
          createdBy: "founder",
        },
        "live",
        "silent",
      ),
    ).toThrow("unsupported_share_mode:silent:live");
  });
});
