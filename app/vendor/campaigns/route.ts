import { NextResponse } from "next/server";

function toCamps(url: string): string {
  try {
    const u = new URL(url);
    // normalize to /vendor/camps (strip any trailing slash)
    u.pathname = "/vendor/camps";
    return u.toString();
  } catch {
    return "/vendor/camps";
  }
}

export async function GET(req: Request) {
  return NextResponse.redirect(toCamps(req.url), 308);
}

export async function HEAD(req: Request) {
  return NextResponse.redirect(toCamps(req.url), 308);
}

export const dynamic = "force-dynamic";
