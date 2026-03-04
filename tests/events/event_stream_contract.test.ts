import { describe, it, expect } from "vitest";
import { EVENT_STREAM_POLICY, parseEventStreamInput, computeHooks } from "@/lib/events/contract";

describe("event stream contract", () => {
  it("policy pins signed url ttl to 3600", () => {
    expect(EVENT_STREAM_POLICY.signedUrlMaxTtlSec).toBe(3600);
  });

  it("parses valid input", () => {
    const r = parseEventStreamInput({
      type: "ingest.requested",
      contentType: "ugc",
      contentId: "u1_v1",
      actorId: "user_1",
      ts: Date.now(),
      payload: { k: "v" },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.contentType).toBe("ugc");
      expect(r.data.type).toBe("ingest.requested");
    }
  });

  it("rejects invalid contentType", () => {
    const r = parseEventStreamInput({ type: "ingest.requested", contentType: "movie", contentId: "x" } as any);
    expect(r.ok).toBe(false);
  });

  it("computes stable hooks with prefix", () => {
    const hooks = computeHooks({ baseUrl: "https://lumora.app/", contentType: "trailer", contentId: "t-1" }, { routePrefix: "/api/events/hooks" });
    expect(hooks.length).toBe(2);
    expect(hooks[0].url).toContain("/api/events/hooks/trailer/t-1/ingest");
  });
});
