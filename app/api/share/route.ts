import { NextResponse } from "next/server";
import { createInternalShare } from "@/lib/share/internal";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createInternalShare(body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, reason: result.reason },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, share: result.share });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid_json" },
      { status: 400 }
    );
  }
}
