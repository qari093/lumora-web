import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/video-ingestion/validation-pool/route";

describe("Video Ingestion — Validation Pool API Route", () => {
  it("returns seeded validation media pool contract", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.poolSize).toBe(40);
    expect(json.snapshot.total).toBe(40);
    expect(json.route).toBe("/api/video-ingestion/validation-pool");
    expect(json.next).toBe("fyp_lumaspace_runtime_smoke");
  });
});
