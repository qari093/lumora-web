import { describe, expect, it, beforeEach } from "vitest";

import {
  appendFypEvent,
  clearFypEventsForTest
} from "@/src/core/fyp/runtime-tracking/fypEventStore";

import { GET } from "@/app/api/fyp/feed/route";

async function readFeed() {
  const response = await GET();
  return response.json();
}

describe("FYP live feed uses real learning memory", () => {
  beforeEach(() => {
    clearFypEventsForTest();
  });

  it("serves live feed with learning metadata", async () => {
    appendFypEvent({
      cardId: "seed-1",
      event: "watch_progress",
      value: 1,
      lane: "wonder",
      sessionId: "live-feed-test"
    });

    const json = await readFeed();

    expect(json.ok).toBe(true);
    expect(json.source).toBe("lumora_runtime_chain");
    expect(json.count).toBeGreaterThanOrEqual(48);
    expect(json.runtime.traceCoverage.length).toBeGreaterThan(0);
    expect(json.items[0].rankReasons).toContain("learning_feedback");
    expect(json.items[0].rankReasons).toContain("trace_aware_rerank");
  });

  it("keeps feed production safe when no real events exist", async () => {
    const json = await readFeed();

    expect(json.ok).toBe(true);
    expect(json.count).toBeGreaterThanOrEqual(48);
    expect(json.items.every((item: any) => item.autoplayEligible === true)).toBe(true);
  });

  it("returns rank scores for frontend ordering", async () => {
    appendFypEvent({
      cardId: "seed-2",
      event: "save",
      value: 1,
      lane: "learn",
      sessionId: "live-feed-test"
    });

    const json = await readFeed();

    expect(typeof json.items[0].rankScore).toBe("number");
    expect(json.items[0].rankScore).toBeGreaterThanOrEqual(0);
    expect(json.items[0].rankScore).toBeLessThanOrEqual(1);
  });
});
