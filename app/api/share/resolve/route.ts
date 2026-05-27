import { NextResponse } from "next/server";
import { resolveLumoraLink } from "@/src/core/link-protocol/resolve";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "";
  const resolved = resolveLumoraLink(slug);

  if (!resolved) {
    return NextResponse.json({ ok: false, error: "LINK_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, resolved });
}
