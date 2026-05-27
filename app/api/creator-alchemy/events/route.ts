import { NextResponse } from "next/server";
import { validateCreatorAlchemyEvent } from "@/src/core/creator-alchemy/live";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body?.event;

    if (!validateCreatorAlchemyEvent(event)) {
      return NextResponse.json({ ok: false, error: "invalid_creator_alchemy_event" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      accepted: true,
      event
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "creator_alchemy_event_ingest_failed"
      },
      { status: 500 }
    );
  }
}
