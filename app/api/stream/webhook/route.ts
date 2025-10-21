import { NextRequest, NextResponse } from "next/server";
import { upsertVideo } from "@/src/lib/stream/store";
import { reqId } from "@/src/lib/reqid";

type CFWebhook = {
  uid?: string;
  status?: { state?: string };
  duration?: number;
  meta?: any;
  // ... other fields ignored for now
};

export async function POST(req: NextRequest) {
  const id = reqId();
  const MAX_S = Number(process.env.STREAM_MAX_SECONDS || "180");
  // If you configured a secret, validate simple shared secret header
  const SECRET = process.env.CF_STREAM_WEBHOOK_SECRET || process.env.STREAM_WEBHOOK_SECRET;
  const provided = req.headers.get("x-webhook-secret") || req.headers.get("x-cf-webhook-secret") || "";

  if (SECRET && provided !== SECRET) {
    return NextResponse.json({ ok:false, error:"BAD_SIGNATURE", requestId:id }, { status: 400, headers:{ "x-request-id": id } });
  }

  let body: CFWebhook = {};
  try { body = await req.json(); } catch { body = {} as any; }

  const uid = body?.uid || (body as any)?.video?.uid || "";
  if (!uid) {
    return NextResponse.json({ ok:false, error:"MISSING_UID", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  const state = (body?.status?.state || (body as any)?.status)?.toString().toLowerCase();
  const duration = typeof body?.duration === "number" ? body.duration : (typeof (body as any)?.input?.duration === "number" ? (body as any).input.duration : undefined);

  // Update store
  const rec = upsertVideo(uid, {
    status: state === "ready" ? "ready" : state === "error" ? "errored" : "created",
    duration: duration ?? null,
    meta: body,
    flags: { overDuration: !!(duration && duration > MAX_S) },
    error: state === "error" ? "cloudflare_stream_error" : null
  });

  return NextResponse.json({ ok:true, saved: rec, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
