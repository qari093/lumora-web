import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/feed/final/route";

describe("final FYP feed runtime chain", () => {
  it("returns real ranked runtime cards instead of placeholder data", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.source).toBe("lumora_runtime_chain");
    expect(payload.count).toBeGreaterThan(1);
    expect(payload.data).toHaveLength(payload.count);
    expect(payload.data[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      playbackUrl: expect.any(String),
      rankScore: expect.any(Number),
      rankReasons: expect.any(Array)
    });
    expect(payload.data).not.toEqual([{ id: 1 }]);

    for (let index = 1; index < payload.data.length; index += 1) {
      expect(payload.data[index - 1].rankScore).toBeGreaterThanOrEqual(
        payload.data[index].rankScore
      );
    }
  });
});
