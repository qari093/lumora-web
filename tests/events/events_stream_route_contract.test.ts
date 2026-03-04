import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/events/stream/route";

async function readJson(res: Response) {
  const t = await res.text();
  try { return JSON.parse(t); } catch { return { raw: t }; }
}

describe("/api/events/stream route (contract)", () => {
  it("accepts ugc event and returns hooks + ttl clamp", async () => {
    const req = new Request("http://localhost:3000/api/events/stream", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "ingest.requested",
        contentType: "ugc",
        contentId: "u1/v1",
        payload: { ttlSec: 999999, any: "x" }
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const j = await readJson(res);
    expect(j.ok).toBe(true);
    expect(j.policy.signedUrlMaxTtlSec).toBe(3600);
    expect(j.policy.ttlSec).toBe(3600);
    expect(Array.isArray(j.hooks)).toBe(true);
    expect(j.hooks.length).toBe(2);
    expect(String(j.hooks[0].url)).toContain("/api/events/hooks/ugc/");
  });

  it("rejects invalid contentType", async () => {
    const req = new Request("http://localhost:3000/api/events/stream", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "ingest.requested", contentType: "movie", contentId: "x" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const j = await readJson(res);
    expect(j.ok).toBe(false);
    expect(Array.isArray(j.issues)).toBe(true);
  });
});
