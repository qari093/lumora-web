import { describe, expect, it } from "vitest";
import { localFirstPrivacy } from "../../src/echo/safety/privacy";
import { antiAddictionGuard } from "../../src/echo/safety/antiAddiction";
import { safeContentFilters } from "../../src/echo/safety/contentFilters";
import { emotionalRecoverySystems } from "../../src/echo/safety/recovery";

describe("Echo Pack 12 — Safety + Privacy", () => {
  it("supports local privacy", () => {
    expect(localFirstPrivacy().encrypted).toBe(true);
  });

  it("supports anti-addiction systems", () => {
    expect(antiAddictionGuard().humane).toBe(true);
  });

  it("supports safety and recovery", () => {
    expect(safeContentFilters().active).toBe(true);
    expect(emotionalRecoverySystems().enabled).toBe(true);
  });
});
