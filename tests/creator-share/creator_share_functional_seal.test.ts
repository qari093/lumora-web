import { describe, expect, it } from "vitest";
import { creatorShareFunctionalSeal } from "../../src/core/seals/creator-share-functional-seal";

describe("Creator + Share Functional Seal", () => {
  it("confirms all functional packs are sealed", () => {
    expect(creatorShareFunctionalSeal.sealed).toBe(true);
    expect(creatorShareFunctionalSeal.database).toBe(true);
    expect(creatorShareFunctionalSeal.api).toBe(true);
    expect(creatorShareFunctionalSeal.memory).toBe(true);
  });
});
