import { NextResponse } from "next/server";

// Guard: disable middleware cleanly if required envs are missing
const REQUIRED_ENVS = ["NEXTAUTH_SECRET","JWT_SECRET","API_BASE_URL"];
const missing = REQUIRED_ENVS.filter(k => !process.env[k]);

export function middleware(_req: Request) {
  if (missing.length) {
    if (process.env.NODE_ENV !== "production") {
      // Don’t spam in prod; show once in dev
      console.warn("[middleware] disabled — missing envs:", missing.join(", "));
    }
    // Allow pages to load in dev mode when envs are missing
    return NextResponse.next();
  }

  // ⤵️ Put your real logic below when envs are set:
  return NextResponse.next();
}

// Skip static assets and health/debug endpoints
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health|api/whereami).*)"
  ]
};
