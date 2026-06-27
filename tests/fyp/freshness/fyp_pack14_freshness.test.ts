import { describe, it, expect } from "vitest";

import {
  evaluateFreshness
} from "../../../src/core/fyp/freshness/freshnessEngine";

import {
  meetsRotationTarget
} from "../../../src/core/fyp/freshness/rotationMetrics";

describe("FYP Omega Pack 14", () => {
  it("blocks recently seen videos", () => {
    const result = evaluateFreshness(
      {
        id: "video_1",
        publishedAt: Date.now()
      },
      [
        {
          assetId: "video_1",
          seenAt: Date.now()
        }
      ],
      Date.now()
    );

    expect(result.eligible).toBe(false);
    expect(result.reason).toBe("recently_seen");
  });

  it("expires old content", () => {
    const result = evaluateFreshness(
      {
        id: "video_2",
        publishedAt: Date.now() - 20 * 24 * 60 * 60 * 1000
      },
      [],
      Date.now()
    );

    expect(result.reason).toBe("expired");
  });

  it("allows fresh content", () => {
    const result = evaluateFreshness(
      {
        id: "video_3",
        publishedAt: Date.now()
      },
      [],
      Date.now()
    );

    expect(result.eligible).toBe(true);
  });

  it("requires 20 percent weekly rotation", () => {
    expect(meetsRotationTarget(20)).toBe(true);
    expect(meetsRotationTarget(10)).toBe(false);
  });
});
