import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// IMPORTANT: this middleware MUST NOT run for /api/live/* (live contract tests).
export const config = {
  matcher: ["/api/nexa/:path*"],
};

export function middleware(req: NextRequest) {
  try {
    // guard: only nexa paths ever reach here due to matcher
    const res = NextResponse.next();
    // keep any existing nexa-specific headers minimal and safe
    res.headers.set("x-lumora-mw", "nexa-only");
    return res;
  } catch {
    return NextResponse.next();
  }
}
