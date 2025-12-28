import { describe, it, expect } from "vitest";
import { httpGetRetryOnce } from "../_util/http";

function getBase(): string {
  const b =
    process.env.BASE ||
    process.env.npm_package_config_base ||
    process.env.npm_config_base ||
    "http://127.0.0.1:3000";
  return String(b).replace(/\/+$/, "");
}



const base = process.env.LIVE_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;

async function warm(path: string) {
  // First hit can trigger Next compilation; allow long and retry once.
  const r = await httpGetRetryOnce(`${base}${path}`, 25000);
  if (r.status !== 200) {
    const head = (r.bodyText || "").slice(0, 420);
    throw new Error(`warm(${path}) expected 200, got ${r.status}. bodyHead=${JSON.stringify(head)}`);
  }
  return r;
}

async function fast(path: string) {
  // After warm, should be fast.
  const r = await httpGetRetryOnce(`${base}${path}`, 4000);
  return r;
}

describe("Live page: /live/health", () => {
  it(
    "healthz probe is warmable and then fast, returns marker",
    async () => {
      await warm("/api/live/portal-hubs"); // ensure server is up and middleware compiled
      const w = await warm("/live/healthz");
      expect(w.bodyText || "").toContain("STEP108_HEALTHZ");

      const f = await fast("/live/healthz");
      expect(f.status).toBe(200);
      expect(f.bodyText || "").toContain("STEP108_HEALTHZ");
    },
    35000
  );

  it(
    "health page is warmable and then fast, returns marker/title",
    async () => {
      await warm("/api/live/portal-hubs");
      const w = await warm("/live/health");
      expect(w.bodyText || "").toContain("STEP108_HEALTH_HTML");
      expect(w.bodyText || "").toMatch(/Live\s*—\s*Health/);

      const f = await fast("/live/health");
      expect(f.status).toBe(200);
      expect(f.bodyText || "").toContain("STEP108_HEALTH_HTML");
    },
    35000
  );
});
