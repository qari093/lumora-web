import { NextResponse } from "next/server";
export function GET(req: Request) {
  return NextResponse.redirect(new URL("/hybrid", req.url), 308);
}
export function HEAD(req: Request) { return GET(req); }
export const dynamic = "force-dynamic";
