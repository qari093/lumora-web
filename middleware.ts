import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  // Restrict middleware execution scope:
  // - Only run for /api/_health (legacy alias)
  // - Keep explicit includes for other health endpoints in case Next tightens matcher semantics
  matcher: ["/api/_health", "/api/health", "/api/healthz", "/api/:path*"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Hard fast-path: do nothing for common health endpoints to avoid overhead
  if (pathname === "/api/health" || pathname === "/api/healthz") {
    return NextResponse.next();
  }

  // Legacy underscore segment: Next ignores app segments starting with '_' in app router.
  // Use middleware rewrite so /api/_health behaves as alias of /api/healthz.
  if (pathname === "/api/_health") {
    const url = req.nextUrl.clone();
    url.pathname = "/api/healthz";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
