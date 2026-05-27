import { describe, expect, it } from "vitest";

import {
  createEchoCandidate,
  scoreEchoTelemetry,
} from "../../../src/core/gmar/echo-engine/scoring";

import {
  createEchoArtifact,
} from "../../../src/core/gmar/echo-engine/artifact";

import {
  calculateEchoLuminosity,
} from "../../../src/core/gmar/echo-engine/decay";

import {
  reviveEchoIfSquadReturns,
} from "../../../src/core/gmar/echo-engine/revival";

import {
  storeEchoMetadataOnly,
} from "../../../src/core/gmar/echo-engine/storage";

describe("GMAR Pack 08 — Echo Engine", () => {
  it("scores strong echo telemetry above threshold", () => {
    const score = scoreEchoTelemetry({
      nearFailureDeltaMs: 300,
      coordinationScore: 0.9,
      rarityPercent: 0.2,
      emotionalArcQuality: 0.9,
      socialAcknowledgmentScore: 0.8,
    });

    expect(score).toBeGreaterThanOrEqual(75);
  });

  it("creates eligible sync echo candidate", () => {
    const candidate = createEchoCandidate({
      nearFailureDeltaMs: 300,
      coordinationScore: 0.9,
      rarityPercent: 0.2,
      emotionalArcQuality: 0.9,
      socialAcknowledgmentScore: 0.8,
    });

    expect(candidate.eligible).toBe(true);
    expect(candidate.type).toBe("sync");
    expect(candidate.reasons).toContain("coordination");
  });

  it("creates echo artifact without power reward", () => {
    const candidate = createEchoCandidate({
      nearFailureDeltaMs: 300,
      coordinationScore: 0.9,
      rarityPercent: 0.2,
      emotionalArcQuality: 0.9,
      socialAcknowledgmentScore: 0.8,
    });

    const artifact = createEchoArtifact("echo-1", candidate);

    expect(artifact.publicInitially).toBe(true);
    expect(artifact.powerReward).toBe(false);
  });

  it("decays echo luminosity without deleting memory", () => {
    const state = calculateEchoLuminosity("echo-1", 40);

    expect(state.luminosity).toBeGreaterThanOrEqual(0.1);
    expect(state.dormant).toBe(true);
  });

  it("revives echo when original squad returns", () => {
    const revival = reviveEchoIfSquadReturns("echo-1", true);

    expect(revival.revived).toBe(true);
    expect(revival.celebration).toBe("soft_reignite");
  });

  it("stores echo as metadata snapshot", () => {
    const candidate = createEchoCandidate({
      nearFailureDeltaMs: 300,
      coordinationScore: 0.9,
      rarityPercent: 0.2,
      emotionalArcQuality: 0.9,
      socialAcknowledgmentScore: 0.8,
    });

    const stored = storeEchoMetadataOnly(createEchoArtifact("echo-1", candidate));

    expect(stored.storedAs).toBe("metadata_snapshot");
    expect(stored.id).toBe("echo-1");
  });
});
