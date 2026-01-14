import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Minimal middleware hardening.
 * Note: next.config headers() is the primary contract enforcer; middleware is additive.
 */
export function middleware(_req: NextRequest) {
  // bypass health endpoints (Final36 Step 17) — keep health zero-cost & avoid middleware rewrite/header side-effects
  try {
    const u = new URL(req.url);
    const p = u.pathname;
    if (p === "/api/health" || p === "/api/healthz" || p === "/api/_health" || p === "/api/ready" || p === "/api/version") {
      return NextResponse.next();
    }
  } catch (_) {
    // if URL parsing fails, continue
  }

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  return res;
}

export const config = {
  matcher: [
    // Skip Next.js internals and health endpoints
    "/((?!_next/|favicon.ico|api/(?:health|healthz|_health|ready|version)).*)",
  ],
};;
