import { NextRequest, NextResponse } from "next/server";
import { evaluateRateLimit } from "@/lib/safety/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = evaluateRateLimit({
      hits: typeof body?.hits === "number" ? body.hits : 0,
      limit: typeof body?.limit === "number" ? body.limit : 30,
      windowSeconds: typeof body?.windowSeconds === "number" ? body.windowSeconds : 60,
    });

    const status = result.allowed ? 200 : 429;

    const res = NextResponse.json(
      {
        ok: true,
        source: "lumora_rate_limit_v1",
        ...result,
      },
      { status }
    );

    res.headers.set("X-RateLimit-Limit", String(result.limit));
    res.headers.set("X-RateLimit-Remaining", String(result.remaining));
    res.headers.set("X-RateLimit-Window", String(result.windowSeconds));

    if (!result.allowed) {
      res.headers.set("Retry-After", String(result.windowSeconds));
    }

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "rate_limit_failed" },
      { status: 500 }
    );
  }
}
