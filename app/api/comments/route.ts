import { NextResponse } from "next/server";
import { createComment } from "@/lib/comments/core";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createComment(body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, reason: result.reason },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, comment: result.comment });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid_json" },
      { status: 400 }
    );
  }
}
