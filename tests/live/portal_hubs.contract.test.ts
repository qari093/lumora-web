import { describe, it, expect } from "vitest";

function getBase(): string {
  const b =
    process.env.BASE ||
    process.env.npm_package_config_base ||
    process.env.npm_config_base ||
    "http://127.0.0.1:3000";
  return String(b).replace(/\/+$/, "");
}



import { baseUrl, httpGet, httpGetRetryOnce } from "../_util/http";
const base = process.env.LIVE_BASE_URL || "http://127.0.0.1:3000";

type Hub = {
  id: string;
  title: string;
  slug: string;
  live: boolean;
  order: number;
  icon?: string;
  href?: string;
};





function header(h: any, k: string): string {
  const v = h?.[k.toLowerCase()];
  if (Array.isArray(v)) return String(v[0] ?? "");
  return v == null ? "" : String(v);
}

describe("Live API contract: /api/live/portal-hubs", () => {
  it(
    "returns 200 + ratelimit headers + expected JSON shape",
    async () => {
      const r = await httpGetRetryOnce(`${base}/api/live/portal-hubs`, 8000);

      expect(r.status).toBe(200);
      expect(String((r.headers["x-ratelimit-limit".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();
      expect(String((r.headers["x-ratelimit-remaining".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();
      expect(String((r.headers["x-ratelimit-reset".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();
      expect(String((r.headers["x-request-id".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();

      const data = (JSON.parse(r.bodyText || "{}")) as any;

      expect(typeof data).toBe("object");
      expect(typeof data.requestId).toBe("string");
      expect(typeof data.ok).toBe("boolean");
      expect(Array.isArray(data.hubs)).toBe(true);
      expect(typeof data.count).toBe("number");
      expect(data.count).toBe(data.hubs.length);

      for (const h of data.hubs as Hub[]) {
        expect(typeof h.id).toBe("string");
        expect(typeof h.title).toBe("string");
        expect(typeof h.slug).toBe("string");
        expect(typeof h.live).toBe("boolean");
        expect(typeof h.order).toBe("number");
        if (h.icon !== undefined) expect(typeof h.icon).toBe("string");
        if (h.href !== undefined) expect(typeof h.href).toBe("string");
      }
    },
    { timeout: 20000 }
  );
});
