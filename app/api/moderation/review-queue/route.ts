import { NextRequest, NextResponse } from "next/server";
import { createReviewQueueItem } from "@/lib/moderation/reviewQueue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.contentId || !body?.reason) {
      return NextResponse.json(
        { ok: false, error: "missing_review_fields" },
        { status: 400 }
      );
    }

    const item = createReviewQueueItem({
      contentId: String(body.contentId),
      reason: String(body.reason),
      priority:
        body.priority === "low" || body.priority === "high" || body.priority === "medium"
          ? body.priority
          : "medium",
      source:
        body.source === "risk_mode" || body.source === "moderation" || body.source === "surge"
          ? body.source
          : "surge",
    });

    console.log("LUMORA_REVIEW_QUEUE", JSON.stringify(item));

    return NextResponse.json({
      ok: true,
      source: "lumora_review_queue_v1",
      item,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "review_queue_failed" },
      { status: 500 }
    );
  }
}
