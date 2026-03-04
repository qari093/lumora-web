import { NextResponse } from "next/server";
import { computeHooks, parseEventStreamInput, EVENT_STREAM_POLICY } from "@/lib/events/contract";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clampInt(n: number, min: number, max: number) {
  const x = Math.trunc(n);
  return Math.min(max, Math.max(min, x));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = parseEventStreamInput(body);
    if (!parsed.ok) {
      return json({ ok: false, error: parsed.error, issues: parsed.issues, ts: Date.now() }, 400);
    }

    // Signed URL TTL policy hard clamp (if caller includes hint in payload)
    const ttlHint = (parsed.data.payload?.["ttlSec"] as unknown);
    const ttlSec =
      typeof ttlHint === "number" && Number.isFinite(ttlHint)
        ? clampInt(ttlHint, 1, EVENT_STREAM_POLICY.signedUrlMaxTtlSec)
        : EVENT_STREAM_POLICY.signedUrlMaxTtlSec;

    // Construct hooks for downstream workers (R2-only signed URL model)
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const hooks = computeHooks(
      { baseUrl, contentType: parsed.data.contentType, contentId: parsed.data.contentId },
      { routePrefix: "/api/events/hooks" }
    );

    return json(
      {
        ok: true,
        accepted: {
          type: parsed.data.type,
          contentType: parsed.data.contentType,
          contentId: parsed.data.contentId,
          actorId: parsed.data.actorId ?? null,
          ts: parsed.data.ts ?? Date.now(),
        },
        policy: { signedUrlMaxTtlSec: EVENT_STREAM_POLICY.signedUrlMaxTtlSec, ttlSec },
        hooks,
      },
      200
    );
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
