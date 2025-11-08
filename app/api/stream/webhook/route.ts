import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// --- configurable limits ---
const MAX_VIDEO_SECONDS = Number(process.env.MAX_VIDEO_SECONDS ?? 120); // 2 min default
const MAX_SIZE_BYTES = Number(process.env.MAX_VIDEO_SIZE_BYTES ?? 1_000_000_000); // 1 GB

type PolicyResult = { ok: boolean; reasons: string[] };

function evaluatePolicy(input: { durationSec?: number; sizeBytes?: number; ownerId?: string }): PolicyResult {
  const reasons: string[] = [];
  if (typeof input.durationSec === "number" && input.durationSec > MAX_VIDEO_SECONDS)
    reasons.push(`duration_exceeds_limit:${input.durationSec}s>${MAX_VIDEO_SECONDS}s`);
  if (typeof input.sizeBytes === "number" && input.sizeBytes > MAX_SIZE_BYTES)
    reasons.push(`size_exceeds_limit:${input.sizeBytes}B>${MAX_SIZE_BYTES}B`);
  return { ok: reasons.length === 0, reasons };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
    },
  });
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    let body: any;
    try { body = JSON.parse(raw); }
    catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

    const uid: string | undefined = body.uid ?? body.id ?? body?.video?.uid;
    if (!uid) return NextResponse.json({ ok: false, error: "Missing uid" }, { status: 400 });

    const readyToStreamRaw = !!(body.readyToStream ?? body?.status?.state === "ready");
    const statusState = body?.status?.state ?? (readyToStreamRaw ? "ready" : "queued");
    const durationSec = body.duration ?? body?.meta?.duration ?? body?.input?.duration;
    const sizeBytes = body.size ?? body?.input?.size ?? body?.meta?.size;
    const thumbnailUrl = body.thumbnail ?? body.thumbnailUrl ?? (body?.thumbnails?.[0] ?? null);
    const playbackId = body.playbackId ?? body?.playback?.id ?? uid;
    const ownerId = body.ownerId ?? body?.meta?.ownerId ?? undefined;

    const map: Record<string, "uploaded" | "queued" | "ready" | "error"> = {
      uploaded: "uploaded", queued: "queued", ready: "ready", error: "error"
    };
    let status = map[statusState] ?? (readyToStreamRaw ? "ready" : "queued");
    let readyToStream = status === "ready";

    const policy = evaluatePolicy({ durationSec, sizeBytes, ownerId });
    if (!policy.ok) {
      status = "error";
      readyToStream = false;
      body = {
        ...body,
        policy: {
          ok: false,
          reasons: policy.reasons,
          evaluatedAt: new Date().toISOString(),
          limits: { MAX_VIDEO_SECONDS, MAX_SIZE_BYTES },
        },
      };
    } else {
      body = {
        ...body,
        policy: {
          ok: true,
          evaluatedAt: new Date().toISOString(),
          limits: { MAX_VIDEO_SECONDS, MAX_SIZE_BYTES },
        },
      };
    }

    const row = await prisma.streamVideo.upsert({
      where: { uid },
      create: { uid, ownerId, readyToStream, status, durationSec, sizeBytes, thumbnailUrl, playbackId, meta: body },
      update: { ownerId, readyToStream, status, durationSec, sizeBytes, thumbnailUrl, playbackId, meta: body },
    });

    return NextResponse.json({
      ok: true,
      uid: row.uid,
      ownerId: row.ownerId,
      readyToStream: row.readyToStream,
      status: row.status,
      policyOk: policy.ok,
      policyReasons: policy.reasons,
      requestId: Math.random().toString(36).slice(2),
    });
  } catch (err: any) {
    console.error("[stream/webhook] error:", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
