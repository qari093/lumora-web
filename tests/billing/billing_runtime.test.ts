import { describe, expect, it } from "vitest";
import {
  calculateCreatorNet,
  calculatePlatformFee,
} from "@/core/billing/runtime";

describe("billing runtime", () => {
  it("calculates fees", () => {
    expect(calculatePlatformFee(1000)).toBe(100);
    expect(calculateCreatorNet(1000)).toBe(900);
  });
});
