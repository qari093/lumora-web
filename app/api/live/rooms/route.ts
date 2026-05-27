import { NextResponse } from "next/server";
import { getLiveRooms } from "@/src/live/runtime/liveRooms";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "lumora-live",
    route: "/api/live/rooms",
    rooms: getLiveRooms(),
  });
}
