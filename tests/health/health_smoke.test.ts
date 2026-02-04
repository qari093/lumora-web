import { describe, it, expect } from "vitest";

function baseUrl(): string {
  const u = process.env.LUMORA_TEST_BASE_URL;
  return u && typeof u === "string" ? u : "http://127.0.0.1:4173";
}

async function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetries(url: string, tries: number, delayMs: number) {
  let lastErr: any = null;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { method: "GET", headers: { accept: "application/json" } });
      const text = await res.text();
      return { res, text };
    } catch (e) {
      lastErr = e;
      await wait(delayMs);
    }
  }
  throw lastErr || new Error("fetch_failed");
}

describe("health smoke (single HTTP)", () => {
  it(
    "/api/health responds and is json (robust, retry)",
    async () => {
      const { res, text } = await fetchWithRetries(`${baseUrl()}/api/health`, 30, 250);
      expect(res.status).toBe(200);
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
      expect(json && typeof json === "object").toBe(true);
      expect(json.ok).toBe(true);
    },
    120000
  );
});
