import { NextRequest, NextResponse } from "next/server";
import {
  defaultPersonalLimits,
  sanitizePersonalLimits,
} from "@/lib/safety/personalLimits";

const COOKIE_NAME = "lumora_personal_limits";

export async function GET(req: NextRequest) {
  try {
    const raw = req.cookies.get(COOKIE_NAME)?.value;
    const parsed = raw ? JSON.parse(raw) : defaultPersonalLimits;
    const limits = sanitizePersonalLimits(parsed);

    return NextResponse.json({
      ok: true,
      source: "lumora_personal_limits_v1",
      limits,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "personal_limits_read_failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const limits = sanitizePersonalLimits(body);

    const res = NextResponse.json({
      ok: true,
      source: "lumora_personal_limits_v1",
      limits,
    });

    res.cookies.set(COOKIE_NAME, JSON.stringify(limits), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 24 * 365,
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "personal_limits_write_failed" },
      { status: 500 }
    );
  }
}
