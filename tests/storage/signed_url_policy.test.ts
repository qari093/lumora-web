import { describe, it, expect } from "vitest";
import {
  SIGNED_URL_TTL_SECONDS,
  clampSignedUrlTtlSeconds,
  validateSignedUrlPolicy,
} from "@/lib/storage/signedUrlPolicy";

describe("signed url policy", () => {
  it("TTL hard policy is 1 hour", () => {
    expect(SIGNED_URL_TTL_SECONDS).toBe(3600);
  });

  it("clamps TTL to 3600", () => {
    expect(clampSignedUrlTtlSeconds(999999)).toBe(3600);
    expect(clampSignedUrlTtlSeconds(3600)).toBe(3600);
    expect(clampSignedUrlTtlSeconds(3599.9)).toBe(3599);
  });

  it("rejects TTL over max", () => {
    const out = validateSignedUrlPolicy({
      url: "https://cdn.lumora.app/obj?k=1&exp=1700000000",
      ttlSeconds: 7200,
    });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.violations.some(v => v.code === "ttl_too_long")).toBe(true);
  });

  it("rejects public-bucket hints", () => {
    const out = validateSignedUrlPolicy({
      url: "https://mybucket.r2.dev/foo?exp=1700000000",
      ttlSeconds: 60,
    });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.violations.some(v => v.code === "public_bucket_url")).toBe(true);
  });

  it("requires explicit exp params by default", () => {
    const out = validateSignedUrlPolicy({
      url: "https://cdn.lumora.app/foo",
      ttlSeconds: 60,
    });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.violations.some(v => v.code === "missing_exp")).toBe(true);
  });

  it("accepts a compliant URL + TTL", () => {
    const out = validateSignedUrlPolicy({
      url: "https://cdn.lumora.app/foo?exp=1700000000",
      ttlSeconds: 3600,
    });
    expect(out.ok).toBe(true);
  });
});
