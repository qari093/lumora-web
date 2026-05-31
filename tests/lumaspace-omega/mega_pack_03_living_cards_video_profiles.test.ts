import { describe, expect, it } from "vitest";
import { createVideoProfile, canShowVideoProfile, disableVideoProfile } from "@/src/core/lumaspace/omega/living-card/videoProfile";
import { createLivingCard, addLivingCardAsset, enableLivingCardSharing, setLivingCardMode } from "@/src/core/lumaspace/omega/living-card/livingCardEngine";
import { composeLivingCard } from "@/src/core/lumaspace/omega/living-card/compositionEngine";
import { evolveLivingCard } from "@/src/core/lumaspace/omega/living-card/evolutionEngine";
import { createLivingCardSharePayload } from "@/src/core/lumaspace/omega/living-card/shareEngine";
import { runLumaSpaceOmegaMegaPack03Runtime } from "@/src/core/lumaspace/omega/living-card/omegaPack03Runtime";

describe("LumaSpace Ω∞ Mega Pack 03 — Living Cards + Video Profiles", () => {
  it("creates optional video profile with consent", () => {
    const profile = createVideoProfile({
      ownerId: "c1",
      durationSeconds: 10,
      consentGranted: true,
      safeForDiscovery: true,
    });

    expect(profile.maxDurationSeconds).toBe(15);
    expect(canShowVideoProfile(profile)).toBe(true);
    expect(canShowVideoProfile(disableVideoProfile(profile))).toBe(false);
  });

  it("creates living card identity", () => {
    const card = createLivingCard({
      ownerId: "c2",
      title: "Builder Space",
      openingVerse: "Quietly becoming",
      tone: "builder",
    });

    expect(card.mode).toBe("living_card");
    expect(card.privacy).toBe("inner_circle");
    expect(card.version).toBe(1);
  });

  it("adds assets and sorts by emotional weight", () => {
    let card = createLivingCard({
      ownerId: "c3",
      title: "Memory Space",
      openingVerse: "Memory over noise",
    });

    card = addLivingCardAsset(card, { id: "low", kind: "aura", label: "Low", weight: 10 });
    card = addLivingCardAsset(card, { id: "high", kind: "memory", label: "High", weight: 90 });

    expect(card.assets[0].id).toBe("high");
    expect(card.version).toBe(3);
  });

  it("switches profile modes and enables sharing", () => {
    let card = createLivingCard({
      ownerId: "c4",
      title: "Video Space",
      openingVerse: "Light travels",
    });

    card = setLivingCardMode(card, "video");
    card = enableLivingCardSharing(card);

    expect(card.mode).toBe("video");
    expect(card.shareable).toBe(true);
    expect(card.privacy).toBe("public");
  });

  it("composes living card from assets", () => {
    let card = createLivingCard({
      ownerId: "c5",
      title: "Composed Space",
      openingVerse: "Still building",
    });

    card = addLivingCardAsset(card, { id: "m1", kind: "memory", label: "Memory", weight: 70 });
    const composition = composeLivingCard(card);

    expect(composition.layout).toBe("vertical_identity_reel");
    expect(composition.segments.length).toBeGreaterThan(0);
    expect(composition.durationSeconds).toBeGreaterThanOrEqual(5);
  });

  it("evolves living card from milestones", () => {
    const card = createLivingCard({
      ownerId: "c6",
      title: "Evolving Space",
      openingVerse: "Growing by contribution",
    });

    const evolved = evolveLivingCard(card, "mission_completed");

    expect(evolved.assets[0].label).toBe("Mission light tendril");
    expect(evolved.version).toBe(2);
  });

  it("creates safe external share payload", () => {
    let card = createLivingCard({
      ownerId: "c7",
      title: "Shared Space",
      openingVerse: "Come build with me",
    });

    card = enableLivingCardSharing(card);
    const payload = createLivingCardSharePayload(card);

    expect(payload.safeToShare).toBe(true);
    expect(payload.urlPath).toContain("/lumaspace/card/");
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack03Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.video.durationSeconds).toBe(12);
    expect(runtime.card.assets.length).toBeGreaterThanOrEqual(2);
    expect(runtime.share.safeToShare).toBe(true);
  });
});
