import { describe, it, expect } from "vitest";

import {
  enrichFypMetadata
} from "../../../src/core/fyp/metadata/metadataEnricher";

import {
  passesMetadataGate
} from "../../../src/core/fyp/metadata/metadataGate";

describe("FYP Omega Pack 08", () => {
  it("enriches metadata with lane and attribution", () => {
    const result = enrichFypMetadata({
      id: "asset_1",
      title: "NASA Galaxy Wonder",
      source: "NASA",
      playbackUrl: "https://cdn.example.com/a.mp4",
      durationSeconds: 30
    });

    expect(result.primaryLane).toBe("wonder");
    expect(result.attribution).toContain("NASA");
  });

  it("passes strong metadata through gate", () => {
    const result = enrichFypMetadata({
      id: "asset_2",
      title: "Science Tutorial",
      source: "MIXKIT",
      playbackUrl: "https://cdn.example.com/b.mp4",
      durationSeconds: 25
    });

    expect(passesMetadataGate(result)).toBe(true);
  });

  it("rejects weak metadata quality", () => {
    const result = enrichFypMetadata({
      id: "asset_3",
      title: "Broken Clip",
      source: "",
      playbackUrl: "/local/broken.mp4",
      durationSeconds: 999
    });

    expect(passesMetadataGate(result)).toBe(false);
  });
});
