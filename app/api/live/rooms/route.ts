import { NextRequest } from "next/server";
import crypto from "crypto";
import { listRooms } from "@/lib/live/state";

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

export async function GET(_req: NextRequest) {
  const requestId = uuid();
  try {
    const rooms = listRooms();
    const activeRooms = rooms.length;
    const ts = new Date().toISOString();

    return json(
      { ok: true, requestId, rooms, activeRooms, ts },
      200,
      { ...ratelimitHeaders(), "x-request-id": requestId }
    );
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    const ts = new Date().toISOString();
    return json(
      { ok: false, requestId, error: msg, rooms: [], activeRooms: 0, ts },
      500,
      { ...ratelimitHeaders(), "x-request-id": requestId }
    );
  }
}
