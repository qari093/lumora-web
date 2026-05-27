import { describe, expect, it } from "vitest";

import {
  createVibeForgeSession
} from "@/src/core/fyp/vibe-forge/forgeEngine";

import {
  generateCollectiveAura
} from "@/src/core/fyp/vibe-forge/collectiveAura";

import {
  calculateRevenueSplit
} from "@/src/core/fyp/vibe-forge/revenueSplit";

import {
  createCollaborationSync
} from "@/src/core/fyp/collaboration/sync";

import {
  createCollaborativeCapsule
} from "@/src/core/fyp/collaboration/capsule";

import {
  createRemixChain
} from "@/src/core/fyp/collaboration/remix";

describe("Lumora FYP Vibe Forge + Collaboration Engine", () => {
  it("creates vibe forge session", () => {
    const session = createVibeForgeSession({
      title: "Neon Drift Ritual",
      mode: "drift",
      creators: [
        {
          creatorId: "creator_1",
          role: "visual-architect",
          auraTier: "nova"
        },
        {
          creatorId: "creator_2",
          role: "sound-weaver",
          auraTier: "surge"
        }
      ]
    });

    expect(session.active).toBe(true);
    expect(session.creators.length).toBe(2);
  });

  it("generates collective aura", () => {
    const session = createVibeForgeSession({
      title: "Chaos Bloom",
      mode: "chaos",
      creators: [
        {
          creatorId: "creator_1",
          role: "pulse-designer",
          auraTier: "nova"
        },
        {
          creatorId: "creator_2",
          role: "myth-narrator",
          auraTier: "eclipse"
        }
      ]
    });

    const aura = generateCollectiveAura(session);

    expect(aura.synchronized).toBe(true);
  });

  it("calculates revenue split", () => {
    const split = calculateRevenueSplit({
      creatorIds: [
        "creator_1",
        "creator_2",
        "creator_3",
        "creator_4"
      ]
    });

    expect(split.length).toBe(4);
    expect(split[0]?.percentage).toBe(25);
  });

  it("creates collaboration sync and capsule", () => {
    const sync = createCollaborationSync({
      forgeId: "forge_1",
      syncedCreators: 5
    });

    const capsule = createCollaborativeCapsule({
      forgeId: "forge_1",
      contributorCount: 5
    });

    expect(sync.synchronized).toBe(true);
    expect(capsule.preserved).toBe(true);
  });

  it("creates remix chain", () => {
    const remix = createRemixChain({
      sourceContentId: "content_1",
      remixerId: "creator_x"
    });

    expect(remix.active).toBe(true);
  });
});
