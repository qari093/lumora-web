import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/api/:path*"] };

const WINDOW_MS = 60_000;
const CAP = 120;
const BUCKET = new Map<string, { tokens: number; reset: number }>();

function getIP(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  return "127.0.0.1";
}

export function middleware(req: NextRequest) {
  const apiKey = process.env.LUMORA_API_KEY || "";
  const provided = req.headers.get("x-api-key") || "";
  if (req.method !== "GET" && provided !== apiKey) {
    return new NextResponse(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const ip = getIP(req);
  const path = req.nextUrl.pathname;
  const k = `${ip}|${path}`;
  const now = Date.now();
  const b = BUCKET.get(k);

  if (!b || now > b.reset) {
    BUCKET.set(k, { tokens: CAP - 1, reset: now + WINDOW_MS });
    return NextResponse.next();
  }
  if (b.tokens <= 0) {
    return new NextResponse(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }
  b.tokens--;
  return NextResponse.next();
}
