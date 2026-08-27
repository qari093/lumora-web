import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  normalizeLane,
  shouldOfferStoryContinuation,
  summarizeTrace,
  type LumoraTraceEvent,
} from "@/src/core/fyp/lumoraTrace";

const component = readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
const styles = readFileSync("app/fyp/styles.module.css", "utf8");

describe("FYP Mega Pack B Lumora Trace + Emotional Lanes", () => {
  it("keeps the canonical fullscreen runtime with Lumora DepthFeed trace attached", () => {
    expect(component).toContain('data-fyp-runtime="fullscreen-native-autoplay"');
    expect(component).toContain('data-depthfeed-runtime="lumora-depthfeed-trace"');
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

  it("summarizes canonical Lumora Trace events deterministically", () => {
    const timestamp = new Date(0).toISOString();
    const signals: LumoraTraceEvent[] = [
      {
        sourceId: "a",
        lane: normalizeLane("learn"),
        watchRatio: 0.8,
        saved: false,
        replayed: false,
        deepDiveOpened: false,
        timestamp,
      },
      {
        sourceId: "b",
        lane: normalizeLane("learn"),
        watchRatio: 0.6,
        saved: false,
        replayed: false,
        deepDiveOpened: true,
        timestamp,
      },
      {
        sourceId: "c",
        lane: normalizeLane("explore"),
        watchRatio: 0.4,
        saved: true,
        replayed: false,
        deepDiveOpened: false,
        timestamp,
      },
    ];

    const summary = summarizeTrace(signals);
    expect(normalizeLane("learn")).toBe("learn");
    expect(summary.dominantLane).toBe("learn");
    expect(summary.curiosityScore).toBeGreaterThan(20);
    expect(shouldOfferStoryContinuation(signals)).toBe(true);
  });
});
