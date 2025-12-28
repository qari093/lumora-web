import { describe, it, expect } from "vitest";
import http from "http";
import https from "https";
import { URL } from "url";

function getJSON(urlStr: string, timeoutMs = 8000): Promise<{ status: number; json: any }> {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === "https:" ? https : http;

    const req = lib.request(
      {
        method: "GET",
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        headers: { "accept": "application/json" },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(Buffer.from(c)));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let json: any = null;
          try { json = raw ? JSON.parse(raw) : null; } catch { /* noop */ }
          resolve({ status: res.statusCode || 0, json });
        });
      }
    );

    req.on("error", reject);
    req.setTimeout(timeoutMs, () => req.destroy(new Error("timeout")));
    req.end();
  });
}

describe("Persona manifest: /api/persona/manifest", () => {
  it("returns ok:true and emojis array (seeded should be >=1)", async () => {
    const base = process.env.BASE || "http://127.0.0.1:3000";
    const url = `${base}/api/persona/manifest`;
    const r = await getJSON(url, 12000);

    expect(r.status).toBe(200);
    expect(r.json).toBeTruthy();
    expect(r.json.ok).toBe(true);
    expect(Array.isArray(r.json.emojis)).toBe(true);

    // With Step 23 seed assets, this should be non-empty when the app serves /public.
    expect(r.json.emojis.length).toBeGreaterThan(0);
    expect(r.json.emojis[0]).toHaveProperty("id");
    expect(r.json.emojis[0]).toHaveProperty("url");
  });
});
