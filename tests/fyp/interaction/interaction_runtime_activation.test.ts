import { describe, expect, it } from "vitest";

import {
  validateInteractionEvent
} from "@/src/core/fyp/interaction/contracts/interactionContract";

import {
  scoreInteraction
} from "@/src/core/fyp/interaction/runtime/interactionScorer";

import {
  runInteractionRuntime
} from "@/src/core/fyp/interaction/runtime/interactionRuntime";

const event = {
  id: "interaction_001",
  itemId: "video_001",
  type: "share" as const,
  strength: 4
};

describe("Lumora FYP Interaction Runtime Activation", () => {
  it("validates interaction event", () => {
    expect(validateInteractionEvent(event)).toBe(true);
  });

  it("scores interaction", () => {
    const result = scoreInteraction(event);

    expect(result.score).toBe(20);
  });

  it("detects strong interest", () => {
    const result = scoreInteraction(event);

    expect(result.intent).toBe("strong_interest");
  });

  it("rejects invalid interaction", () => {
    expect(() =>
      scoreInteraction({
        ...event,
        strength: -1
      })
    ).toThrow("invalid_interaction_event");
  });

  it("runs interaction runtime", () => {
    const results = runInteractionRuntime([
      {
        ...event,
        id: "interaction_002",
        type: "tap",
        strength: 1
      },
      event
    ]);

    expect(results).toHaveLength(2);
    expect(results[0].itemId).toBe("video_001");
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });
});
