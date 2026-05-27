import { describe, it, expect } from "vitest";
import { storeMemoryEntryAfterCircle } from "@/src/lib/integration/memory-shelf-live/storeMemoryEntry";
import { syncEntriesIntoMemoryShelf } from "@/src/lib/integration/memory-shelf-live/syncMemoryShelf";
import { renderMemoriesChronologically } from "@/src/lib/integration/memory-shelf-live/chronologicalRendering";
import { attachMemoryPhrase } from "@/src/lib/integration/memory-shelf-live/attachPhrases";
import { validateMemoryIntegrity } from "@/src/lib/integration/memory-shelf-live/validateMemoryIntegrity";

describe("Pack11 Memory Shelf", () => {
  it("store", () => {
    const e = storeMemoryEntryAfterCircle({
      id: "m1", creatorId: "c1", circleId: "c1", videoId: "v1", timestampMs: 1, phrase: "3 held"
    });
    expect(e.stored).toBe(true);
  });

  it("sync", () => {
    const e = storeMemoryEntryAfterCircle({
      id: "m1", creatorId: "c1", circleId: "c1", videoId: "v1", timestampMs: 1, phrase: "3 held"
    });
    const s = syncEntriesIntoMemoryShelf({ creatorId: "c1", entries: [e] });
    expect(s.entries.length).toBe(1);
  });

  it("order", () => {
    const a = storeMemoryEntryAfterCircle({
      id: "a", creatorId: "c1", circleId: "c1", videoId: "v1", timestampMs: 1, phrase: "a", createdAt: "2026-01-01"
    });
    const b = storeMemoryEntryAfterCircle({
      id: "b", creatorId: "c1", circleId: "c1", videoId: "v1", timestampMs: 1, phrase: "b", createdAt: "2026-01-02"
    });
    expect(renderMemoriesChronologically([b,a])[0].id).toBe("a");
  });

  it("phrase", () => {
    expect(attachMemoryPhrase({ held: 3, returned: 1 })).toBe("3 held, 1 returned");
  });

  it("validate", () => {
    const e = storeMemoryEntryAfterCircle({
      id: "m1", creatorId: "c1", circleId: "c1", videoId: "v1", timestampMs: 1, phrase: "3 held"
    });
    expect(validateMemoryIntegrity(e).ok).toBe(true);
  });
});
