import { describe, expect, it } from "vitest";

import {
  createFypFinalReleaseStatus,
  assertFypFinalReleaseStatus
} from "@/src/core/fyp/final/releaseStatus";

describe("Lumora FYP Final Validation + Release Lock", () => {
  it("creates final release status", () => {
    const status = createFypFinalReleaseStatus({
      completedPacks: 32
    });

    expect(status.ready).toBe(true);
    expect(status.productionLocked).toBe(true);
    expect(status.publicBetaCandidate).toBe(true);
  });

  it("asserts final release status", () => {
    const status = createFypFinalReleaseStatus({
      completedPacks: 32
    });

    expect(assertFypFinalReleaseStatus(status)).toBe(true);
  });
});
