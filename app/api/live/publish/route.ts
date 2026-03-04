import { NextRequest } from "next/server";
import crypto from "crypto";
import { publish, getRoomState } from "@/lib/live/state";

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function uuid(): string {
  const anyCrypto: any = crypto as any;
  if (typeof anyCrypto.randomUUID === "function") return anyCrypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

function ratelimitHeaders() {
  const limit = 60;
  const remaining = 59;
  const reset = Math.floor(Date.now() / 1000) + 60;
  return {
    "x-ratelimit-limit": String(limit),
    "x-ratelimit-remaining": String(remaining),
    "x-ratelimit-reset": String(reset),
  };
}

function toISO(ms: number): string | null {
  if (!ms || ms <= 0) return null;
  return new Date(ms).toISOString();
}

export async function POST(req: NextRequest) {
  const requestId = uuid();
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const roomId = String(body?.roomId || body?.roomid || "demo-room").trim() || "demo-room";

    publish(roomId, { kind: "event" });

    const r = getRoomState(roomId);

    return json(
      {
        ok: true,
        requestId,
        roomId: r.id,
        roomid: r.id,
        updatedAt: r.updatedAt,
        lastPublishAt: r.lastPublishAt,
        lastEventAt: toISO(r.lastEventAt),
      },
      200,
      { ...ratelimitHeaders(), "x-request-id": requestId }
    );
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json(
      { ok: false, requestId, error: msg },
      500,
      { ...ratelimitHeaders(), "x-request-id": requestId }
    );
  }
}
