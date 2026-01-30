import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/config/features", () => ({
  features: { videoGenUserEnabled: true },
}));

import { generateVideo } from "@/services/video-gen/engine";
import { resetStoreForTests } from "@/services/video-gen/store";

import { GET as StatusGET } from "@/app/api/video-gen/status/route";
import { NextRequest } from "next/server";

function makeReq(url: string) {
  return new NextRequest(url);
}

describe("video-gen engine + status", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("creates job and returns jobId", async () => {
    const res = await generateVideo({ prompt: "make a calm scene", durationSec: 5, aspect: "9:16" });
    expect(res.ok).toBe(true);
    expect(typeof res.jobId).toBe("string");
    expect(res.jobId).toMatch(/^vid_/);
  });

  it("rejects invalid prompt", async () => {
    const res = await generateVideo({ prompt: " ", durationSec: 5, aspect: "9:16" });
    expect(res.ok).toBe(false);
    expect(res.error).toBe("invalid_prompt");
  });

  it("status endpoint returns done job", async () => {
    const created = await generateVideo({ prompt: "a neon city", durationSec: 7, aspect: "16:9" });
    expect(created.ok).toBe(true);
    const jobId = created.jobId!;

    const resp = await StatusGET(makeReq(`http://localhost/api/video-gen/status?jobId=${encodeURIComponent(jobId)}`));
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(json.ok).toBe(true);
    expect(json.job.jobId).toBe(jobId);
    expect(json.job.status).toBe("done");
    expect(json.job.resultUrl).toContain(jobId);
  });

  it("status endpoint returns 404 for unknown job", async () => {
    const resp = await StatusGET(makeReq(`http://localhost/api/video-gen/status?jobId=vid_missing`));
    expect(resp.status).toBe(404);
    const json = await resp.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("not_found");
  });

  it("status endpoint requires jobId", async () => {
    const resp = await StatusGET(makeReq(`http://localhost/api/video-gen/status`));
    expect(resp.status).toBe(400);
    const json = await resp.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("jobId_required");
  });
});
