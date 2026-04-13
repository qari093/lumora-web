import { describe, expect, it } from "vitest";
import { buildFeedPage, mergeFeedPages } from "../../lib/feed/infiniteScroll";

const items = [
  { id: "a", createdAt: 100 },
  { id: "b", createdAt: 90 },
  { id: "c", createdAt: 80 },
  { id: "d", createdAt: 70 }
];

describe("feed infinite scroll hardening", () => {
  it("builds first page safely", () => {
    const page = buildFeedPage(items, { limit: 2 });
    expect(page.items.map((x) => x.id)).toEqual(["a", "b"]);
    expect(page.nextCursor).toBe("b");
    expect(page.hasMore).toBe(true);
  });

  it("builds next page from cursor", () => {
    const page = buildFeedPage(items, { limit: 2, cursor: "b" });
    expect(page.items.map((x) => x.id)).toEqual(["c", "d"]);
    expect(page.nextCursor).toBeNull();
    expect(page.hasMore).toBe(false);
  });

  it("falls back safely for unknown cursor", () => {
    const page = buildFeedPage(items, { limit: 2, cursor: "unknown" });
    expect(page.items.map((x) => x.id)).toEqual(["a", "b"]);
  });

  it("deduplicates merged pages", () => {
    const merged = mergeFeedPages(
      [{ id: "a", createdAt: 100 }, { id: "b", createdAt: 90 }],
      [{ id: "b", createdAt: 90 }, { id: "c", createdAt: 80 }]
    );
    expect(merged.map((x) => x.id)).toEqual(["a", "b", "c"]);
  });
});
