import { describe, expect, it } from "vitest";
import { emotionalLighting } from "@/src/design/lighting/emotionalLighting";

describe("design language", () => {
  it("supports adaptive lighting", () => {
    expect(emotionalLighting.adaptive).toBe(true);
  });
});
