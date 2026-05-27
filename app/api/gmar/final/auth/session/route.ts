import { NextResponse } from "next/server";

import {
  createGmarAuthSession,
  assertGmarAuthSession
} from "@/src/core/gmar/final-completion/auth/playerAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const { session, player } = createGmarAuthSession({
      userId:
        typeof body.userId === "string"
          ? body.userId
          : "",
      displayName:
        typeof body.displayName === "string"
          ? body.displayName
          : undefined,
      sessionId:
        typeof body.sessionId === "string"
          ? body.sessionId
          : undefined
    });

    assertGmarAuthSession(session);

    return NextResponse.json({
      ok: true,
      session,
      player
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR auth session failed."
      },
      { status: 401 }
    );
  }
}
