import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function randId(): string {
  // small, fast, collision-resistant-enough for request tracing
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function middleware(req: NextRequest) {
  const start = Date.now();

  // Pass-through response, then decorate headers.
  const res = NextResponse.next();

  const reqId = req.headers.get("x-request-id") || randId();
  res.headers.set("x-request-id", reqId);

  // Timing header will be approximate because Next middleware runs before route handler,
  // but still useful for coarse tracing; handler-specific timing can be added later.
  const dur = Date.now() - start;
  res.headers.set("server-timing", `mw;dur=${dur}`);

  // Mark this response as touched by middleware for debugging
  res.headers.set("x-lumora-mw", "1");

  return res;
}

export const config = {
  matcher: ["/api/nexa/:path*"],
};
