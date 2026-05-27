import { NextResponse } from "next/server";

import {
  createGmarAiMissionSuggestion,
  assertGmarAiMissionSuggestion
} from "@/src/core/gmar/ai-active/aiAssist";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.state) {
      throw new Error("GMAR state is required.");
    }

    const suggestion = createGmarAiMissionSuggestion({
      state: body.state,
      mode:
        body.mode === "shadow" || body.mode === "assistive"
          ? body.mode
          : undefined
    });

    assertGmarAiMissionSuggestion(suggestion);

    return NextResponse.json({
      ok: true,
      suggestion
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR AI suggestion failed."
      },
      { status: 400 }
    );
  }
}
