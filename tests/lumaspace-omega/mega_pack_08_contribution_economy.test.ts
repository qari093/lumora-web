import { describe, expect, it } from "vitest";
import { sendLight, createWarmthAura } from "@/src/core/lumaspace/omega/contribution/lightEngine";
import { createResonanceEcho, canAttachResonance } from "@/src/core/lumaspace/omega/contribution/resonanceEngine";
import { createWeaveThread } from "@/src/core/lumaspace/omega/contribution/weaveEngine";
import { createReflectionBlossom, enableReflectionBlossomSharing } from "@/src/core/lumaspace/omega/contribution/reflectionBlossom";
import { createReliabilityMark } from "@/src/core/lumaspace/omega/contribution/reliabilityEngine";
import { runLumaSpaceOmegaMegaPack08Runtime } from "@/src/core/lumaspace/omega/contribution/omegaPack08Runtime";

describe("LumaSpace Ω∞ Mega Pack 08 — Contribution Economy", () => {
  it("sends private light", () => {
    const light = sendLight({
      actorId: "u1",
      targetId: "m1",
      targetType: "memory",
    });

    expect(light.kind).toBe("light");
    expect(light.visibility).toBe("private");
    expect(light.warmth).toBe(10);
  });

  it("creates warmth aura", () => {
    const light = sendLight({
      actorId: "u1",
      targetId: "u2",
      targetType: "living_card",
    });

    const aura = createWarmthAura("u2", [light]);

    expect(aura.ownerId).toBe("u2");
    expect(aura.visibleTo).toBe("inner_circle");
  });

  it("creates thoughtful resonance", () => {
    const echo = createResonanceEcho({
      id: "r1",
      sourceId: "s1",
      authorId: "u1",
      format: "text",
      body: "This is a thoughtful response.",
    });

    expect(canAttachResonance(echo)).toBe(true);
  });

  it("creates weave with attribution", () => {
    const weave = createWeaveThread({
      id: "w1",
      sourceId: "m1",
      sourceOwnerId: "u2",
      wovenBy: "u1",
      destinationSpaceId: "space1",
    });

    expect(weave.attributionPreserved).toBe(true);
    expect(weave.gratitudeThread).toBe(true);
  });

  it("creates reflection blossom private by default", () => {
    const event = sendLight({
      actorId: "u1",
      targetId: "m1",
      targetType: "memory",
    });

    const blossom = createReflectionBlossom("u1", [event]);

    expect(blossom.privateByDefault).toBe(true);
    expect(enableReflectionBlossomSharing(blossom).shareable).toBe(true);
  });

  it("creates rank-free reliability mark", () => {
    const event = sendLight({
      actorId: "u1",
      targetId: "m1",
      targetType: "memory",
    });

    const mark = createReliabilityMark("u1", [event]);

    expect(mark.publicRankFree).toBe(true);
    expect(["seed", "branch", "lantern", "constellation"]).toContain(mark.motif);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack08Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.weave.gratitudeThread).toBe(true);
    expect(runtime.blossom.shareable).toBe(true);
    expect(runtime.reliability.publicRankFree).toBe(true);
  });
});
