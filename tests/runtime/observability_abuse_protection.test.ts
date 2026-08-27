import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import {
  deriveObservabilityClientId,
  enforceObservabilityRateLimit,
  observabilityRateLimitHeaders,
  requestContentLength,
} from "@/src/lib/observability/abuseProtection";

const scope = "mega_step_09_test";

afterEach(async () => {
  await prisma.observabilityRateLimitBucket.deleteMany({
    where: {
      scope,
    },
  });
});

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL?.trim() || "";
const HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(TEST_DATABASE_URL);

if (HAS_SAFE_TEST_DATABASE) {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
}

describe.skipIf(!HAS_SAFE_TEST_DATABASE)("observability abuse protection", () => {
  it("derives a stable non-plaintext client identity", () => {
    const request = new Request(
      "http://localhost/api/telemetry/event",
      {
        headers: {
          "x-forwarded-for": "203.0.113.10",
          "user-agent": "Lumora-Test-Agent",
          "accept-language": "en",
        },
      },
    );

    const first =
      deriveObservabilityClientId(request);
    const second =
      deriveObservabilityClientId(request);

    expect(first).toBe(second);
    expect(first).toHaveLength(32);
    expect(first).not.toContain("203.0.113.10");
    expect(first).not.toContain(
      "Lumora-Test-Agent",
    );
  });

  it("rejects declared payloads above the route limit", async () => {
    const request = new Request(
      "http://localhost/api/errors/report",
      {
        method: "POST",
        headers: {
          "content-length": "4097",
        },
      },
    );

    expect(requestContentLength(request)).toBe(
      4097,
    );

    const result =
      await enforceObservabilityRateLimit(
        request,
        {
          scope,
          limit: 10,
          windowMs: 60_000,
          maxBodyBytes: 4096,
          now: new Date(
            "2026-08-02T08:30:00.000Z",
          ),
        },
      );

    expect(result.allowed).toBe(false);
    expect(result.status).toBe(413);
    expect(result.reason).toBe(
      "payload_too_large",
    );

    const bucketCount =
      await prisma.observabilityRateLimitBucket.count({
        where: { scope },
      });

    expect(bucketCount).toBe(0);
  });

  it("atomically limits requests and returns standard headers", async () => {
    const now = new Date(
      "2026-08-02T08:31:10.000Z",
    );
    const request = new Request(
      "http://localhost/api/telemetry/track",
      {
        method: "POST",
        headers: {
          "x-forwarded-for": "198.51.100.21",
          "user-agent": "Lumora-Rate-Test",
          "content-length": "100",
        },
      },
    );

    const first =
      await enforceObservabilityRateLimit(
        request,
        {
          scope,
          limit: 2,
          windowMs: 60_000,
          maxBodyBytes: 4096,
          now,
        },
      );

    const second =
      await enforceObservabilityRateLimit(
        request,
        {
          scope,
          limit: 2,
          windowMs: 60_000,
          maxBodyBytes: 4096,
          now,
        },
      );

    const third =
      await enforceObservabilityRateLimit(
        request,
        {
          scope,
          limit: 2,
          windowMs: 60_000,
          maxBodyBytes: 4096,
          now,
        },
      );

    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(1);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
    expect(third.allowed).toBe(false);
    expect(third.status).toBe(429);
    expect(third.reason).toBe("rate_limited");

    const headers =
      observabilityRateLimitHeaders(third);

    expect(headers["x-ratelimit-limit"]).toBe(
      "2",
    );
    expect(
      headers["x-ratelimit-remaining"],
    ).toBe("0");
    expect(headers["retry-after"]).toBeTruthy();

    const buckets =
      await prisma.observabilityRateLimitBucket.findMany({
        where: { scope },
      });

    expect(buckets).toHaveLength(1);
    expect(buckets[0]?.count).toBe(3);
  });
});
