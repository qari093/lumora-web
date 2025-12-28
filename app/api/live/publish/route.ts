import { NextResponse } from "next/server";
import { publish } from "@/lib/live/sseBus";
import {
  ensureRoom,
  bumpRoomLastEventAt,
} from "@/lib/live/roomStateStore";

function json(ok: boolean, body: any, status = 200) {
  return NextResponse.json(
    { ok, ...body, ts: new Date().toISOString() },
    { status }
  );
}

export async function POST(req: Request) {
  try {
    const ctype = String(req.headers.get("content-type") || "");
    if (!ctype.toLowerCase().includes("application/json")) {
      return json(false, { error: { code: "BAD_REQUEST", message: "content-type must be application/json" } }, 400);
    }

    const raw = await req.json().catch(() => null);
    const roomId = String(raw?.roomId || "").trim();
    if (!roomId) {
      return json(false, { error: { code: "BAD_REQUEST", message: "roomId is required" } }, 400);
    }

    const kind = (raw?.kind === "event" || raw?.kind === "keepalive" || raw?.kind === "connected")
      ? raw.kind
      : "event";

    const payload = (raw && typeof raw === "object")
      ? (raw.payload ?? raw.data ?? null)
      : null;

    // Ensure room exists and bump lastEventAt for publish contract
    ensureRoom(roomId);
    bumpRoomLastEventAt(roomId);

    // Broadcast SSE event
    const evt = publish(roomId, "event", {
      kind,
      payload,
    });

    return json(true, {
      marker: "live-publish",
      roomId,
      kind: "event",
      event: evt,
    });
  } catch (e: any) {
    return json(false, { error: { code: "LIVE_PUBLISH_ERROR", message: String(e?.message || e || "unknown") } }, 500);
  }
}
