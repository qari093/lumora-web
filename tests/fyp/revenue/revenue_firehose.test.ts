import { describe, expect, it } from "vitest";

import {
  createCreatorWallet,
  applyRevenueEvent
} from "@/src/core/fyp/revenue/wallet";

import {
  createCreatorRevenueEvent
} from "@/src/core/fyp/revenue/revenueEvents";

import {
  calculateEchoDividend
} from "@/src/core/fyp/revenue/echoDividends";

import {
  createAtmosphereSubscription
} from "@/src/core/fyp/revenue/subscriptions";

import {
  calculatePulseRoyalty,
  calculateGutCheckPayout,
  calculateRelicLicense
} from "@/src/core/fyp/revenue/royalties";

import {
  createSyndicationSnippet
} from "@/src/core/fyp/revenue/syndication";

import {
  createCreatorRevenueDashboard
} from "@/src/core/fyp/revenue/dashboard";

describe("Lumora FYP Revenue Firehose", () => {
  it("creates wallet and applies revenue", () => {
    const wallet = createCreatorWallet("creator_001");

    const event = createCreatorRevenueEvent({
      creatorId: "creator_001",
      source: "echo_dividend",
      amount: 5.55,
      referenceId: "clip_001",
      now: 100
    });

    const updated = applyRevenueEvent({
      wallet,
      event
    });

    expect(updated.pending).toBe(5.55);
    expect(updated.lifetimeEarned).toBe(5.55);
    expect(updated.eventCount).toBe(1);
  });

  it("calculates all revenue components", () => {
    expect(
      calculateEchoDividend({
        echoCount: 100,
        capsuleSaves: 10,
        replayAfter48h: 20
      })
    ).toBeGreaterThan(0);

    expect(
      calculatePulseRoyalty({
        inclusions: 4,
        voltageAverage: 80
      })
    ).toBeGreaterThan(0);

    expect(
      calculateGutCheckPayout({
        dailyInclusions: 3,
        strongestClipWins: 2
      })
    ).toBeGreaterThan(0);

    expect(
      calculateRelicLicense({
        relicClaims: 100,
        engagementValue: 50
      })
    ).toBeGreaterThan(0);
  });

  it("creates atmosphere subscription", () => {
    const sub = createAtmosphereSubscription({
      creatorId: "creator_001",
      fanId: "fan_001",
      mode: "drift",
      monthlyAmount: 2.99
    });

    expect(sub.active).toBe(true);
    expect(sub.mode).toBe("drift");
  });

  it("creates syndication snippet", () => {
    const snippet = createSyndicationSnippet({
      snippetId: "snip_001",
      creatorId: "creator_001",
      sourceContentId: "clip_001",
      intensity: 9
    });

    expect(snippet.durationSeconds).toBe(6);
    expect(snippet.licensed).toBe(true);
    expect(snippet.microPayment).toBeGreaterThan(0);
  });

  it("creates dashboard breakdown", () => {
    const wallet = createCreatorWallet("creator_001");
    const event = createCreatorRevenueEvent({
      creatorId: "creator_001",
      source: "rush_bonus",
      amount: 5,
      referenceId: "rush_001",
      now: 100
    });
    const updated = applyRevenueEvent({ wallet, event });

    const dashboard = createCreatorRevenueDashboard({
      wallet: updated,
      events: [event]
    });

    expect(dashboard.sourceBreakdown.rush_bonus).toBe(5);
    expect(dashboard.lifetimeEarned).toBe(5);
  });
});
