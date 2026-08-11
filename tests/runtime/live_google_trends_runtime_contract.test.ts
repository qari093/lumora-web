import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/live/google-trends/route";

describe("Google Trends live runtime contract", () => {
  it("returns parsed external trend items", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.provider).toBe("google_trends");
    expect(payload.source).toBe("google_trends_rss");
    expect(payload.count).toBeGreaterThan(0);
    expect(payload.items).toHaveLength(payload.count);
    expect(payload.items[0]).toMatchObject({
      id: expect.any(String),
      source: "google_trends",
      title: expect.any(String),
      rank: expect.any(Number)
    });
  });
});
