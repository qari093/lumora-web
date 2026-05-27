import { NextResponse } from "next/server";

import {
  joinGmarLiveEvent,
  assertGmarWorldEventState
} from "@/src/core/gmar/world-active/worldEvents";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.state || typeof body.eventId !== "string") {
      throw new Error("GMAR state and eventId are required.");
    }

    const state = joinGmarLiveEvent({
      state: body.state,
      eventId: body.eventId
    });

    assertGmarWorldEventState(state);

    return NextResponse.json({
      ok: true,
      state
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR event join failed."
      },
      { status: 400 }
    );
  }
}
