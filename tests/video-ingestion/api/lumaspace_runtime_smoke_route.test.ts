import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/video-ingestion/runtime/lumaspace-smoke/route";

describe("Video Ingestion — LumaSpace Runtime Smoke Route", () => {
  it("returns memory-ready validation journeys", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.memoryReady).toBe(true);
    expect(json.poolSize).toBe(40);
    expect(json.summary.ready).toBe(true);
  });
});
