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





function header(h: any, k: string): string {
  const v = h?.[k.toLowerCase()];
  if (Array.isArray(v)) return String(v[0] ?? "");
  return v == null ? "" : String(v);
}

describe("Live API contract: /api/live/rooms", () => {
  it(
    "returns 200 + ratelimit headers + stable JSON envelope",
    async () => {
      const r = await httpGetRetryOnce(`${base}/api/live/rooms`, 12000);

      expect(r.status).toBe(200);
      expect(String((r.headers["x-ratelimit-limit".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();
      expect(String((r.headers["x-ratelimit-remaining".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();
      expect(String((r.headers["x-ratelimit-reset".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();
      expect(String((r.headers["x-request-id".replace(/"/g,"").replace(/'/g,"")] ?? ""))).toBeTruthy();

      const data = (JSON.parse(r.bodyText || "{}")) as any;
      expect(typeof data.requestId).toBe("string");
      expect(typeof data.ok).toBe("boolean");
      expect(Array.isArray(data.rooms)).toBe(true);
      expect(typeof data.activeRooms).toBe("number");
      expect(typeof data.ts).toBe("string");
    },
    { timeout: 45000 }
  );

  it(
    "deprecated aliases return 410 quickly (no hangs)",
    async () => {
      const aliases = ["/api/live/room-list", "/api/live/rooms/list", "/api/live/rooms/public"];
      for (const p of aliases) {
        const r = await httpGetRetryOnce(`${base}${p}`, 6000);
        expect(r.status).toBe(410);
        const body = JSON.parse(r.bodyText || "{}");
        const code = body?.error?.code || body?.error?.code || body?.error?.code;
        expect(code).toBe("ROUTE_DEPRECATED");
      }
    },
    { timeout: 45000 }
  );
});
