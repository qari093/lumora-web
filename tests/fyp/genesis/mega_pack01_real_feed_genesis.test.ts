import { describe, it, expect } from "vitest";
import { GENESIS_TRACES, validateGenesisRegistry } from "../../../src/core/fyp/genesis/genesisRegistry";
import { getProductionFypFeed } from "../../../src/core/fyp/feed/productionFeedAdapter";

describe("FYP Ω∞ Mega Pack 01 — Real Feed + Genesis Collection", () => {
  it("contains exactly 10 Genesis traces", () => {
    expect(GENESIS_TRACES.length).toBe(10);
  });

  it("protects every Genesis trace from deletion or retirement", () => {
    expect(GENESIS_TRACES.every(trace => trace.protected === true)).toBe(true);
    expect(GENESIS_TRACES.every(trace => trace.retirable === false)).toBe(true);
  });

  it("prioritizes every Genesis trace as very high", () => {
    expect(GENESIS_TRACES.every(trace => trace.priority === "VERY_HIGH")).toBe(true);
  });

  it("requires verified license and 9:16 aspect ratio metadata", () => {
    expect(GENESIS_TRACES.every(trace => trace.license === "owned_or_verified")).toBe(true);
    expect(GENESIS_TRACES.every(trace => trace.aspectRatio === "9:16")).toBe(true);
  });

  it("validates registry shape", () => {
    const result = validateGenesisRegistry();
    expect(result.ok).toBe(true);
    expect(result.total).toBe(10);
    expect(result.uniqueIds).toBe(10);
  });

  it("wires canonical production feed adapter to Genesis collection", () => {
    const feed = getProductionFypFeed();
    expect(feed.ok).toBe(true);
    expect(feed.source).toBe("lumora_genesis_fyp_v1");
    expect(feed.count).toBe(10);
    expect(feed.feed[0].media.videoUrl).toBe("/genesis/videos/trace01.mp4");
  });
});
