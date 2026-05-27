import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildFadingLampRuntime,
  buildMemorialGardenRuntime,
  buildVoiceWillRuntime,
  canActivateVoiceWill,
  decideRitualRuntime
} from "@/src/core/creator-alchemy/ritual-legacy";

describe("Phase 08 — Advanced Ritual + Legacy Runtime Ω", () => {
  it("allows consented yearly rituals after cooldown", () => {
    const decision = decideRitualRuntime({
      creatorId: "creator-1",
      type: "one_time_mirror",
      daysSinceLastShown: 365,
      creatorConsented: true,
      emotionalOverload: false
    });

    expect(decision.allowed).toBe(true);
  });

  it("blocks rituals without consent or during overload", () => {
    expect(
      decideRitualRuntime({
        creatorId: "creator-1",
        type: "mirror_chamber",
        daysSinceLastShown: 365,
        creatorConsented: false,
        emotionalOverload: false
      }).reason
    ).toBe("creator_consent_required");

    expect(
      decideRitualRuntime({
        creatorId: "creator-1",
        type: "mirror_chamber",
        daysSinceLastShown: 365,
        creatorConsented: true,
        emotionalOverload: true
      }).reason
    ).toBe("emotional_overload");
  });

  it("builds Voice Will runtime safely", () => {
    const voiceWill = buildVoiceWillRuntime({
      creatorId: "creator-1",
      enabled: true,
      selectedWorks: ["w1", "w2"],
      approved: true
    });

    expect(canActivateVoiceWill(voiceWill)).toBe(true);
    expect(voiceWill.selectedWorks).toHaveLength(2);
  });

  it("keeps Memorial Garden consent-first and non-monetized", () => {
    const memorial = buildMemorialGardenRuntime({
      creatorId: "creator-1",
      verifiedConsent: false
    });

    expect(memorial.active).toBe(false);
    expect(memorial.monetized).toBe(false);
  });

  it("keeps Fading Lamp dignified and non-blocking", () => {
    const lamp = buildFadingLampRuntime(true);

    expect(lamp.visible).toBe(true);
    expect(lamp.blocksExit).toBe(false);
    expect(lamp.message).toContain("light remains");
  });

  it("creates ritual legacy API route", () => {
    expect(existsSync("app/api/creator-alchemy/ritual-legacy/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/ritual-legacy/route.ts", "utf8")).toContain("decideRitualRuntime");
  });
});
