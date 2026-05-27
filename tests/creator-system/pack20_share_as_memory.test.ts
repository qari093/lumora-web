import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { canShareAsMemory } from "@/src/lib/creator-system/share-memory/creatorOnlyShare";
import { canShareAfterDelay, SHARE_AS_MEMORY_DELAY_MS } from "@/src/lib/creator-system/share-memory/shareDelay";
import { generateExternalMemoryPage } from "@/src/lib/creator-system/share-memory/externalMemoryPage";
import { buildSharedMemoryPresentation } from "@/src/lib/creator-system/share-memory/memoryPresentation";
import { buildExperienceCircleEntryLink } from "@/src/lib/creator-system/share-memory/experienceCircleLink";

describe("Pack20 Share as Memory", () => {
  it("allows creator-only sharing", () => {
    expect(canShareAsMemory({ requesterId: "c1", creatorId: "c1" })).toBe(true);
    expect(canShareAsMemory({ requesterId: "u1", creatorId: "c1" })).toBe(false);
  });

  it("enforces 48-hour delay", () => {
    expect(canShareAfterDelay({ witnessedAtMs: 0, nowMs: SHARE_AS_MEMORY_DELAY_MS })).toBe(true);
    expect(canShareAfterDelay({ witnessedAtMs: 0, nowMs: SHARE_AS_MEMORY_DELAY_MS - 1 })).toBe(false);
  });

  it("generates external memory page model", () => {
    const page = generateExternalMemoryPage({
      memoryId: "m1",
      creatorId: "c1",
      roomMood: "warm",
    });

    expect(page.publicUrl).toBe("/memory/m1");
    expect(page.countsHidden).toBe(true);
    expect(page.commentsHidden).toBe(true);
  });

  it("shows silhouettes and room mood", () => {
    const presentation = buildSharedMemoryPresentation({
      witnessIds: ["w1", "w1", "w2"],
      roomMood: "still",
    });

    expect(presentation.roomMood).toBe("still");
    expect(presentation.silhouettes).toHaveLength(2);
    expect(presentation.profileLinksHidden).toBe(true);
  });

  it("adds experience circle entry link and page", () => {
    expect(buildExperienceCircleEntryLink("m1")).toBe("/creator/first-breath?fromMemory=m1");
    expect(fs.existsSync("app/memory/[memoryId]/page.tsx")).toBe(true);
  });
});
