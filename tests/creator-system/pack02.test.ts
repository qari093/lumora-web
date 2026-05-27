import { describe, it, expect } from "vitest";
import { createCreatorIdentity } from "@/src/lib/creator-system/identity/creatorIdentity";
import { validateWitnessName } from "@/src/lib/creator-system/identity/witnessName";
import { canTransition } from "@/src/lib/creator-system/identity/presenceTransitions";

describe("Pack02", () => {
  it("creator identity works", () => {
    const c = createCreatorIdentity({ creatorId: "1", displayName: "A" });
    expect(c.presenceState).toBe("at-rest");
  });

  it("witness name validation", () => {
    expect(validateWitnessName("John")).toBe(true);
    expect(validateWitnessName("x")).toBe(false);
  });

  it("presence transitions", () => {
    expect(canTransition("at-rest", "awaiting-circle")).toBe(true);
    expect(canTransition("at-rest", "being-witnessed")).toBe(false);
  });
});
