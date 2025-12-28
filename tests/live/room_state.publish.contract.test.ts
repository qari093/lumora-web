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



async function httpJson(method: string, url: string, body?: any): Promise<{ status: number; json: any }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        method,
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        headers: {
          "content-type": "application/json",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (d) => chunks.push(Buffer.from(d)));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let parsed: any = null;
          try {
            parsed = raw ? JSON.parse(raw) : null;
          } catch {
            parsed = { _raw: raw };
          }
          resolve({ status: res.statusCode || 0, json: parsed });
        });
      }
    );
    req.on("error", reject);
    if (body !== undefined) req.write(JSON.stringify(body));
    req.end();
  });
}

describe("Live room-state publish contract", () => {
  test("POST /api/live/publish updates GET /api/live/room-state timestamps", async () => {
    const base = getBase();
    const roomId = "demo-room";

    const before = await httpJson("GET", `${base}/api/live/room-state?roomId=${encodeURIComponent(roomId)}`);
    expect(before.status).toBe(200);
    expect(before.json.ok).toBe(true);

    const pub = await httpJson("POST", `${base}/api/live/publish`, { roomId, kind: "event", payload: { hello: "world" } });
    expect(pub.status).toBe(200);
    expect(pub.json.ok).toBe(true);

    const after = await httpJson("GET", `${base}/api/live/room-state?roomId=${encodeURIComponent(roomId)}`);
    expect(after.status).toBe(200);
    expect(after.json.ok).toBe(true);

    // lastEventAt should now be set and be ISO-like
    expect(typeof after.json.lastEventAt === "string" || after.json.lastEventAt === null).toBe(true);
    expect(String(after.json.lastEventAt || "")).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
}, 30000);