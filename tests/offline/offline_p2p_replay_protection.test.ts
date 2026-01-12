import { describe, it, expect } from "vitest";
import * as P from "../../src/lib/offline/videos";

describe("offline videos: replay protection surface", () => {
  it("exposes an in-memory seen-cache helper (best-effort)", () => {
    const has =
      typeof (P as any).createInMemorySeenCache === "function" ||
      typeof (P as any).createSeenCache === "function" ||
      typeof (P as any).newSeenCache === "function";
    expect(has).toBe(true);
  });

  it("seen cache tracks ids (best-effort)", () => {
    const mk =
      (P as any).createInMemorySeenCache ||
      (P as any).createSeenCache ||
      (P as any).newSeenCache;

    if (typeof mk !== "function") return;
    const cache = mk({ ttlMs: 5000 });

    // Accept a few method shapes from earlier implementations.
    const seen =
      cache?.seen ||
      cache?.has ||
      cache?.isSeen ||
      cache?.check ||
      cache?.markSeen;

    // If only markSeen exists, call twice and expect second to indicate replay.
    if (typeof cache?.markSeen === "function") {
      const a = cache.markSeen("id1");
      const b = cache.markSeen("id1");
      // any truthy/falsey convention accepted as long as second differs
      expect(a).toBe(false);
      expect(b).toBe(true);
      return;
    }

    if (typeof seen === "function") {
      const a = seen.call(cache, "id1");
      const b = seen.call(cache, "id1");
      expect(a).toBe(false);
      expect(b).toBe(true);
      return;
    }

    // If no recognizable method, still fail clearly.
    expect(false).toBe(true);
  });
});
