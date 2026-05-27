import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildHumanRealityReport,
  decideHumanRealityTuning,
  normalizeHumanRealityObservation
} from "@/src/core/creator-alchemy/human-reality";

describe("Phase 11 — Human Reality Testing Ω", () => {
  it("normalizes human reality observations", () => {
    const observation = normalizeHumanRealityObservation({
      creatorId: "c1",
      daysActive: -1,
      returnedAfterRest: false,
      whisperOpened: true,
      whisperUseful: true,
      quietGiftSentOrReceived: false,
      dreamChamberJoined: false,
      overloadReported: false,
      trustScore: 2
    });

    expect(observation.daysActive).toBe(0);
    expect(observation.trustScore).toBe(1);
  });

  it("builds human reality report", () => {
    const observations = Array.from({ length: 25 }, (_, index) => ({
      creatorId: `creator-${index + 1}`,
      daysActive: 9,
      returnedAfterRest: index % 3 === 0,
      whisperOpened: true,
      whisperUseful: index % 5 !== 0,
      quietGiftSentOrReceived: index % 4 !== 0,
      dreamChamberJoined: index % 3 === 0,
      overloadReported: false,
      trustScore: 0.78
    }));

    const report = buildHumanRealityReport(observations);

    expect(report.creatorCount).toBe(25);
    expect(report.readyForTuning).toBe(true);
    expect(report.retentionRate).toBeGreaterThan(0.45);
    expect(report.averageTrustScore).toBeGreaterThan(0.7);
  });

  it("decides tuning from human report", () => {
    const report = buildHumanRealityReport([
      {
        creatorId: "c1",
        daysActive: 2,
        returnedAfterRest: false,
        whisperOpened: true,
        whisperUseful: false,
        quietGiftSentOrReceived: false,
        dreamChamberJoined: false,
        overloadReported: true,
        trustScore: 0.4
      }
    ]);

    const tuning = decideHumanRealityTuning(report);

    expect(tuning.tuneWhispers).toBe(true);
    expect(tuning.tuneQuietGifts).toBe(true);
    expect(tuning.tuneOverloadProtection).toBe(true);
    expect(tuning.expandBeta).toBe(false);
  });

  it("creates human reality API route", () => {
    expect(existsSync("app/api/creator-alchemy/human-reality/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/human-reality/route.ts", "utf8")).toContain("buildHumanRealityReport");
  });
});
