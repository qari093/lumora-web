import { NextResponse } from "next/server";
import {
  getPresence,
  setPresence,
} from "@/src/core/lumalink/runtime";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId") ?? "";

  if (!userId.trim()) {
    return NextResponse.json(
      { ok: false, error: "userId_required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    presence: getPresence(userId),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!["offline", "away", "online"].includes(body?.status)) {
    return NextResponse.json(
      { ok: false, error: "invalid_presence_status" },
      { status: 400 },
    );
  }

  try {
    const presence = setPresence({
      userId: body?.userId,
      status: body.status,
    });

    return NextResponse.json({ ok: true, presence });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "presence_update_failed",
      },
      { status: 400 },
    );
  }
}
