import { describe, expect, it } from "vitest";

import { detectPulseSync } from "../../../src/core/gmar/fomo-adrenaline/pulseSync";
import { createFinalBreathMoment } from "../../../src/core/gmar/fomo-adrenaline/finalBreath";
import { detectGloryNearMiss } from "../../../src/core/gmar/fomo-adrenaline/gloryNearMiss";
import {
  createEthicalVanishingEchoPolicy,
  ethicalVanishingEchoHealthy,
} from "../../../src/core/gmar/fomo-adrenaline/vanishingEchoPolicy";
import { createCivilizationScar } from "../../../src/core/gmar/fomo-adrenaline/civilizationScar";
import { fomoAdrenalineSafetyHealthy } from "../../../src/core/gmar/fomo-adrenaline/safety";

describe("GMAR Pack 09 — Ethical FOMO + Adrenaline", () => {
  it("detects Pulse Sync without power gain", () => {
    const sync = detectPulseSync({
      meanCorrelation: 0.82,
      smoothMovementScore: 0.75,
      consecutiveSeconds: 9,
    });

    expect(sync.active).toBe(true);
    expect(sync.hudStripped).toBe(true);
    expect(sync.heartbeatAudio).toBe(true);
    expect(sync.grantsPower).toBe(false);
  });

  it("creates Final Breath as honor, not punishment", () => {
    const moment = createFinalBreathMoment({
      highStakes: true,
      nearDeath: true,
      contributionSeconds: 32,
      allySaved: true,
    });

    expect(moment.triggered).toBe(true);
    expect(moment.honorsPlayer).toBe(true);
    expect(moment.message).toContain("32");
  });

  it("detects Glory Near-Miss only from natural outcomes", () => {
    const moment = detectGloryNearMiss({
      naturalOutcome: true,
      millisecondsFromFailure: 300,
      squadPresent: true,
    });

    expect(moment.triggered).toBe(true);
    expect(moment.slowMotion).toBe(true);
    expect(moment.artificialTuning).toBe(false);
    expect(moment.echoEligible).toBe(true);
  });

  it("keeps Vanishing Echo ethical and beauty-only", () => {
    const policy = createEthicalVanishingEchoPolicy();

    expect(ethicalVanishingEchoHealthy()).toBe(true);
    expect(policy.maxPerMonth).toBe(3);
    expect(policy.powerReward).toBe(false);
    expect(policy.fakeUrgency).toBe(false);
  });

  it("creates permanent Civilization Scar without reward pressure", () => {
    const scar = createCivilizationScar("scar-1");

    expect(scar.permanent).toBe(true);
    expect(scar.plaqueVisible).toBe(true);
    expect(scar.grantsPower).toBe(false);
  });

  it("validates combined safety contract", () => {
    expect(fomoAdrenalineSafetyHealthy()).toBe(true);
  });
});
