import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Minimal middleware hardening.
 * Note: next.config headers() is the primary contract enforcer; middleware is additive.
 */
export function middleware(_req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  return res;
}

export const config = {
  matcher: ["/:path*"],
};
