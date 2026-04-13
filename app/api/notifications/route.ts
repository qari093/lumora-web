import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications/core";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createNotification(body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, reason: result.reason },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, notification: result.notification });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid_json" },
      { status: 400 }
    );
  }
}
