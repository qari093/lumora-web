import { describe, it, expect } from "vitest";
import { decideDrop } from "@/lib/storage/drops";

describe("drops (signed urls only, no public buckets)", () => {
  it("accepts a safe object key and clamps TTL", () => {
    const d = decideDrop({ kind: "ugc", objectKey: "ugc/u1/v1/master.m3u8", ttlSec: 999999 });
    expect(d.ok).toBe(true);
    if (d.ok) {
      expect(d.ttlSec).toBe(3600);
      expect(d.objectKey).toBe("ugc/u1/v1/master.m3u8");
    }
  });

  it("rejects traversal / url-like keys", () => {
    expect(decideDrop({ kind: "ugc", objectKey: "../secret", ttlSec: 60 }).ok).toBe(false);
    expect(decideDrop({ kind: "ugc", objectKey: "https://evil/1", ttlSec: 60 }).ok).toBe(false);
    expect(decideDrop({ kind: "ugc", objectKey: "/abs/path", ttlSec: 60 }).ok).toBe(false);
    expect(decideDrop({ kind: "ugc", objectKey: "k?x=1", ttlSec: 60 }).ok).toBe(false);
  });

  it("rejects bucket public hints", () => {
    const r = decideDrop({ kind: "trailer", objectKey: "trailers/t1/master.m3u8", bucket: "public-cdn" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("bucket_public_hint_rejected");
  });

  it("rejects invalid ttl", () => {
    const r = decideDrop({ kind: "ugc", objectKey: "ugc/u1/v1/master.m3u8", ttlSec: 0 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("ttl_invalid");
  });
});
