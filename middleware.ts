import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED = new Set(["user","mod","admin"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /creator and all subpaths
  if (pathname.startsWith("/creator")) {
    const role = req.cookies.get("role")?.value;

    // Only allow authenticated roles; everyone else → /login
    if (!role || !ALLOWED.has(role)) {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/creator", "/creator/:path*"],
};
