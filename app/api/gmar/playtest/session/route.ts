import { NextResponse } from "next/server";

import {
  createGmarPrivatePlaytestSession,
  assertGmarPrivatePlaytestSession
} from "@/src/core/gmar/playtest-active/privatePlaytest";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const session = createGmarPrivatePlaytestSession({
      testerId:
        typeof body.testerId === "string"
          ? body.testerId
          : "",
      accepted: body.accepted === true
    });

    assertGmarPrivatePlaytestSession(session);

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
            : "GMAR private playtest session failed."
      },
      { status: 400 }
    );
  }
}
