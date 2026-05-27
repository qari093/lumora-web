import { describe, expect, it } from "vitest";
import { createPhantomCircle, type PhantomCircleMember } from "@/src/lib/creator-system/phantom-circle/phantomCircleModel";
import { canFormPhantomCircle, groupNewcomers } from "@/src/lib/creator-system/phantom-circle/groupNewcomers";
import { buildAnonymousRoom } from "@/src/lib/creator-system/phantom-circle/anonymousWitnessing";
import { isValidWitnessPromptResponse, recordWitnessPromptResponse } from "@/src/lib/creator-system/phantom-circle/witnessPromptResponses";
import { canUnlockPublicCircle, unlockPublicCircle } from "@/src/lib/creator-system/phantom-circle/unlockPublicCircle";

const members: PhantomCircleMember[] = Array.from({ length: 5 }).map((_, index) => ({
  userId: `u${index + 1}`,
  witnessName: `Witness ${index + 1}`,
  joinedAt: "2026-01-01T00:00:00.000Z",
  anonymous: true,
}));

describe("Creator System Pack 04 — Phantom Circle", () => {
  it("creates phantom circle model", () => {
    const circle = createPhantomCircle("pc1");
    expect(circle.status).toBe("forming");
    expect(circle.requiredSignalsToUnlock).toBe(3);
  });

  it("groups 4–6 newcomers", () => {
    expect(canFormPhantomCircle(members)).toBe(true);
    expect(groupNewcomers(members)).toHaveLength(1);
  });

  it("builds anonymous peer witnessing room", () => {
    const room = buildAnonymousRoom(members);
    expect(room).toHaveLength(5);
    expect(room[0].profileHidden).toBe(true);
  });

  it("records valid witness prompt responses", () => {
    expect(isValidWitnessPromptResponse("warm")).toBe(true);
    expect(isValidWitnessPromptResponse("judging")).toBe(false);

    const response = recordWitnessPromptResponse({
      circleId: "pc1",
      userId: "u1",
      response: "curious",
    });

    expect(response.judgmentLanguage).toBe(false);
  });

  it("unlocks public circle after 3 unique signals", () => {
    const circle = createPhantomCircle("pc1");
    const signals = [
      { userId: "u1", type: "present" as const, createdAt: "t" },
      { userId: "u2", type: "hold" as const, createdAt: "t" },
      { userId: "u3", type: "silent-ovation" as const, createdAt: "t" },
    ];

    expect(canUnlockPublicCircle(circle, signals)).toBe(true);
    expect(unlockPublicCircle(circle, signals).status).toBe("unlocked");
  });
});
