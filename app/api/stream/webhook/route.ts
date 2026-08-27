import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_VIDEO_SECONDS = Number(
  process.env.MAX_VIDEO_SECONDS ?? 120,
);

const MAX_SIZE_BYTES = Number(
  process.env.MAX_VIDEO_SIZE_BYTES ?? 1_000_000_000,
);

type PolicyResult = {
  ok: boolean;
  reasons: string[];
};

function evaluatePolicy(input: {
  durationSec?: number;
  sizeBytes?: number;
}): PolicyResult {
  const reasons: string[] = [];

  if (
    typeof input.durationSec === "number" &&
    input.durationSec > MAX_VIDEO_SECONDS
  ) {
    reasons.push("duration_exceeds_limit");
  }

  if (
    typeof input.sizeBytes === "number" &&
    input.sizeBytes > MAX_SIZE_BYTES
  ) {
    reasons.push("size_exceeds_limit");
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "content-type, x-lumora-sign",
    },
  });
}

export async function POST(req: Request) {
  const expected =
    process.env.LUMORA_STREAM_WEBHOOK_SECRET?.trim() || "";

  const provided =
    req.headers.get("x-lumora-sign")?.trim() || "";

  if (!expected || !provided || provided !== expected) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  try {
    const raw = await req.text();

    let body: any;

    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid_json" },
        { status: 400 },
      );
    }

    const uid: string | undefined =
      body.uid ??
      body.id ??
      body?.video?.uid;

    if (!uid) {
      return NextResponse.json(
        { ok: false, error: "missing_uid" },
        { status: 400 },
      );
    }

    /*
     * Ownership is established only by the authenticated upload-token
     * route. Webhook payloads are never allowed to create ownership or
     * overwrite ownerId.
     */
    const existing = await prisma.streamVideo.findUnique({
      where: { uid },
      select: {
        uid: true,
        ownerId: true,
      },
    });

    if (!existing || !existing.ownerId) {
      return NextResponse.json(
        { ok: false, error: "unknown_upload" },
        { status: 404 },
      );
    }

    const readyToStreamRaw = Boolean(
      body.readyToStream ??
      body?.status?.state === "ready",
    );

    const statusState =
      body?.status?.state ??
      (readyToStreamRaw ? "ready" : "queued");

    const durationSec =
      body.duration ??
      body?.meta?.duration ??
      body?.input?.duration;

    const sizeBytes =
      body.size ??
      body?.input?.size ??
      body?.meta?.size;

    const thumbnailUrl =
      body.thumbnail ??
      body.thumbnailUrl ??
      body?.thumbnails?.[0] ??
      null;

    const playbackId =
      body.playbackId ??
      body?.playback?.id ??
      uid;

    const statusMap: Record<
      string,
      "uploaded" | "queued" | "ready" | "error"
    > = {
      uploaded: "uploaded",
      queued: "queued",
      ready: "ready",
      error: "error",
    };

    let status =
      statusMap[statusState] ??
      (readyToStreamRaw ? "ready" : "queued");

    let readyToStream = status === "ready";

    const policy = evaluatePolicy({
      durationSec,
      sizeBytes,
    });

    if (!policy.ok) {
      status = "error";
      readyToStream = false;
    }

    const safeMeta = {
      providerPayload: body,
      policy: {
        ok: policy.ok,
        reasons: policy.reasons,
        evaluatedAt: new Date().toISOString(),
        limits: {
          maxVideoSeconds: MAX_VIDEO_SECONDS,
          maxSizeBytes: MAX_SIZE_BYTES,
        },
      },
    };

    const row = await prisma.streamVideo.update({
      where: { uid },
      data: {
        readyToStream,
        status,
        durationSec,
        sizeBytes,
        thumbnailUrl,
        playbackId,
        meta: safeMeta,
      },
      select: {
        uid: true,
        ownerId: true,
        readyToStream: true,
        status: true,
      },
    });

    return NextResponse.json({
      ok: true,
      uid: row.uid,
      ownerId: row.ownerId,
      readyToStream: row.readyToStream,
      status: row.status,
      policyOk: policy.ok,
      policyReasons: policy.reasons,
      requestId: crypto.randomUUID(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "stream_webhook_failed" },
      { status: 500 },
    );
  }
}
