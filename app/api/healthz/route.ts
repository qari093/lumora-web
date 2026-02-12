import { getServiceName, getAppVersion, jsonResponse } from "@/lib/health/contract";

export const runtime = "nodejs";

export async function GET(_req: Request) {
  const body = {
    ok: true,
    service: getServiceName(),
    route: "/api/healthz",
    ts: Date.now(), // contract expects number here
    version: getAppVersion(),
  };
  return jsonResponse(body, 200);
}
