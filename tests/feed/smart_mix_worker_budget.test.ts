import { describe, it, expect } from "vitest";
import { assembleSmartMix, type FeedItem } from "@/lib/feed/smartMix";

describe("smart mix (feed assembly) respects worker cpu budget", () => {
  const items: FeedItem[] = [
    { id: "b", kind: "ugc", score: 1 },
    { id: "a", kind: "trailer", score: 1 },
    { id: "c", kind: "ugc", score: 2 },
  ];

  it("runs on worker under budget and is deterministic", () => {
    const r = assembleSmartMix({ items, expectedCpuMs: 10 });
    expect(r.ok).toBe(true);
    if (r.mode !== "worker") throw new Error("expected worker mode");
    expect(r.items.map(x => x.id)).toEqual(["c", "a", "b"]); // score desc, id asc tie-break
    expect(r.remainingMs).toBeGreaterThanOrEqual(0);
  });

  it("escalates to origin when expected cpu exceeds budget", () => {
    const r = assembleSmartMix({ items, expectedCpuMs: 80 });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("origin");
  });

  it("honors custom budget", () => {
    const r = assembleSmartMix({ items, expectedCpuMs: 40, budgetMs: 45 });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("worker");
  });
});
