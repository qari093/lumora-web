import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/video-ingestion/runtime/fyp-smoke/route";

describe("Video Ingestion — FYP Runtime Smoke Route", () => {
  it("returns a ready validation bridge", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.runtimeReady).toBe(true);
    expect(json.poolSize).toBe(40);
    expect(json.summary.ready).toBe(true);
    expect(json.certification.ready).toBe(true);
  });
});
