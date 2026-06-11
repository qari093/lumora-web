import { describe, expect, it } from "vitest";

import {
  adaptFypBridgeItemToRuntimeApi,
  buildFypRuntimeApiFeed,
  validateFypRuntimeApiFeedBridge
} from "@/src/core/fyp/runtime-api/feedApiBridge";

import { buildFypFeedBridge } from "@/src/core/fyp/ingestion/feedBridge";

describe("FYP Mega Pack 05 — Feed API Bridge Runtime", () => {
  it("builds runtime API feed from ingestion bridge", () => {
    const response = buildFypRuntimeApiFeed();

    expect(response.ok).toBe(true);
    expect(response.source).toBe("lumora_fyp_ingestion_bridge");
    expect(response.count).toBeGreaterThanOrEqual(3);
    expect(response.items.length).toBe(response.count);
  });

  it("adapts bridge items into runtime feed contract", () => {
    const bridge = buildFypFeedBridge([
      {
        sourceId: "NASA",
        externalId: "contract-item",
        title: "Contract Item",
        creator: "NASA",
        sampleUrl: "https://www.nasa.gov/contract-item.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true,
        embedOnly: false
      }
    ]);

    const item = adaptFypBridgeItemToRuntimeApi(bridge.items[0]);

    expect(item.sourceId).toBe("NASA");
    expect(item.deliveryLane).toBe("native_video");
    expect(item.traceLane).toBe("wonder");
    expect(item.safetyTags).toContain("rights_verified");
  });

  it("keeps official embeds as official_embed delivery lane", () => {
    const response = buildFypRuntimeApiFeed([
      {
        sourceId: "YOUTUBE_OFFICIAL",
        externalId: "official-embed",
        title: "Official Embed",
        creator: "Official Channel",
        sampleUrl: "https://youtube.com/watch?v=official",
        licenseName: "official_channel_embed",
        commercialReuseAllowed: true,
        embedOnly: true,
        officialChannel: true
      }
    ]);

    expect(response.items).toHaveLength(1);
    expect(response.items[0]?.deliveryLane).toBe("official_embed");
    expect(response.items[0]?.traceLane).toBe("explore");
  });

  it("validates complete runtime API feed bridge", () => {
    expect(validateFypRuntimeApiFeedBridge()).toBe(true);
  });
});
