import { describe, expect, it } from "vitest";
import { createAetherSubscription, hasEntitlement } from "@/src/core/lumaspace/omega/aether/subscriptionEngine";
import { createDeepMemoryLetter } from "@/src/core/lumaspace/omega/aether/deepMemoryEngine";
import { createConstellationGift } from "@/src/core/lumaspace/omega/aether/giftEngine";
import { runLumaSpaceOmegaMegaPack22Runtime } from "@/src/core/lumaspace/omega/aether/omegaPack22Runtime";

describe("LumaSpace Ω∞ Mega Pack 22 — Aether Pass", () => {
  it("creates subscription entitlements", () => {
    const sub = createAetherSubscription("u1", true);
    expect(hasEntitlement(sub, "constellation_gift")).toBe(true);
  });

  it("creates private deep memory", () => {
    const letter = createDeepMemoryLetter({ citizenId: "u1", sourceMemoryIds: ["m1"], strongestMoment: "a good day" });
    expect(letter.privateByDefault).toBe(true);
    expect(letter.letter).toContain("quiet pride");
  });

  it("creates constellation gift", () => {
    const gift = createConstellationGift({ fromCitizenId: "u1", communityId: "c1", amount: 10 });
    expect(gift.fundsCrystalMission).toBe(true);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack22Runtime().ok).toBe(true);
  });
});
