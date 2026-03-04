import { describe, it, expect } from "vitest";
import {
  mintManifestToken,
  verifyManifestToken,
  signSegmentUrl,
  verifySignedSegmentUrl,
} from "@/lib/video/edge/manifestAuth";

describe("manifest-only auth + signed segments", () => {
  it("mints and verifies a manifest token", () => {
    const now = 1700000000000;
    const out = mintManifestToken({ contentType: "ugc", contentId: "abc12345", variant: "720p", viewerId: "u1", ttlSeconds: 3600, nowMs: now });
    expect(out.ok).toBe(true);
    if (!out.ok) return;

    const v = verifyManifestToken(out.manifestToken, now + 1000);
    expect(v.ok).toBe(true);
    if (!v.ok) return;
    expect(v.claims.cid).toBe("abc12345");
    expect(v.claims.ct).toBe("ugc");
    expect(v.claims.var).toBe("720p");
    expect(v.claims.vid).toBe("u1");
  });

  it("rejects expired manifest tokens", () => {
    const now = 1700000000000;
    const out = mintManifestToken({ contentType: "trailer", contentId: "tr999999", variant: "480p", ttlSeconds: 1, nowMs: now });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    const v = verifyManifestToken(out.manifestToken, now + 2000);
    expect(v.ok).toBe(false);
  });

  it("signs and verifies a segment url", () => {
    const now = 1700000000000;
    const s = signSegmentUrl({ baseUrl: "https://cdn.lumora.app", path: "/video/abc123/720p/seg-00001.m4s", ttlSeconds: 3600, nowMs: now });
    expect(s.url).toContain("exp=");
    expect(s.url).toContain("sig=");
    expect(verifySignedSegmentUrl(s.url, now + 5000).ok).toBe(true);
  });

  it("rejects tampered segment urls", () => {
    const now = 1700000000000;
    const s = signSegmentUrl({ baseUrl: "https://cdn.lumora.app", path: "/video/abc123/720p/seg-00002.m4s", ttlSeconds: 3600, nowMs: now });
    const tampered = s.url.replace("seg-00002.m4s", "seg-99999.m4s");
    expect(verifySignedSegmentUrl(tampered, now + 1).ok).toBe(false);
  });

  it("rejects expired segment urls", () => {
    const now = 1700000000000;
    const s = signSegmentUrl({ baseUrl: "https://cdn.lumora.app", path: "/video/abc123/720p/seg-00003.m4s", ttlSeconds: 1, nowMs: now });
    expect(verifySignedSegmentUrl(s.url, now + 2000).ok).toBe(false);
  });
});
