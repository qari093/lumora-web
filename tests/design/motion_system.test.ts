import { describe, expect, it } from "vitest";
import { transitionState } from "@/src/design/motion/transitionState";

describe("motion system", () => {
  it("maintains smooth transitions", () => {
    expect(transitionState().smooth).toBe(true);
  });
});
