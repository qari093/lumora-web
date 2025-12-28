import { describe, expect, test } from "vitest";
import http from "node:http";

function nowMs() { return Date.now(); }
async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
async function pollUntil<T>(fn: () => Promise<T>, pred: (v: T) => boolean, timeoutMs: number, intervalMs = 250): Promise<T> {
  const start = nowMs();
  let last: any;
  while (nowMs() - start < timeoutMs) {
    last = await fn();
    if (pred(last)) return last;
    await sleep(intervalMs);
  }
  return last as T;
}


function getBase(): string {
  const b =
    process.env.BASE ||
    process.env.npm_package_config_base ||
    process.env.npm_config_base ||
    "http://127.0.0.1:3000";
  return String(b).replace(/\/+$/, "");
}



function httpGet(url: string, timeoutMs: number): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(String(c))));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.headers)) {
          if (typeof v === "string") headers[k.toLowerCase()] = v;
          else if (Array.isArray(v)) headers[k.toLowerCase()] = v.join(", ");
        }
        resolve({ status: res.statusCode || 0, headers, body });
      });
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error("timeout"));
    });
  });
}

describe("Live room-state contract: /api/live/room-state", () => {
  test("GET returns 200 + ok:true + roomId", async () => {
    const base = getBase();
    const url = `${base}/api/live/room-state?roomId=demo-room`;
    const r = await httpGet(url, 12000);
    expect(r.status).toBe(200);
    expect(r.body.toLowerCase()).toContain('"ok":true');
    expect(r.body.toLowerCase()).toContain('"roomid":"demo-room"');
  });
});
