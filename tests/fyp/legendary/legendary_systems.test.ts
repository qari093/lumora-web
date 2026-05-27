import { describe, expect, it } from "vitest";

import {
  createLegendaryCreator
} from "@/src/core/fyp/legendary/eligibility";

import {
  createLegendaryRelicContract
} from "@/src/core/fyp/contracts/relicContract";

import {
  createMythicRelease
} from "@/src/core/fyp/legendary/mythicRelease";

import {
  createLegendaryBroadcast
} from "@/src/core/fyp/legendary/broadcast";

import {
  archiveLegendaryRelease
} from "@/src/core/fyp/legendary/archives";

describe("Lumora FYP Legendary Systems", () => {
  it("creates eligible legendary creator", () => {
    const creator = createLegendaryCreator({
      creatorId: "creator_1",
      auraTier: "eclipse",
      impactQuotient: 12000
    });

    expect(creator.eligible).toBe(true);
  });

  it("creates legendary relic contract", () => {
    const creator = createLegendaryCreator({
      creatorId: "creator_1",
      auraTier: "nova",
      impactQuotient: 8000
    });

    const contract =
      createLegendaryRelicContract(creator);

    expect(contract.revenueSharePercent).toBe(70);
    expect(contract.active).toBe(true);
  });

  it("creates mythic release", () => {
    const creator = createLegendaryCreator({
      creatorId: "creator_1",
      auraTier: "mythic",
      impactQuotient: 20000
    });

    const contract =
      createLegendaryRelicContract(creator);

    const release = createMythicRelease({
      contract,
      title: "The Neon Collapse"
    });

    expect(release.relicDrop).toBe(true);
  });

  it("creates global legendary broadcast", () => {
    const creator = createLegendaryCreator({
      creatorId: "creator_1",
      auraTier: "eclipse",
      impactQuotient: 14000
    });

    const contract =
      createLegendaryRelicContract(creator);

    const release = createMythicRelease({
      contract,
      title: "Ghost Voltage"
    });

    const broadcast =
      createLegendaryBroadcast(release);

    expect(broadcast.globalPlacement).toBe(true);
    expect(broadcast.reachMultiplier).toBe(5);
  });

  it("archives legendary release", () => {
    const archive = archiveLegendaryRelease({
      creatorId: "creator_legend"
    });

    expect(archive.preserved).toBe(true);
    expect(archive.indexed).toBe(true);
  });
});
