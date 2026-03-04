import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../../app/api/vibe/apply/route";

function mkReq(body: any) {
  const r = new Request("http://localhost/api/vibe/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return new NextRequest(r);
}

async function j(res: Response) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return { raw: txt }; }
}

describe("Vibe Tags Lite: apply route (in-process)", () => {
  beforeAll(() => {
    process.env.VIBE_TAGS_LITE = "1";
  });

  it("rejects when watchMs < 5000", async () => {
    const res = await POST(mkReq({ userId: "u1", videoId: "v1", vibeSlug: "wholesome", watchMs: 1200 }));
    expect(res.status).toBe(400);
    const json = await j(res);
    expect(json.error).toBe("watch_gate_5s");
  });

  it("accepts valid apply OR duplicate_vibe (idempotent)", async () => {
    const res = await POST(mkReq({ userId: "u1", videoId: "v1", vibeSlug: "wholesome", watchMs: 7000 }));
    expect([200, 409]).toContain(res.status);
    const json = await j(res);
    if (res.status === 200) expect(json.ok).toBe(true);
    if (res.status === 409) expect(json.error).toBe("duplicate_vibe");
  });

  it("enforces max 3 tags per user per video", async () => {
    const base = { userId: "u2", videoId: "v2", watchMs: 8000 };
    await POST(mkReq({ ...base, vibeSlug: "wholesome" }));
    await POST(mkReq({ ...base, vibeSlug: "vibing" }));
    await POST(mkReq({ ...base, vibeSlug: "thats-deep" }));
    const res4 = await POST(mkReq({ ...base, vibeSlug: "respect" }));
    expect([429, 409]).toContain(res4.status);
    const json4 = await j(res4);
    if (res4.status === 429) expect(json4.error).toBe("max_tags_per_video");
  });
});
