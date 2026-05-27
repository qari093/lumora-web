import { NextResponse } from "next/server";
import { createNotification } from "@/src/core/notifications-production/create";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.userId || !body?.type || !body?.message) {
    return NextResponse.json(
      { ok: false, error: "INVALID_NOTIFICATION_REQUEST" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    notification: createNotification(body),
  });
}
