import {
  LUMORA_TRACE_ATTENTION_MEMORY_READY,
  normalizeTraceLane,
  scoreCuriosity,
  summarizeLumoraTrace
} from "@/src/core/fyp/lumoraTrace";

describe("FYP Mega Pack D — Lumora Trace Attention Memory", () => {
  it("normalizes emotional lanes safely", () => {
    expect(normalizeTraceLane("Wonder")).toBe("wonder");
    expect(normalizeTraceLane("unknown")).toBe("explore");
  });

  it("scores curiosity from watch, save, replay, and deep dive signals", () => {
    expect(scoreCuriosity({
      sourceId: "nasa-0",
      lane: "wonder",
      watchRatio: 1,
      saved: true,
      replayed: true,
      deepDiveOpened: true,
      timestamp: new Date().toISOString()
    })).toBe(100);
  });

  it("summarizes attention into Lumora Trace memory", () => {
    const summary = summarizeLumoraTrace([
      {
        sourceId: "nasa-0",
        lane: "wonder",
        watchRatio: 0.8,
        saved: true,
        replayed: false,
        deepDiveOpened: true,
        timestamp: new Date().toISOString()
      },
      {
        sourceId: "archive-1",
        lane: "learn",
        watchRatio: 0.25,
        saved: false,
        replayed: false,
        deepDiveOpened: false,
        timestamp: new Date().toISOString()
      }
    ]);

    expect(summary.dominantLane).toBe("wonder");
    expect(summary.continuationEligible).toBe(true);
    expect(summary.traceLabel).toContain("Lumora Trace");
    expect(LUMORA_TRACE_ATTENTION_MEMORY_READY).toBe(true);
  });
});
