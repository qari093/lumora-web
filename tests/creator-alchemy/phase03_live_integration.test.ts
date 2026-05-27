import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  calculateLiveResonance,
  createLiveAlchemyRoom,
  decideLiveRitual,
  validateLiveEmotionalSafety
} from "@/src/core/creator-alchemy/live-integration";

describe("Phase 03 — Live Portal Integration Ω", () => {
  it("creates quiet live constellation rooms", () => {
    const room = createLiveAlchemyRoom({
      id: "room-1",
      constellation: "Midnight Souls",
      mode: "dream_chamber",
      hostCreatorId: "creator-1",
      activeViewers: 12
    });

    expect(room.likesHidden).toBe(true);
    expect(room.commentsHidden).toBe(true);
    expect(room.quietGiftsEnabled).toBe(true);
    expect(room.moderationEnabled).toBe(true);
  });

  it("calculates live resonance safely", () => {
    const resonance = calculateLiveResonance({
      roomId: "room-1",
      silentViewers: 50,
      quietGifts: 20,
      lingerSecondsAvg: 100,
      emotionalSafetyScore: 0.9
    });

    expect(resonance).toBeGreaterThan(0.6);
    expect(resonance).toBeLessThanOrEqual(1);
  });

  it("allows Dream Chamber only after resonance and cooldown", () => {
    const decision = decideLiveRitual({
      ritual: "dream_chamber",
      resonance: 0.8,
      moderationSafe: true,
      daysSinceLastRitual: 21
    });

    expect(decision.allowed).toBe(true);
  });

  it("blocks live ritual when moderation is unsafe", () => {
    const decision = decideLiveRitual({
      ritual: "dream_chamber",
      resonance: 0.8,
      moderationSafe: false,
      daysSinceLastRitual: 21
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("moderation_not_safe");
  });

  it("validates live emotional safety", () => {
    expect(
      validateLiveEmotionalSafety({
        moderationEnabled: true,
        reportedMessages: 0,
        unsafeSignals: 0,
        hostSanctuaryMode: false
      })
    ).toBe(true);

    expect(
      validateLiveEmotionalSafety({
        moderationEnabled: true,
        reportedMessages: 0,
        unsafeSignals: 1,
        hostSanctuaryMode: false
      })
    ).toBe(false);
  });

  it("creates live integration API route", () => {
    expect(existsSync("app/api/creator-alchemy/live-integration/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/live-integration/route.ts", "utf8")).toContain("createLiveAlchemyRoom");
  });
});
