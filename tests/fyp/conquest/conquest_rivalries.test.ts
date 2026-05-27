import { describe, expect, it } from "vitest";

import {
  createAtmosphereConquest
} from "@/src/core/fyp/conquest/conquestEngine";

import {
  rankConquestStandings
} from "@/src/core/fyp/conquest/standings";

import {
  crownConquestWinner
} from "@/src/core/fyp/conquest/crowning";

import {
  createVoltRivalry
} from "@/src/core/fyp/rivalries/rivalryEngine";

import {
  addArenaViewers,
  createRivalryArena
} from "@/src/core/fyp/rivalries/arena";

import {
  crownVoltWinner
} from "@/src/core/fyp/rivalries/crown";

describe("Lumora FYP Conquest + Rivalries", () => {
  it("creates atmosphere conquest", () => {
    const conquest = createAtmosphereConquest({
      mode: "chaos",
      creatorIds: ["a", "b"],
      startsAt: 100,
      endsAt: 200
    });

    expect(conquest.active).toBe(true);
  });

  it("ranks conquest standings", () => {
    const standings = rankConquestStandings([
      {
        creatorId: "a",
        impactQuotient: 100,
        resonance: 100,
        voltage: 100
      },
      {
        creatorId: "b",
        impactQuotient: 300,
        resonance: 300,
        voltage: 300
      }
    ]);

    expect(standings[0]?.creatorId).toBe("b");
    expect(standings[0]?.rank).toBe(1);
  });

  it("crowns conquest winner", () => {
    const conquest = createAtmosphereConquest({
      mode: "energy",
      creatorIds: ["a", "b"],
      startsAt: 100,
      endsAt: 200
    });

    const winner = crownConquestWinner({
      conquest,
      standings: [
        {
          creatorId: "b",
          impactQuotient: 500,
          resonance: 500,
          voltage: 500,
          rank: 1
        }
      ]
    });

    expect(winner.crowned).toBe(true);
  });

  it("creates rivalry arena", () => {
    const rivalry = createVoltRivalry({
      mode: "chaos",
      creatorA: "creator_1",
      creatorB: "creator_2"
    });

    const arena = createRivalryArena(rivalry);

    const updated = addArenaViewers({
      arena,
      viewers: 120
    });

    expect(updated.viewers).toBe(120);
  });

  it("crowns volt winner", () => {
    const rivalry = createVoltRivalry({
      mode: "energy",
      creatorA: "creator_1",
      creatorB: "creator_2"
    });

    const crown = crownVoltWinner({
      rivalry,
      winnerId: "creator_1"
    });

    expect(crown.title).toBe("Volt Crown");
    expect(crown.durationHours).toBe(72);
  });
});
