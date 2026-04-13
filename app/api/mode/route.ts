import { NextRequest, NextResponse } from "next/server";
import { resolveMode } from "@/lib/mode/mode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = resolveMode(body?.mode);

    const res = NextResponse.json({
      ok: true,
      mode,
      source: "lumora_mode_persistence_v1",
    });

    res.cookies.set("lumora_mode", mode, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 24 * 365,
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "mode_persistence_failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const mode = resolveMode(req.cookies.get("lumora_mode")?.value);

  return NextResponse.json({
    ok: true,
    mode,
    source: "lumora_mode_persistence_v1",
  });
}
