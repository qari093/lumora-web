import { describe, expect, it } from "vitest";
import { estimateInfraCost } from "@/core/costs/runtime";

describe("cost runtime", () => {
  it("estimates infra cost", () => {
    expect(estimateInfraCost(100)).toBe(2);
  });
});
