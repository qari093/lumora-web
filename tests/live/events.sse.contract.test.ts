import { describe, it, expect } from "vitest";
import http from "node:http";
import https from "node:https";

function getBase(): string {
  const b =
    process.env.BASE ||
    process.env.npm_package_config_base ||
    process.env.npm_config_base ||
    "http://127.0.0.1:3000";
  return String(b).replace(/\/+$/, "");
}



function httpGetFirstChunk(urlStr: string, timeoutMs: number): Promise<{
  status: number;
  headers: Record<string, string | string[] | undefined>;
  bodyHead: string;
}> {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === "https:" ? https : http;

    const req = lib.request(
      {
        method: "GET",
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || (u.protocol === "https:" ? 443 : 80),
        path: u.pathname + u.search,
        headers: {
          "accept": "text/event-stream",
          "cache-control": "no-cache",
          "connection": "keep-alive",
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        const headers = res.headers as Record<string, string | string[] | undefined>;
        let buf = "";
        let done = false;

        const finish = () => {
          if (done) return;
          done = true;
          try { req.destroy(); } catch {}
          try { res.destroy(); } catch {}
          resolve({ status, headers, bodyHead: buf.slice(0, 600) });
        };

        res.setEncoding("utf8");
        res.on("data", (chunk: string) => {
          buf += chunk;
          // We only need the first event to confirm SSE is alive.
          if (buf.includes("event: connected") || buf.length >= 180) {
            finish();
          }
        });

        res.on("end", finish);
        res.on("error", (e) => {
          if (done) return;
          done = true;
          reject(e);
        });

        setTimeout(() => {
          if (done) return;
          done = true;
          reject(new Error(`timeout waiting for SSE first chunk after ${timeoutMs}ms`));
        }, timeoutMs);
      }
    );

    req.on("error", reject);
    req.end();
  });
}

describe("Live SSE contract: /api/live/events", () => {
  it("returns 200 + text/event-stream and emits connected event quickly", { timeout: 20000 }, async () => {
    const base = getBase();
    const url = `${base}/api/live/events?roomId=demo-room`;

    const r = await httpGetFirstChunk(url, 12000);

    expect(r.status).toBe(200);

    const ct = String(r.headers["content-type"] || "");
    expect(ct.toLowerCase()).toContain("text/event-stream");

    // Allow partial chunk; but must include connected marker.
    expect(r.bodyHead.toLowerCase()).toContain("event: connected");
  });
});
