import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Safe pass-through middleware.
 * Rationale: previous patches introduced runtime ReferenceErrors (req/request undefined) causing global 500s.
 * This restores a valid Next.js middleware signature and lets route handlers own behavior.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
