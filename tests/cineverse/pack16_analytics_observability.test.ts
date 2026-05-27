import { describe, expect, it } from "vitest";
import {
  observabilityDomains,
  trackWatchConversion,
  createFypEvent,
  buildHealthSeal,
} from "../../src/cineverse/analytics/runtime";

describe("CineVerse Pack 16 — Analytics + Observability", () => {
  it("tracks observability domains", () => {
    expect(observabilityDomains).toContain("watch-conversion");
  });

  it("calculates watch conversion", () => {
    expect(trackWatchConversion(100, 20)).toBe(0.2);
  });

  it("tracks first-party FYP events", () => {
    const event = createFypEvent({
      teaserId: "t1",
      userId: "u1",
    });

    expect(event.tracked).toBe(true);
    expect(event.firstParty).toBe(true);
  });

  it("builds health seals", () => {
    expect(buildHealthSeal().analytics).toBe("healthy");
  });
});
