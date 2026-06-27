import { describe, it, expect } from "vitest";

import {
  EMPTY_FYP_INTERACTION_STATE,
  reduceFypInteraction
} from "../../../src/core/fyp/interactions/interactionReducer";

import {
  getFypInteractionFeedback
} from "../../../src/core/fyp/interactions/interactionFeedback";

describe("FYP Omega Pack 13", () => {
  it("tracks like interactions", () => {
    const state = reduceFypInteraction(
      EMPTY_FYP_INTERACTION_STATE,
      {
        type: "like",
        assetId: "asset_1",
        lane: "wonder",
        ts: Date.now()
      }
    );

    expect(state.likes).toBe(1);
  });

  it("tracks send to space interactions", () => {
    const state = reduceFypInteraction(
      EMPTY_FYP_INTERACTION_STATE,
      {
        type: "send_to_space",
        assetId: "asset_2",
        lane: "connect",
        ts: Date.now()
      }
    );

    expect(state.sendsToSpace).toBe(1);
  });

  it("ignores malformed events", () => {
    const state = reduceFypInteraction(
      EMPTY_FYP_INTERACTION_STATE,
      {
        type: "share",
        assetId: "",
        lane: "wonder",
        ts: Date.now()
      }
    );

    expect(state.shares).toBe(0);
  });

  it("returns stronger feedback for high-intent interactions", () => {
    expect(getFypInteractionFeedback("send_to_space").haptic).toBe("medium");
    expect(getFypInteractionFeedback("like").haptic).toBe("light");
  });
});
