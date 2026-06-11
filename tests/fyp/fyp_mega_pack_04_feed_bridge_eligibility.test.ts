import { describe, expect, it } from "vitest";

import {
  bridgeNormalizedItemToFypFeed,
  buildFypFeedBridge,
  isFypFeedBridgeEligible,
  validateFypFeedBridgeEligibilityRuntime
} from "@/src/core/fyp/ingestion/feedBridge";

describe("FYP Mega Pack 04 — Feed Bridge + Eligibility Pipeline", () => {
  it("bridges normalized direct video into native delivery lane", () => {
    const result = buildFypFeedBridge([
      {
        sourceId: "NASA",
        externalId: "earth-rise",
        title: "Earth Rise",
        sampleUrl: "https://www.nasa.gov/earth-rise.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true,
        embedOnly: false
      }
    ]);

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.deliveryLane).toBe("native_video");
    expect(result.items[0]?.bridgeStatus).toBe("eligible");
  });

  it("bridges official embeds into official embed delivery lane", () => {
    const result = buildFypFeedBridge([
      {
        sourceId: "YOUTUBE_OFFICIAL",
        externalId: "official-embed",
        title: "Official Embed",
        sampleUrl: "https://youtube.com/watch?v=official",
        licenseName: "official_channel_embed",
        commercialReuseAllowed: true,
        embedOnly: true,
        officialChannel: true
      }
    ]);

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.deliveryLane).toBe("official_embed");
  });

  it("deduplicates bridge items", () => {
    const result = buildFypFeedBridge([
      {
        sourceId: "NASA",
        externalId: "same",
        title: "Same",
        sampleUrl: "https://www.nasa.gov/same.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true
      },
      {
        sourceId: "NASA",
        externalId: "same",
        title: "Same",
        sampleUrl: "https://www.nasa.gov/same.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true
      }
    ]);

    expect(result.items).toHaveLength(1);
    expect(result.blocked).toHaveLength(1);
  });

  it("rejects unsafe feed bridge items", () => {
    const item = bridgeNormalizedItemToFypFeed({
      id: "bad",
      sourceId: "",
      sourceLabel: "",
      title: "",
      creator: "",
      url: "",
      licenseName: "",
      attribution: "",
      ingestionMode: "direct_download",
      durationSeconds: 0,
      width: 0,
      height: 0,
      mimeType: "video/mp4",
      rightsVerified: false,
      safeForFyp: false
    });

    expect(isFypFeedBridgeEligible(item)).toBe(false);
    expect(item.bridgeStatus).toBe("blocked");
  });

  it("validates complete feed bridge eligibility runtime", () => {
    expect(validateFypFeedBridgeEligibilityRuntime()).toBe(true);
  });
});
