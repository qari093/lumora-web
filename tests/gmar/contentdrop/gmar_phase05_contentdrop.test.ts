import { describe, it, expect } from "vitest";

import { dlcRegistry } from "../../../src/core/gmar/contentdrop/dlcRegistry";
import { seasonalEvents } from "../../../src/core/gmar/contentdrop/seasonalEvents";
import { questExpansion } from "../../../src/core/gmar/contentdrop/questExpansion";
import { crossGameEvents } from "../../../src/core/gmar/contentdrop/crossGameEvents";
import { liveContentSync } from "../../../src/core/gmar/contentdrop/liveContentSync";

describe("GMAR PHASE 5", () => {
  it("loads dlc registry", () => {
    expect(dlcRegistry().length).toBeGreaterThan(0);
  });

  it("loads seasonal events", () => {
    expect(seasonalEvents().active).toBe(true);
  });

  it("expands quests", () => {
    expect(questExpansion().quests).toBeGreaterThan(50);
  });

  it("supports cross game events", () => {
    expect(crossGameEvents().connected).toBe(true);
  });

  it("syncs live content", () => {
    expect(liveContentSync().synced).toBe(true);
  });
});
