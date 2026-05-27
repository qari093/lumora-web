import { describe, it, expect } from "vitest";
import { isMinimumViableCircle } from "@/src/lib/creator-system/density/minimumViableCircle";
import { mergeCircles } from "@/src/lib/creator-system/density/mergeFallback";
import { preventEmptyRoom } from "@/src/lib/creator-system/density/emptyRoomPrevention";
import { requireHost } from "@/src/lib/creator-system/density/hostFallback";
import { canExpandCircle } from "@/src/lib/creator-system/density/expansionGate";

describe("Pack06 Density Safeguards", () => {
  it("checks minimum viable circle", () => {
    expect(isMinimumViableCircle(["a","b","c"])).toBe(true);
    expect(isMinimumViableCircle(["a"])).toBe(false);
  });

  it("merges circles safely", () => {
    const merged = mergeCircles(["a","b"], ["c","d"], 5);
    expect(merged.length).toBeGreaterThanOrEqual(4);
  });

  it("prevents empty room", () => {
    expect(preventEmptyRoom(["a"])).toBe(true);
    expect(preventEmptyRoom([])).toBe(false);
  });

  it("requires host presence", () => {
    expect(requireHost(["a","b"], "a")).toBe(true);
    expect(requireHost(["a","b"], "x")).toBe(false);
  });

  it("controls expansion gate", () => {
    expect(canExpandCircle(3, 10)).toBe(true);
    expect(canExpandCircle(10, 10)).toBe(false);
  });
});
