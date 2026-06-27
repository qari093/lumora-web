import { describe, it, expect } from "vitest";

import {
  validateMediaAsset
} from "../../../src/core/fyp/ingestion/mediaValidator";

import {
  normalizeMediaAsset
} from "../../../src/core/fyp/ingestion/mediaNormalizer";

import {
  removeDuplicateAssets
} from "../../../src/core/fyp/ingestion/dedupe";

describe("FYP Omega Pack 04", () => {

  it("validates media assets", () => {
    expect(
      validateMediaAsset({
        id: "1",
        source: "PEXELS",
        url: "https://example.com/video.mp4",
        mimeType: "video/mp4",
        durationSeconds: 30
      })
    ).toBe(true);
  });

  it("normalizes assets", () => {
    const result = normalizeMediaAsset({
      id: "1",
      source: "PEXELS",
      url: "https://example.com/video.mp4",
      mimeType: "video/mp4",
      durationSeconds: 30
    });

    expect(result.verified).toBe(true);
    expect(result.format).toBe("mp4");
  });

  it("removes duplicates", () => {
    const result = removeDuplicateAssets([
      {
        id: "1",
        source: "PEXELS",
        url: "https://a.com",
        mimeType: "video/mp4",
        durationSeconds: 10
      },
      {
        id: "1",
        source: "PEXELS",
        url: "https://a.com",
        mimeType: "video/mp4",
        durationSeconds: 10
      }
    ]);

    expect(result.length).toBe(1);
  });

});
