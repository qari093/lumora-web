import { describe, it, expect } from "vitest";
import { buildEdgeHeaders } from "@/lib/video/edge/headers";

describe("manifest-only auth (headers + cache contract)", () => {
  it("adds Vary with auth header to prevent cache poisoning", () => {
    const h = buildEdgeHeaders({ mode: "manifest", ttlSec: 3600, tokenHeaderName: "authorization" });
    expect(h.vary.toLowerCase()).toContain("authorization");
    expect(h.vary.toLowerCase()).toContain("accept");
  });

  it("manifest cache-control is private and <= 3600", () => {
    const h = buildEdgeHeaders({ mode: "manifest", ttlSec: 999999 });
    expect(h.cacheControl).toContain("private");
    expect(h.cacheControl).toContain("must-revalidate");
    expect(h.cacheControl).toContain("max-age=3600");
  });

  it("segment cache-control is public and <= 600", () => {
    const h = buildEdgeHeaders({ mode: "segment", ttlSec: 3600 });
    expect(h.cacheControl).toContain("public");
    expect(h.cacheControl).toContain("max-age=600");
    expect(h.cacheControl).toContain("immutable");
  });

  it("deny mode is no-store", () => {
    const h = buildEdgeHeaders({ mode: "deny", ttlSec: 3600 });
    expect(h.cacheControl).toContain("no-store");
  });
});
