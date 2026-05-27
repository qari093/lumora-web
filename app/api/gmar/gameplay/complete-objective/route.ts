import { NextResponse } from "next/server";

import {
  completeGmarObjective,
  assertGmarGameplayCompletion
} from "@/src/core/gmar/gameplay/gameplayLoop";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.state || typeof body.missionId !== "string") {
      throw new Error("GMAR state and missionId are required.");
    }

    const result = completeGmarObjective({
      state: body.state,
      missionId: body.missionId
    });

    assertGmarGameplayCompletion(result);

    return NextResponse.json({
      ok: true,
      result
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR gameplay completion failed."
      },
      { status: 400 }
    );
  }
}
