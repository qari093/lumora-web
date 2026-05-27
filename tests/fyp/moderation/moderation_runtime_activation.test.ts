import { describe, expect, it } from "vitest";

import { validateModerationItem } from "@/src/core/fyp/moderation/contracts/moderationContract";
import { evaluateModeration } from "@/src/core/fyp/moderation/runtime/moderationRules";
import { createModerationQueue } from "@/src/core/fyp/moderation/runtime/moderationQueue";
import { createModerationRuntime } from "@/src/core/fyp/moderation/runtime/moderationRuntime";

const safeItem = {
  itemId: "item_1",
  text: "safe cinematic teaser",
  tags: ["cinema"],
  userReports: 0
};

describe("Lumora FYP Moderation Runtime Activation", () => {
  it("validates moderation item", () => {
    expect(
      validateModerationItem(safeItem)
    ).toBe(true);
  });

  it("approves safe content", () => {
    const decision =
      evaluateModeration(safeItem);

    expect(decision.state).toBe("approved");
  });

  it("blocks prohibited content", () => {
    const decision =
      evaluateModeration({
        ...safeItem,
        text: "violent kill scene"
      });

    expect(decision.state).toBe("blocked");
  });

  it("queues moderation decisions", () => {
    const queue =
      createModerationQueue();

    queue.push({
      itemId: "x",
      state: "review",
      reasons: ["high_report_volume"]
    });

    expect(queue.size()).toBe(1);
    expect(queue.flush()).toHaveLength(1);
  });

  it("runs moderation runtime", () => {
    const runtime =
      createModerationRuntime();

    const result =
      runtime.process(safeItem);

    expect(result.state).toBe("approved");
    expect(runtime.flush()).toHaveLength(1);
  });
});
