import { describe, expect, it } from "vitest";
import { memorySystems, saveMoment } from "../../src/echo/memory/memoryMoments";
import { createMemoryTrail } from "../../src/echo/memory/memoryTrails";
import { generateEmotionalPostcard } from "../../src/echo/memory/postcards";
import { emotionalArchive } from "../../src/echo/memory/archive";

describe("Echo Pack 07 — Memory Systems", () => {
  it("supports memory systems", () => {
    expect(memorySystems).toContain("memory-trails");
  });

  it("supports saved moments", () => {
    expect(saveMoment().saved).toBe(true);
  });

  it("supports trails and postcards", () => {
    expect(createMemoryTrail().connected).toBe(true);
    expect(generateEmotionalPostcard().qr).toBe(true);
    expect(emotionalArchive().searchable).toBe(true);
  });
});
