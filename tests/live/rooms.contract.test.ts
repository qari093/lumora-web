function getBase(): string {
  const b =
    process.env.BASE ||
    process.env.npm_package_config_base ||
    process.env.npm_config_base ||
    "http://127.0.0.1:3000";
  return String(b).replace(/\/+$/, "");
}


// STEP102_ROOMS_CONTRACT_V1
import { describe, expect, it } from "vitest";
import { baseUrl, httpGetRetryOnce } from "../_util/http";

describe("Live API contract: /api/live/rooms", () => {
  it(
    "returns 200 with ratelimit headers and stable envelope",
    async () => {
      const base = baseUrl();

      const r = await httpGetRetryOnce(`${base}/api/live/rooms`, {
        timeoutMs: 8000,
        headers: { "x-request-id": `test_${Date.now()}` },
        retryDelayMs: 160,
      });

      expect(r.status).toBe(200);

      // Ratlimit headers must exist (case-insensitive in util)
      expect(typeof r.headers["x-ratelimit-limit"]).toBe("string");
      expect(typeof r.headers["x-ratelimit-remaining"]).toBe("string");
      expect(typeof r.headers["x-ratelimit-reset"]).toBe("string");

      // Parse body; if Next dev server hiccups and returns empty body but has x-request-id, fail with visibility
      let data: any = {};
      try {
        data = JSON.parse((r.bodyText || "").trim() || "{}");
      } catch (e) {
        throw new Error(`Invalid JSON from /api/live/rooms. status=${r.status} body=${String(r.bodyText).slice(0, 600)}`);
      }

      // Accept requestId either in JSON or via x-request-id header (route guarantees header)
      const hdrRid = (r.headers["x-request-id"] as any) || (r.headers["x-request-id".toLowerCase()] as any);
      if (typeof data.requestId !== "string" && typeof hdrRid === "string" && hdrRid.length > 0) {
        data.requestId = hdrRid;
      }

      if (typeof data.requestId !== "string") {
        throw new Error(
          `Missing requestId in body/header. body=${String(r.bodyText).slice(0, 800)} headers=${JSON.stringify(r.headers)}`
        );
      }

      expect(typeof data.ok).toBe("boolean");
      expect(Array.isArray(data.rooms)).toBe(true);
      expect(typeof data.activeRooms).toBe("number");
      expect(typeof data.ts).toBe("string");
    },
    20000
  );
});
