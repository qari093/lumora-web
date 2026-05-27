import { describe, it, expect } from "vitest";
import { bladeTransitionReady } from "@/src/core/startup/bladeTransition";

describe("codepack01", () => {
  it("core entry runtime works", () => {
    expect(bladeTransitionReady().enabled).toBe(true);
  });
});
