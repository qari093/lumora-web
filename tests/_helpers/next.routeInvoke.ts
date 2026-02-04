/**
 * In-process invoker for Next.js App Router route handlers.
 * Avoids flaky HTTP + middleware/network timing in CI/local.
 *
 * Supports route modules exporting GET/POST etc that accept NextRequest.
 */
import { NextRequest } from "next/server";

export type InvokeResult = {
  status: number;
  headers: Record<string, string>;
  bodyText: string;
  json: any | null;
};

function toHeadersObj(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => (out[k.toLowerCase()] = v));
  return out;
}

export async function invokeGET(
  mod: { GET?: (req: NextRequest) => Promise<Response> | Response },
  url: string,
  init?: { headers?: Record<string, string> }
): Promise<InvokeResult> {
  if (!mod?.GET) throw new Error("route_missing_GET");
  const req = new NextRequest(url, { headers: init?.headers || {} });
  const res = await mod.GET(req);
  const bodyText = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(bodyText);
  } catch {
    json = null;
  }
  return { status: res.status, headers: toHeadersObj(res.headers), bodyText, json };
}

export function isJsonLike(x: any): boolean {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}
