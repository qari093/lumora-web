import { describe, it, expect } from "vitest";
import { atmosphere } from "@/src/core/live/runtime/atmosphere";

describe("codepack04", () => {
  it("live runtime works", () => {
    expect(atmosphere.immersive).toBe(true);
  });
});
