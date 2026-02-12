import { getBaseUrlFromRequest, getServiceName, getAppVersion, isoNow, jsonResponse } from "@/lib/health/contract";

export const runtime = "nodejs";

async function pingHealthz(baseUrl: string, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/api/healthz`, {
      method: "GET",
      headers: { accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    const latency = Date.now() - start;
    return { ok: res.ok, status: res.status, latency_ms: latency };
  } catch {
    const latency = Date.now() - start;
    return { ok: false, status: 0, latency_ms: latency };
  } finally {
    clearTimeout(t);
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const deep = url.searchParams.get("deep") === "1";

  const baseUrl = getBaseUrlFromRequest(req);
  const timeoutMs = Number(process.env.LUMORA_HEALTH_TIMEOUT_MS || 2000);

  const base = {
    ok: true,
    service: getServiceName(),
    route: "/api/health",
    ts: isoNow(),
    version: getAppVersion(),
    node: process.version,
    env: process.env.NODE_ENV || "development",
  };

  if (!deep) return jsonResponse(base, 200);

  const self = await pingHealthz(baseUrl, timeoutMs);

  const body = {
    ...base,
    deep: true as const,
    base_url: baseUrl,
    timeout_ms: timeoutMs,
    checks: {
      self_healthz: self,
    },
  };

  return jsonResponse(body, 200);
}
