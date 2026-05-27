import { describe, expect, it } from "vitest";

import {
  createEmotionalTimeCapsule
} from "@/src/core/fyp/capsules/timeCapsule";

import {
  replayEmotionalTimeCapsule
} from "@/src/core/fyp/capsules/capsuleReplay";

import {
  calculateMemoryAnniversary
} from "@/src/core/fyp/memory/memoryAnniversary";

import {
  reconstructEmotionalEra
} from "@/src/core/fyp/memory/eraReconstruction";

import {
  canShareCapsule,
  createCollaborativeMemorySpace
} from "@/src/core/fyp/memory/sharedMemory";

describe("Lumora FYP Time Capsules + Memory System", () => {
  it("creates emotional time capsule", () => {
    const capsule = createEmotionalTimeCapsule({
      userId: "waqar",
      title: "Winter Drift",
      mode: "drift",
      contentIds: ["clip_1"],
      soundtrackIds: ["track_1"],
      echoImprintIds: ["echo_1"],
      now: 100
    });

    expect(capsule.capsuleId).toBe("capsule_waqar_100");
    expect(capsule.visibility).toBe("private");
  });

  it("replays owned private capsule", () => {
    const capsule = createEmotionalTimeCapsule({
      userId: "waqar",
      title: "Night Drive",
      mode: "deep",
      contentIds: ["clip_1"],
      now: 100
    });

    const replay = replayEmotionalTimeCapsule({
      capsule,
      userId: "waqar",
      now: 200
    });

    expect(replay.reconstructed).toBe(true);
  });

  it("calculates memory anniversary", () => {
    const capsule = createEmotionalTimeCapsule({
      userId: "waqar",
      title: "Seven Day Echo",
      mode: "wonder",
      contentIds: ["clip_1"],
      now: 0
    });

    const anniversary = calculateMemoryAnniversary({
      capsule,
      now: 7 * 24 * 60 * 60 * 1000
    });

    expect(anniversary.eligible).toBe(true);
  });

  it("reconstructs emotional era", () => {
    const capsule = createEmotionalTimeCapsule({
      userId: "waqar",
      title: "Neon Summer",
      mode: "energy",
      contentIds: ["clip_1", "clip_2"],
      soundtrackIds: ["track_1"],
      echoImprintIds: ["echo_1"],
      now: 100
    });

    const era = reconstructEmotionalEra(capsule);

    expect(era.atmosphereComplete).toBe(true);
    expect(era.contentCount).toBe(2);
  });

  it("creates collaborative memory space", () => {
    const capsule = createEmotionalTimeCapsule({
      userId: "waqar",
      title: "Shared Chaos",
      mode: "chaos",
      visibility: "collaborative",
      contentIds: ["clip_1"],
      now: 100
    });

    const space = createCollaborativeMemorySpace({
      capsuleIds: [capsule.capsuleId],
      participantIds: ["waqar", "friend_1"],
      sharedMode: "chaos"
    });

    expect(canShareCapsule(capsule)).toBe(true);
    expect(space.active).toBe(true);
  });
});
