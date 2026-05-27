import { NextResponse } from "next/server";

import {
  createGmarMatchmakingQueue,
  enqueueGmarPlayer,
  createGmarSession,
  assertGmarSession
} from "@/src/core/gmar/final-completion/matchmaking/matchmakingSessions";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const queue = createGmarMatchmakingQueue({
      queueId:
        typeof body.queueId === "string"
          ? body.queueId
          : "origin_match",
      type: "pve"
    });

    const queueWithOwner = enqueueGmarPlayer({
      queue,
      playerId:
        typeof body.ownerPlayerId === "string"
          ? body.ownerPlayerId
          : ""
    });

    const queueWithGuest = enqueueGmarPlayer({
      queue: queueWithOwner,
      playerId:
        typeof body.guestPlayerId === "string"
          ? body.guestPlayerId
          : ""
    });

    const session = createGmarSession({
      queue: queueWithGuest
    });

    assertGmarSession(session);

    return NextResponse.json({
      ok: true,
      session
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR matchmaking failed."
      },
      { status: 400 }
    );
  }
}
