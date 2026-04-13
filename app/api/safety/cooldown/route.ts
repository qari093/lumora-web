import { NextRequest, NextResponse } from "next/server";
import { checkCooldown } from "@/lib/safety/cooldown";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = checkCooldown({
      lastActionAt:
        typeof body?.lastActionAt === "number" ? body.lastActionAt : null,
      cooldownMinutes:
        typeof body?.cooldownMinutes === "number" ? body.cooldownMinutes : 5,
    });

    const status = result.allowed ? 200 : 429;

    const res = NextResponse.json(
      {
        ok: true,
        source: "lumora_cooldown_v1",
        ...result,
      },
      { status }
    );

    if (!result.allowed) {
      res.headers.set("Retry-After", String(result.retryAfterSeconds));
    }

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "cooldown_check_failed" },
      { status: 500 }
    );
  }
}
