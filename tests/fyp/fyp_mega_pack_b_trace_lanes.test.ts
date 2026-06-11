import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createTraceSignal, normalizeLane, shouldOfferStoryContinuation, summarizeTrace } from "@/src/core/fyp/lumoraTrace";

const component = readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
const styles = readFileSync("app/fyp/styles.module.css", "utf8");

describe("FYP Mega Pack B Lumora Trace + Emotional Lanes", () => {
  it("adds Lumora Trace runtime instead of generic fullscreen clone runtime", () => {
    expect(component).toContain('data-fyp-runtime="lumora-depthfeed-trace"');
    expect(component).toContain("Lumora Trace · attention becomes direction");
    expect(component).toContain("Continue this journey?");
  });

  it("renders emotional lane switching and retention ring lite", () => {
    expect(component).toContain("LUMORA_LANES.map");
    expect(component).toContain("data-lumora-lane");
    expect(component).toContain("retentionRing");
    expect(component).toContain("SparkBoard");
    expect(styles).toContain(".laneSwitch");
    expect(styles).toContain(".retentionRing");
    expect(styles).toContain(".traceDock");
  });

  it("keeps native videos production-safe", () => {
    expect(component).toContain("autoPlay");
    expect(component).toContain('preload="auto"');
    expect(component).toContain("safePlay(video)");
    expect(component).toContain("playsInline");
  });

  it("summarizes curiosity trace deterministically", () => {
    const signals = [
      createTraceSignal({ videoId: "a", lane: "science", completed: true, watchedMs: 8000 }),
      createTraceSignal({ videoId: "b", lane: "science", deepDive: true, watchedMs: 6000 }),
      createTraceSignal({ videoId: "c", lane: "archive", saved: true, watchedMs: 4000 })
    ];
    const summary = summarizeTrace(signals);
    expect(normalizeLane("science")).toBe("learn");
    expect(summary.dominantLane).toBe("learn");
    expect(summary.curiosityScore).toBeGreaterThan(20);
    expect(shouldOfferStoryContinuation(signals, "learn")).toBe(true);
  });
});
