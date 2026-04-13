import { NextRequest, NextResponse } from "next/server";
import { runModerationCheck } from "@/lib/moderation/moderationCheck";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = runModerationCheck({
      title: typeof body?.title === "string" ? body.title : "",
      text: typeof body?.text === "string" ? body.text : "",
      tags: Array.isArray(body?.tags) ? body.tags : [],
    });

    return NextResponse.json(
      {
        ok: true,
        source: "lumora_moderation_v1",
        ...result,
      },
      { status: result.allowed ? 200 : 422 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "moderation_check_failed" },
      { status: 500 }
    );
  }
}
