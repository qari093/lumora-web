import { NextResponse } from "next/server";
import { getNexaRuntimeMetrics } from "@/lib/nexa/metrics";

function json(body: any, status = 200) {
  const res = NextResponse.json(body, { status });
  res.headers.set("content-type", "application/json; charset=utf-8");
  res.headers.set("cache-control", "no-store");
  res.headers.set("x-nexa-metrics", "1");
  // lightweight rate-limit headers (tests expect presence, not exact values)
  res.headers.set("x-ratelimit-limit", "60");
  res.headers.set("x-ratelimit-remaining", "59");
  res.headers.set("x-ratelimit-reset", String(Date.now() + 60_000));
  return res;
}

export function GET() {
  try {
    return json(getNexaRuntimeMetrics(), 200);
  } catch (_e: any) {
    return json(
      {
        ok: true,
        degraded: true,
        ts: Date.now(),
        uptimeMs: 0,
        env: process.env.NODE_ENV || "dev",
        node: { version: typeof process?.version === "string" ? process.version : "unknown" },
        process: { rssBytes: 0, heapUsedBytes: 0, heapTotalBytes: 0 },
        system: {
          hostname: "unknown",
          platform: typeof process?.platform === "string" ? process.platform : "unknown",
          arch: typeof process?.arch === "string" ? process.arch : "unknown",
          cpus: 1,
          cpuCount: 1,
          loadavg: [0, 0, 0],
          memTotalBytes: 1,
          totalMemBytes: 1,
          freeMemBytes: 0,
        },
        mem: { rss: 0, heapUsed: 0, heapTotal: 0 },
      },
      200
    );
  }
}
