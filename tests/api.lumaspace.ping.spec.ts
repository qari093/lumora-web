import { describe, it, expect } from "vitest";
import { URL as NodeURL } from "node:url";

function baseUrl(): string {
  const candidates = [
    process.env.TEST_BASE_URL,
    process.env.LUMORA_TEST_BASE_URL,
    process.env.LUMORA_BASE_URL,
    process.env.BASE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
  ];

  for (const candidate of candidates) {
    const value = String(candidate ?? "").trim().replace(/\/+$/, "");
    if (!value) continue;

    try {
      const parsed = new NodeURL(value);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString().replace(/\/+$/, "");
      }
    } catch {
      // Ignore malformed environment values and use the local test fallback.
    }
  }

  const rawPort = String(process.env.TEST_PORT || process.env.PORT || "4174").trim();
  const port = /^\d+$/.test(rawPort) ? rawPort : "4174";
  return `http://127.0.0.1:${port}`;
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchTextRobust(path: string, timeoutMs = 8000, tries = 8) {
  const base = baseUrl();
  const url = new NodeURL(path, base).toString();
  let last: any = null;

  for (let i = 0; i < tries; i++) {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      const res = await Promise.race([
        fetch(url, { cache: "no-store" }),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error(`request_timeout:${timeoutMs}ms`)),
            timeoutMs
          );
        }),
      ]);

      const text = await res.text();
      const ct = (res.headers.get("content-type") ?? "").toLowerCase();
      return { res, text, ct, url };
    } catch (e: any) {
      last = e;
      const msg = String(e?.message || e);
      const transient =
        msg.includes("ECONNREFUSED") ||
        msg.includes("fetch failed") ||
        msg.includes("request_timeout:");

      if (!transient) throw e;
      await sleep(180 * (i + 1));
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
  throw last ?? new Error("fetch_failed");
}

function isTruthyPingPayload(obj: any): boolean {
  // Accept multiple existing shapes across Lumora modules.
  // Examples: {ok:true}, {status:"ok"}, {alive:true}, {pong:true}, {ping:"ok"}, {message:"ok"}
  if (!obj || typeof obj !== "object") return false;
  if (obj.ok === true) return true;
  if (obj.alive === true) return true;
  if (obj.pong === true) return true;
  if (typeof obj.status === "string" && obj.status.toLowerCase() === "ok") return true;
  if (typeof obj.ping === "string" && obj.ping.toLowerCase().includes("ok")) return true;
  if (typeof obj.message === "string" && obj.message.toLowerCase().includes("ok")) return true;
  return false;
}

describe("LumaSpace API — ping (integration)", () => {
  it(
    "GET /api/lumaspace/ping responds (200) and indicates liveness",
    async () => {
      const { res, text, ct } = await fetchTextRobust("/api/lumaspace/ping", 8000, 10);
      expect(res.status).toBe(200);

      // Prefer JSON validation if content-type is json or body looks json.
      const looksJson = ct.includes("application/json") || text.trim().startsWith("{") || text.trim().startsWith("[");
      if (looksJson) {
        const obj = JSON.parse(text);
        expect(isTruthyPingPayload(obj)).toBe(true);
      } else {
        // If route returns text, just require it not be empty and contain a liveness keyword.
        const t = text.trim().toLowerCase();
        expect(t.length).toBeGreaterThan(0);
        expect(t.includes("ok") || t.includes("pong") || t.includes("alive")).toBe(true);
      }
    },
    { timeout: 20000 }
  );
});
