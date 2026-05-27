import { describe, expect, it } from "vitest";

import {
  createCreatorDraftWindow
} from "@/src/core/fyp/draft/draftWindow";

import {
  createDraftCandidate,
  rankDraftCandidates
} from "@/src/core/fyp/draft/candidates";

import {
  createConstellation
} from "@/src/core/fyp/constellations/constellationEngine";

import {
  assignConstellationRole
} from "@/src/core/fyp/constellations/roles";

import {
  createDraftSelection
} from "@/src/core/fyp/draft/selections";

describe("Lumora FYP Creator Draft + Constellations", () => {
  it("creates creator draft window", () => {
    const draft = createCreatorDraftWindow({
      opensAt: 100,
      closesAt: 200
    });

    expect(draft.active).toBe(true);
    expect(draft.maxSelections).toBe(100);
  });

  it("creates eligible draft candidate", () => {
    const candidate = createDraftCandidate({
      creatorId: "creator_1",
      auraTier: "spark",
      impactQuotient: 500
    });

    expect(candidate.eligible).toBe(true);
  });

  it("ranks draft candidates", () => {
    const ranked = rankDraftCandidates([
      createDraftCandidate({
        creatorId: "creator_low",
        auraTier: "spark",
        impactQuotient: 100
      }),
      createDraftCandidate({
        creatorId: "creator_high",
        auraTier: "surge",
        impactQuotient: 900
      })
    ]);

    expect(ranked[0]?.creatorId).toBe("creator_high");
  });

  it("creates constellation", () => {
    const constellation = createConstellation({
      title: "Night Architects",
      scoutId: "scout_1",
      creatorIds: ["creator_1", "creator_2"]
    });

    expect(constellation.active).toBe(true);
    expect(constellation.creatorIds.length).toBe(2);
  });

  it("assigns constellation role and draft selection", () => {
    const role = assignConstellationRole({
      creatorId: "creator_1",
      role: "myth-builder",
      joinedAt: 100
    });

    const selection = createDraftSelection({
      scoutId: "scout_1",
      creatorId: "creator_1",
      constellationId: "constellation_1"
    });

    expect(role.role).toBe("myth-builder");
    expect(selection.approved).toBe(true);
  });
});
