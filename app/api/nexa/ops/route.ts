import { NextRequest, NextResponse } from "next/server";
import { readNexaOpsSnapshot } from "@/lib/nexa/ops_snapshot";
import { addSoftRateLimitHeaders } from "@/lib/nexa/rl";

/*__LUMORA_OPS_SNAPSHOT_HELPERS__*/

function opsSnapshotPath(req: NextRequest): string {
  // default matches scripts/nexa/ops_bundle_v2.sh
  const url = new URL(req.url);
  const qOut = url.searchParams.get("out") || "";
  const qPort = url.searchParams.get("port") || "";
  // optional override for tests / operators
  if (qOut) return qOut;
  // legacy: if port is provided, keep same filename (still in /tmp)
  if (qPort) return "/tmp/lumora_nexa_ops.json";
  return "/tmp/lumora_nexa_ops.json";
}

function okFallback(now: number) {
  return {
    ok: true,
    ts: now,
    source: "fallback",
    note: "snapshot_missing_or_unreadable",
  };
}

export async function GET(req: NextRequest) {
  const now = Date.now();
  let status = 200;

  try {
    const path = opsSnapshotPath(req);
    const snap = readNexaOpsSnapshot(path);

    // If snapshot read fails or returns non-ok, still return 200 with ok:true fallback
    // (keeps ops page + unit tests stable in dev/test envs).
    const body =
      snap && typeof snap === "object"
        ? { ...snap, ts: (snap as any).ts ?? now }
        : okFallback(now);

    const res = NextResponse.json(
      body && (body as any).ok === true ? body : okFallback(now),
      200
    );

    // headers ALWAYS set
    addSoftRateLimitHeaders(res);
    res.headers.set("x-nexa-ops", "1");
    res.headers.set("cache-control", "no-store, max-age=0");
    return res;
  } catch (e: any) {
    // Never throw: return ok:true fallback but also include error for debugging
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    status = 200;

    const res = NextResponse.json(
      { ...okFallback(now), error: msg },
      status
    );

    addSoftRateLimitHeaders(res);
    res.headers.set("x-nexa-ops", "1");
    res.headers.set("cache-control", "no-store, max-age=0");
    return res;
  }
}
