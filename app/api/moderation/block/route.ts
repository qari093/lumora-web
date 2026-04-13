import { NextRequest, NextResponse } from "next/server";
import { blockUnsafeContent } from "@/lib/moderation/blockUnsafeContent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = blockUnsafeContent({
      moderationAllowed:
        typeof body?.moderationAllowed === "boolean" ? body.moderationAllowed : true,
      trustLevel:
        body?.trustLevel === "low" || body?.trustLevel === "medium" || body?.trustLevel === "high"
          ? body.trustLevel
          : "medium",
      isRiskMode: Boolean(body?.isRiskMode),
    });

    return NextResponse.json(
      {
        ok: true,
        source: "lumora_unsafe_block_v1",
        ...result,
      },
      { status: result.blocked ? 403 : 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "unsafe_block_failed" },
      { status: 500 }
    );
  }
}
