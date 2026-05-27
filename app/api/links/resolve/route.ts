import { NextResponse } from "next/server";
import { resolveLumoraLink } from "@/src/core/link-runtime/resolve";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const resolved = resolveLumoraLink(id);

  if (!resolved) {
    return NextResponse.json({ ok: false, error: "LINK_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, resolved });
}
