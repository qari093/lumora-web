import { describe, expect, it } from "vitest";

import {
  armKillSwitch,
  resolveKillSwitch
} from "@/src/core/fyp/kill-switch/killSwitch";

import {
  resurrectVaultedContent
} from "@/src/core/fyp/kill-switch/echoResurrection";

import {
  createReckoningDay,
  activateReckoningDay
} from "@/src/core/fyp/reckoning/reckoningDay";

import {
  recalibrateAura
} from "@/src/core/fyp/reckoning/recalibration";

import {
  createPhoenixPhase
} from "@/src/core/fyp/reckoning/phoenixPhase";

describe("Lumora FYP Kill Switch + Reckoning Day", () => {
  it("arms kill switch", () => {
    const attempt = armKillSwitch({
      creatorId: "creator_1",
      contentId: "clip_1",
      baselineImpact: 1000,
      now: 100
    });

    expect(attempt.state).toBe("armed");
  });

  it("resolves successful kill switch", () => {
    const attempt = armKillSwitch({
      creatorId: "creator_1",
      contentId: "clip_1",
      baselineImpact: 1000,
      now: 100
    });

    const result = resolveKillSwitch({
      attempt,
      currentImpact: 2000
    });

    expect(result).toBe("survived");
  });

  it("resurrects vaulted content", () => {
    const resurrection = resurrectVaultedContent({
      creatorId: "creator_1",
      contentId: "clip_1",
      cooldownDays: 14,
      resonanceSparkSpent: true
    });

    expect(resurrection.restored).toBe(true);
    expect(resurrection.visibilityPenalty).toBe(25);
  });

  it("creates and activates reckoning day", () => {
    const reckoning = createReckoningDay({
      year: 2026,
      creatorCount: 1000
    });

    const active = activateReckoningDay(reckoning);

    expect(active.state).toBe("active");
  });

  it("creates phoenix phase after downgrade", () => {
    const recalibration = recalibrateAura({
      creatorId: "creator_1",
      previousTier: "volt",
      nextTier: "spark"
    });

    const phoenix = createPhoenixPhase(recalibration);

    expect(recalibration.phoenixPhase).toBe(true);
    expect(phoenix.discoveryBoostPercent).toBe(25);
  });
});
