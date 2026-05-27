import { describe, expect, it } from "vitest";
import { buildMemoryShelfDrawer } from "@/src/lib/creator-system/memory-shelf/memoryShelf";
import { createMemoryShelfEntry } from "@/src/lib/creator-system/memory-shelf/memoryEntry";
import { buildMemoryPhrase } from "@/src/lib/creator-system/memory-shelf/memoryPhrase";
import { orderMemoriesChronologically } from "@/src/lib/creator-system/memory-shelf/orderMemories";
import { getMemoryShelfPresentationPolicy } from "@/src/lib/creator-system/memory-shelf/presentationPolicy";

describe("Pack18 Memory Shelf", () => {
  it("builds memory shelf drawer", () => {
    const shelf = buildMemoryShelfDrawer("c1", true);
    expect(shelf.open).toBe(true);
    expect(shelf.contentLibraryMode).toBe(false);
  });

  it("stores moment-based timeline entries", () => {
    const entry = createMemoryShelfEntry({
      id: "m1",
      creatorId: "c1",
      videoId: "v1",
      circleId: "circle1",
      timestampMs: 6000,
      phrase: "3 held, 1 returned",
      createdAt: "2026-05-02T19:00:00.000Z",
    });

    expect(entry.momentBased).toBe(true);
    expect(entry.phrase).toBe("3 held, 1 returned");
  });

  it("builds memory phrases", () => {
    expect(buildMemoryPhrase({ held: 3, returned: 1 })).toBe("3 held, 1 returned");
    expect(buildMemoryPhrase({ held: 0, returned: 0 })).toBe("A quiet trace remained");
  });

  it("orders memories chronologically", () => {
    const late = createMemoryShelfEntry({
      id: "late",
      creatorId: "c1",
      videoId: "v1",
      circleId: "c2",
      timestampMs: 1,
      phrase: "late",
      createdAt: "2026-05-03T19:00:00.000Z",
    });

    const early = createMemoryShelfEntry({
      id: "early",
      creatorId: "c1",
      videoId: "v1",
      circleId: "c1",
      timestampMs: 1,
      phrase: "early",
      createdAt: "2026-05-01T19:00:00.000Z",
    });

    expect(orderMemoriesChronologically([late, early])[0].id).toBe("early");
  });

  it("avoids content-library presentation", () => {
    const policy = getMemoryShelfPresentationPolicy();
    expect(policy.contentLibraryPresentationAllowed).toBe(false);
    expect(policy.gridRankingAllowed).toBe(false);
    expect(policy.chronologicalMemoryFlow).toBe(true);
  });
});
