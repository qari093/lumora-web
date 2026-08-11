import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/live/reddit/route";

describe("Live external ingestion contract", () => {
  it("uses the guarded Reddit ingestion provider instead of a static stub", async () => {
    const response = await GET(
      new Request("http://localhost/api/live/reddit?limit=5")
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.provider).toBe("reddit");
    expect(payload.route).toBe("/api/live/reddit");
    expect(payload.live_status).toBe("candidate_live");
    expect(payload.proof_status).toBe("pending");
    expect(payload.count).toBeGreaterThan(0);
    expect(payload.items).toHaveLength(payload.count);
    expect(payload.items.length).toBeLessThanOrEqual(5);
    expect(payload.source).not.toBe("safe_stub");
  });
});
