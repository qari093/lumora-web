import { NextResponse } from "next/server";

import {
  createGmarFypActivityCard,
  assertGmarFypActivityCard
} from "@/src/core/gmar/fyp-active/gmarFypBridge";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.state || typeof body.type !== "string") {
      throw new Error("GMAR state and activity type are required.");
    }

    const card = createGmarFypActivityCard({
      state: body.state,
      type: body.type,
      title:
        typeof body.title === "string"
          ? body.title
          : "GMAR Activity",
      description:
        typeof body.description === "string"
          ? body.description
          : "A new GMAR moment is ready."
    });

    assertGmarFypActivityCard(card);

    return NextResponse.json({
      ok: true,
      card
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR FYP activity creation failed."
      },
      { status: 400 }
    );
  }
}
