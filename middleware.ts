import { NextRequest, NextResponse } from "next/server";

function applyLumoraSecurityHeaders(headers: Headers): void {
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
}

export function middleware(_req: NextRequest) {
  const res = NextResponse.next();
  applyLumoraSecurityHeaders(res.headers);
  return res;
}

export const config = {
  matcher: "/:path*",
};
