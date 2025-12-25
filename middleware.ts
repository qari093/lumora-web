import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware is intentionally a NO-OP.
 *
 * Health routing (/api/_health legacy behavior) is handled via next.config rewrites,
 * not middleware, to avoid Edge/runtime header/URL parsing issues.
 *
 * We also EXCLUDE /api/* from middleware execution to keep APIs stable + fast.
 */
export function middleware(_req: NextRequest) {

  // Fast-path: never rewrite dedicated internal health endpoint
  if (_req.nextUrl.pathname === "/api/_health") {
    return NextResponse.next();
  }
  return NextResponse.next();
}

/**
 * Run middleware only for non-API pages.
 * (Prevents any interference with /api/* handlers and health probes.)
 */
export const config = {
  matcher: ["/((?!api/).*)"],
};
