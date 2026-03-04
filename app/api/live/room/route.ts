import { NextResponse } from "next/server";
import { getRoomById } from "@/lib/live/rooms";

export function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || "";
    if (!id) {
      const r = NextResponse.json({ ok: false, error: "id_required", ts: Date.now() }, { status: 400 });
      r.headers.set("cache-control", "no-store");
      r.headers.set("x-lumora-live", "room-v1");
      return r;
    }
    const room = getRoomById(id);
    if (!room) {
      const r = NextResponse.json({ ok: false, error: "not_found", ts: Date.now() }, { status: 404 });
      r.headers.set("cache-control", "no-store");
      r.headers.set("x-lumora-live", "room-v1");
      return r;
    }
    const r = NextResponse.json({ ok: true, ts: Date.now(), room }, { status: 200 });
    r.headers.set("cache-control", "no-store");
    r.headers.set("content-type", "application/json; charset=utf-8");
    r.headers.set("x-lumora-live", "room-v1");
    return r;
  } catch {
    const r = NextResponse.json({ ok: false, error: "internal_error", ts: Date.now() }, { status: 500 });
    r.headers.set("cache-control", "no-store");
    r.headers.set("x-lumora-live", "room-v1");
    return r;
  }
}
