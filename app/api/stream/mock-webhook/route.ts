import { NextRequest, NextResponse } from "next/server";
import { upsertVideo } from "@/src/lib/stream/store";
import { reqId } from "@/src/lib/reqid";

const DEV = process.env.NODE_ENV !== "production";

export async function POST(req: NextRequest) {
  const id = reqId();
  if (!DEV) {
    return NextResponse.json({ ok:false, error:"DISABLED_IN_PRODUCTION", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  let body:any = {};
  try { body = await req.json(); } catch {}
  const uid = body?.uid || "";
  const duration = typeof body?.duration === "number" ? body.duration : undefined;
  const state = (body?.state || "ready").toString().toLowerCase();

  if (!uid) return NextResponse.json({ ok:false, error:"MISSING_UID", requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const MAX_S = Number(process.env.STREAM_MAX_SECONDS || "180");
  const rec = upsertVideo(uid, {
    status: state === "ready" ? "ready" : state === "error" ? "errored" : "created",
    duration: duration ?? null,
    flags: { overDuration: !!(duration && duration > MAX_S) },
    meta: { mock:true }
  });

  return NextResponse.json({ ok:true, saved: rec, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
