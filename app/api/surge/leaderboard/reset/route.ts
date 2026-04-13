import { NextRequest, NextResponse } from "next/server";
import { resetSeason } from "@/lib/surge/seasonReset";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.entries)) {
      return NextResponse.json(
        { ok: false, error: "missing_reset_entries" },
        { status: 400 }
      );
    }

    const result = resetSeason(body.entries);

    return NextResponse.json({
      ok: true,
      source: "lumora_season_reset_v1",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "season_reset_failed" },
      { status: 500 }
    );
  }
}
