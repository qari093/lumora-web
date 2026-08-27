import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/fyp/feed/route";

describe("FYP feed API shape", () => {
  it("returns non-empty normalized runtime items", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.source).toBe("lumora_runtime_chain");
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThanOrEqual(3);

    expect(data.items[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      creator: expect.any(String),
      category: expect.any(String),
    });

    expect(data.items[0].id.length).toBeGreaterThan(0);
    expect(data.items[0].title.length).toBeGreaterThan(0);
    expect(data.items[0].creator.length).toBeGreaterThan(0);
    expect(data.items[0].category.length).toBeGreaterThan(0);
  });
});
