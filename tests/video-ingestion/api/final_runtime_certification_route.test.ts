import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/video-ingestion/runtime/final-certification/route";

describe("Video Ingestion — Final Runtime Certification Route", () => {
  it("certifies validation media pool runtime readiness", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.ready).toBe(true);
    expect(json.poolSize).toBe(40);
    expect(json.foundation.passed).toBe(true);
    expect(json.bridgeCertification.ready).toBe(true);
    expect(json.bridgeSummary.ready).toBe(true);
  });
});
