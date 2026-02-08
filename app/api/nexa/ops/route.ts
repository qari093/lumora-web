import { NextResponse } from "next/server";
import { readNexaOpsSnapshot } from "@/lib/nexa/ops_snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPortFromReq(req: Request): string {
  try {
    const u = new URL(req.url);
    return (u.searchParams.get("port") || "").trim();
  } catch {
    return "";
  }
}

function snapshotPathForPort(port: string): string {
  // default matches scripts/nexa/ops_bundle_v2.sh
  // allow per-port override for multi-port dev, but keep safe under /tmp
  if (port && /^[0-9]{2,5}$/.test(port)) return `/tmp/lumora_nexa_ops_${port}.json`;
  return "/tmp/lumora_nexa_ops.json";
}

function withHeaders(res: NextResponse): NextResponse {
  // Always set these, even on errors
  res.headers.set("x-nexa-ops", "1");
  res.headers.set("cache-control", "no-store, max-age=0");
  return res;
}

export async function GET(req: Request): Promise<NextResponse> {
  const port = getPortFromReq(req);
  const path = snapshotPathForPort(port);

  try {
    // Never throw to the runtime: any failure returns ok:false but 200 for ops visibility
    const data = await readNexaOpsSnapshot(path);
    const res = NextResponse.json(
      { ok: true, ts: Date.now(), source: { path, port: port || null }, data },
      { status: 200 }
    );
    return withHeaders(res);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    const res = NextResponse.json(
      { ok: false, ts: Date.now(), error: msg, source: { path, port: port || null } },
      { status: 200 }
    );
    return withHeaders(res);
  }
}
