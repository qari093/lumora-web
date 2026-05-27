import { describe, expect, it } from "vitest";
import { createCache } from "../../src/lib/native-fyp/runtime/cache";
import { isExpired } from "../../src/lib/native-fyp/runtime/ttl";
import { evictOldest } from "../../src/lib/native-fyp/runtime/eviction";

describe("native fyp pack 017", () => {
  it("cache set/get", () => {
    const c = createCache<number>();
    c.set("a", 1);
    expect(c.get("a")).toBe(1);
  });

  it("ttl expiry", () => {
    const old = Date.now() - 1000;
    expect(isExpired(old, 500)).toBe(true);
  });

  it("evicts oldest", () => {
    const items = [
      { ts: 1 }, { ts: 2 }, { ts: 3 }, { ts: 4 }
    ];
    const out = evictOldest(items, 2);
    expect(out.length).toBe(2);
  });
});
