import { NextResponse } from "next/server";
import {
  createAnalyticsEvent,
  type AnalyticsEventName,
} from "@/src/core/analytics-production/events";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.name) {
    return NextResponse.json(
      { ok: false, error: "INVALID_ANALYTICS_EVENT" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    event: createAnalyticsEvent({
      name: body.name as AnalyticsEventName,
      userId: body.userId,
      targetId: body.targetId,
    }),
  });
}
