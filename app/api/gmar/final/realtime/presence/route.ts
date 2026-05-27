import { NextResponse } from "next/server";

import {
  createGmarRealtimeRoom,
  joinGmarRealtimeRoom,
  assertGmarRealtimeRoom
} from "@/src/core/gmar/final-completion/realtime/realtimeMultiplayer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const room = createGmarRealtimeRoom({
      roomId:
        typeof body.roomId === "string"
          ? body.roomId
          : "gmar_presence_room",
      channel: "presence",
      ownerPlayerId:
        typeof body.ownerPlayerId === "string"
          ? body.ownerPlayerId
          : ""
    });

    const joined =
      typeof body.joinPlayerId === "string" && body.joinPlayerId.trim()
        ? joinGmarRealtimeRoom({
            room,
            playerId: body.joinPlayerId
          })
        : room;

    assertGmarRealtimeRoom(joined);

    return NextResponse.json({
      ok: true,
      room: joined
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR realtime presence failed."
      },
      { status: 400 }
    );
  }
}
