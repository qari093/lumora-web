import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/fyp/feed/route";

describe("FYP live feed API runtime chain", () => {
  it("serves runtime-chain feed instead of fallback demo feed", async () => {
    const response = await GET();
    const json = await response.json();

    expect(json.ok).toBe(true);
    expect(json.source).toBe("lumora_runtime_chain");
    expect(json.runtime.megaPacks).toBe("05-07");
    expect(json.count).toBeGreaterThan(0);
    expect(json.items[0].videoUrl).toBeTruthy();
    expect(json.items[0].rankScore).toBeGreaterThanOrEqual(0);
    expect(json.items[0].autoplayEligible).toBe(true);
  });
});
