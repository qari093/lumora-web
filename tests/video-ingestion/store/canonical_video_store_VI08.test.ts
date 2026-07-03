import { beforeEach, describe, expect, it } from "vitest";
import {
  clearCanonicalVideoStore,
  createCanonicalVideoStoreSnapshot,
  createValidationMediaPool,
  getCanonicalVideo,
  listCanonicalVideos,
  seedValidationMediaPool,
  upsertCanonicalVideo,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 08 Canonical Video Store", () => {
  beforeEach(() => {
    clearCanonicalVideoStore();
  });

  it("creates the controlled 40-video validation media pool", () => {
    const assets = createValidationMediaPool();

    expect(assets).toHaveLength(40);
    expect(assets.filter((asset) => asset.tags.includes("genesis"))).toHaveLength(10);
    expect(assets.filter((asset) => asset.tags.includes("serenity"))).toHaveLength(10);
    expect(assets.filter((asset) => asset.tags.includes("wonder"))).toHaveLength(10);
    expect(assets.filter((asset) => asset.tags.includes("spectacle"))).toHaveLength(5);
    expect(assets.filter((asset) => asset.tags.includes("edge_case"))).toHaveLength(5);
  });

  it("upserts and retrieves canonical video records", () => {
    const asset = createValidationMediaPool()[0];
    const record = upsertCanonicalVideo(asset);

    expect(record.id).toBe(asset.id);
    expect(record.version).toBe(1);
    expect(getCanonicalVideo(asset.id)?.asset.title).toBe(asset.title);
  });

  it("increments versions on repeated upserts", () => {
    const asset = createValidationMediaPool()[0];

    upsertCanonicalVideo(asset);
    const second = upsertCanonicalVideo({ ...asset, title: "Updated Validation Trace" });

    expect(second.version).toBe(2);
    expect(getCanonicalVideo(asset.id)?.asset.title).toBe("Updated Validation Trace");
  });

  it("queries records by provider and tags", () => {
    seedValidationMediaPool();

    expect(listCanonicalVideos({ providerId: "validation_pool" })).toHaveLength(40);
    expect(listCanonicalVideos({ tags: ["wonder"] })).toHaveLength(10);
    expect(listCanonicalVideos({ tags: ["edge_case"], limit: 2 })).toHaveLength(2);
  });

  it("creates store snapshots for runtime dashboards", () => {
    seedValidationMediaPool();

    const snapshot = createCanonicalVideoStoreSnapshot();

    expect(snapshot.total).toBe(40);
    expect(snapshot.providers).toEqual(["validation_pool"]);
  });
});
