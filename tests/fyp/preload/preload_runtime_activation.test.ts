import { describe, expect, it } from "vitest";

import {
  validatePreloadCandidate
} from "@/src/core/fyp/preload/contracts/preloadContract";

import {
  evaluatePreloadCandidate
} from "@/src/core/fyp/preload/runtime/preloadPolicy";

import {
  runPreloadRuntime
} from "@/src/core/fyp/preload/runtime/preloadRuntime";

const candidate = {
  id: "video_001",
  src: "/videos/seed.mp4",
  priority: 90,
  estimatedBytes: 8_000_000
};

describe("Lumora FYP Preload Runtime Activation", () => {
  it("validates preload candidate", () => {
    expect(validatePreloadCandidate(candidate)).toBe(true);
  });

  it("approves preload candidate", () => {
    const decision = evaluatePreloadCandidate(candidate);

    expect(decision.preload).toBe(true);
    expect(decision.reason).toBe("preload_approved");
  });

  it("blocks low priority preload", () => {
    const decision = evaluatePreloadCandidate({
      ...candidate,
      priority: 10
    });

    expect(decision.preload).toBe(false);
    expect(decision.reason).toBe("priority_too_low");
  });

  it("blocks oversized preload", () => {
    const decision = evaluatePreloadCandidate({
      ...candidate,
      estimatedBytes: 50_000_000
    });

    expect(decision.preload).toBe(false);
    expect(decision.reason).toBe("asset_too_large");
  });

  it("runs preload runtime", () => {
    const decisions = runPreloadRuntime([candidate]);

    expect(decisions).toHaveLength(1);
    expect(decisions[0].preload).toBe(true);
  });
});
