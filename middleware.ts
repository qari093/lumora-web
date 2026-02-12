import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never rewrite health endpoints (tests and ops rely on these)
  if (pathname === "/api/health" || pathname === "/api/healthz") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
