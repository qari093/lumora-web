// STEP101_HTTP_UTIL_V1
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";

export type HttpResult = {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  bodyText: string;
};

function normalizeHeaders(h: any): Record<string, string | string[] | undefined> {
  const out: Record<string, string | string[] | undefined> = {};
  if (!h) return out;
  for (const k of Object.keys(h)) out[k.toLowerCase()] = (h as any)[k];
  return out;
}

export async function httpGet(
  url: string,
  opts?: { timeoutMs?: number; headers?: Record<string, string> }
): Promise<HttpResult> {
  const timeoutMs = opts?.timeoutMs ?? 8000;
  const headers = opts?.headers ?? {};
  const u = new URL(url);
  const lib = u.protocol === "https:" ? https : http;

  return await new Promise<HttpResult>((resolve, reject) => {
    const req = lib.request(
      {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: "GET",
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(String(c))));
        res.on("end", () => {
          const bodyText = Buffer.concat(chunks).toString("utf8");
          resolve({
            status: res.statusCode || 0,
            headers: normalizeHeaders(res.headers),
            bodyText,
          });
        });
      }
    );

    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`HTTP GET timeout after ${timeoutMs}ms: ${url}`));
    });
    req.end();
  });
}

export async function httpGetRetryOnce(
  url: string,
  opts?: { timeoutMs?: number; headers?: Record<string, string>; retryDelayMs?: number }
): Promise<HttpResult> {
  const timeoutMs = opts?.timeoutMs ?? 8000;
  const headers = opts?.headers ?? {};
  const retryDelayMs = opts?.retryDelayMs ?? 120;

  try {
    return await httpGet(url, { timeoutMs, headers });
  } catch (_e) {
    await new Promise((r) => setTimeout(r, retryDelayMs));
    return await httpGet(url, { timeoutMs, headers });
  }
}

export function baseUrl(): string {
  const port = process.env.PORT || "3000";
  return process.env.LIVE_BASE_URL || `http://127.0.0.1:${port}`;
}
