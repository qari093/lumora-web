import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/fyp/feed/route";

describe("FYP feed API shape", () => {
  it("returns non-empty normalized items", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.source).toBe("fallback");
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThanOrEqual(3);
    expect(data.items[0]).toMatchObject({
      id: "feed-1",
      title: "Lumora Welcome Drop",
      creator: "Lumora",
      category: "Launch",
    });
  });
});
