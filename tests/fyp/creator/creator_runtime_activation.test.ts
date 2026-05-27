import { describe, expect, it } from "vitest";

import { validateCreatorProfile } from "@/src/core/fyp/creator/contracts/creatorContract";
import { createCreatorProfile } from "@/src/core/fyp/creator/runtime/creatorRegistry";
import { calculateCreatorScore } from "@/src/core/fyp/creator/runtime/creatorScore";
import { runCreatorRuntime } from "@/src/core/fyp/creator/runtime/creatorRuntime";

describe(
  "Lumora FYP Creator Runtime Activation",
  () => {
    it("validates creator profile", () => {
      const creator = createCreatorProfile(
        "creator_001",
        "@lumora"
      );

      expect(
        validateCreatorProfile(creator)
      ).toBe(true);
    });

    it("creates creator profile", () => {
      const creator = createCreatorProfile(
        "creator_002",
        "@zen"
      );

      expect(creator.handle).toBe("@zen");
      expect(creator.tier).toBe("seed");
    });

    it("calculates creator score", () => {
      const creator = createCreatorProfile(
        "creator_003",
        "@nova"
      );

      creator.verified = true;

      expect(
        calculateCreatorScore(creator)
      ).toBeGreaterThan(50);
    });

    it("supports elite creator score", () => {
      const creator = createCreatorProfile(
        "creator_004",
        "@atlas"
      );

      creator.tier = "elite";

      expect(
        calculateCreatorScore(creator)
      ).toBeGreaterThanOrEqual(100);
    });

    it("runs creator runtime", () => {
      const creator = createCreatorProfile(
        "creator_005",
        "@echo"
      );

      const runtime = runCreatorRuntime([
        creator
      ]);

      expect(runtime.active).toBe(true);
      expect(runtime.creators).toHaveLength(1);
    });
  }
);
