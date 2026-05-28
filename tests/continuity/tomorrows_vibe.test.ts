import { describe, expect, it } from "vitest";
import { generateTomorrowsVibe } from "@/lib/continuity/tomorrowsVibe";

describe("tomorrows vibe", () => {
  it("creates vibe", () => {
    expect(generateTomorrowsVibe().length).toBeGreaterThan(5);
  });
});
