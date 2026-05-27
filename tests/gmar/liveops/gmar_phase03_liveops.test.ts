import { describe, it, expect } from "vitest";

import { scheduleEvent } from "../../../src/core/gmar/liveops/eventScheduler";
import { activeSeason } from "../../../src/core/gmar/liveops/seasons";
import { createTournament } from "../../../src/core/gmar/liveops/tournaments";
import { createClan } from "../../../src/core/gmar/clans/clans";
import { crossReward } from "../../../src/core/gmar/liveops/crossRewards";

describe("GMAR PHASE 3", () => {
  it("schedules events", () => {
    expect(scheduleEvent("Omega").scheduled).toBe(true);
  });

  it("loads season", () => {
    expect(activeSeason(5).season).toBe("S5");
  });

  it("creates tournaments", () => {
    expect(createTournament(16).valid).toBe(true);
  });

  it("creates clans", () => {
    expect(createClan("Zen").created).toBe(true);
  });

  it("creates cross rewards", () => {
    expect(crossReward(5).reward).toBe(50);
  });
});
