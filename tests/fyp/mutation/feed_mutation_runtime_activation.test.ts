import { describe, expect, it } from "vitest";

import {
  validateFeedMutation
} from "@/src/core/fyp/mutation/contracts/feedMutationContract";

import {
  applyFeedMutation
} from "@/src/core/fyp/mutation/runtime/feedMutationApplier";

import {
  runFeedMutationRuntime
} from "@/src/core/fyp/mutation/runtime/feedMutationRuntime";

const mutation = {
  id: "mutation_001",
  itemId: "video_001",
  type: "boost" as const,
  weight: 20
};

describe("Lumora FYP Feed Mutation Runtime Activation", () => {
  it("validates feed mutation", () => {
    expect(validateFeedMutation(mutation)).toBe(true);
  });

  it("applies boost mutation", () => {
    const result = applyFeedMutation(50, mutation);

    expect(result.score).toBe(70);
    expect(result.removed).toBe(false);
  });

  it("applies suppress mutation", () => {
    const result = applyFeedMutation(50, {
      ...mutation,
      type: "suppress",
      weight: 10
    });

    expect(result.score).toBe(40);
  });

  it("removes item", () => {
    const result = applyFeedMutation(50, {
      ...mutation,
      type: "remove"
    });

    expect(result.removed).toBe(true);
  });

  it("runs feed mutation runtime", () => {
    const results = runFeedMutationRuntime(50, [
      mutation,
      {
        ...mutation,
        id: "mutation_002",
        itemId: "video_002",
        type: "suppress",
        weight: 5
      }
    ]);

    expect(results).toHaveLength(2);
    expect(results[0].itemId).toBe("video_001");
  });
});
