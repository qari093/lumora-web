import { describe, it, expect } from "vitest";

import {
  FYP_EMOTIONAL_LANES
} from "../../../src/core/fyp/lanes/laneRegistry";

import {
  classifyLane
} from "../../../src/core/fyp/lanes/laneClassifier";

import {
  isValidLane
} from "../../../src/core/fyp/lanes/laneValidation";

describe("FYP Omega Pack 07", () => {
  it("contains six canonical lanes", () => {
    expect(FYP_EMOTIONAL_LANES.length).toBe(6);
  });

  it("classifies wonder content", () => {
    expect(
      classifyLane({
        title: "NASA Galaxy Discovery"
      })
    ).toBe("wonder");
  });

  it("classifies learning content", () => {
    expect(
      classifyLane({
        title: "Science Tutorial"
      })
    ).toBe("learn");
  });

  it("validates legal lanes", () => {
    expect(isValidLane("reflect")).toBe(true);
    expect(isValidLane("unknown")).toBe(false);
  });
});
