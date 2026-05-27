import { describe, it, expect } from "vitest";
import { createAfterWitnessState } from "@/src/lib/creator-system/after-witness/state";
import { buildRoomMoodRing } from "@/src/lib/creator-system/after-witness/roomMoodRing";
import { buildHumanTraceSummary } from "@/src/lib/creator-system/after-witness/humanTraceSummary";
import { buildVoiceEcho } from "@/src/lib/creator-system/after-witness/voiceEcho";
import { shouldCollapse } from "@/src/lib/creator-system/after-witness/collapse";

describe("Pack15 After Witness", () => {
  it("creates after-witness state", () => {
    const s = createAfterWitnessState("c1", 0);
    expect(s.visible).toBe(true);
    expect(s.expiresAtMs).toBe(15000);
  });

  it("builds room mood ring", () => {
    const ring = buildRoomMoodRing({ counts: { warm: 3, still: 1 } });
    expect(ring.dominant).toBe("warm");
    expect(ring.intensity).toBeGreaterThan(0);
  });

  it("builds human trace summary", () => {
    const sum = buildHumanTraceSummary({ present:1, stillness:1, hold:0, rewatch:0, silentOvation:1 });
    expect(sum.text).toContain("present");
    expect(sum.interpretationText).toBe(false);
  });

  it("voice echo optional", () => {
    expect(buildVoiceEcho().enabled).toBe(false);
    expect(buildVoiceEcho({ audioUrl: "/a.mp3" }).enabled).toBe(true);
  });

  it("auto collapse works", () => {
    expect(shouldCollapse(20000,15000)).toBe(true);
    expect(shouldCollapse(10000,15000)).toBe(false);
  });
});
