import { describe, expect, it } from "vitest";
import { calculateTQ } from "@/core/trust/runtime";

describe("trust runtime", () => {
  it("calculates tq", () => {
    expect(
      calculateTQ({
        pledge: 100,
        retention: 80,
      })
    ).toBe(90);
  });
});
