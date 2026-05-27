import { NextResponse } from "next/server";

import {
  createGmarOnboardingSession,
  assertGmarOnboardingSession
} from "@/src/core/gmar/onboarding/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const userId =
      typeof body.userId === "string"
        ? body.userId
        : "";

    const displayName =
      typeof body.displayName === "string"
        ? body.displayName
        : undefined;

    const session = createGmarOnboardingSession({
      userId,
      displayName
    });

    assertGmarOnboardingSession(session);

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
            : "GMAR onboarding failed."
      },
      { status: 400 }
    );
  }
}
