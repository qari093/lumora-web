import { NextResponse } from "next/server";
import { createShareLink } from "@/src/core/share-links/create";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.kind || !body?.targetId) {
    return NextResponse.json({ ok: false, error: "INVALID_SHARE_LINK_REQUEST" }, { status: 400 });
  }

  const link = createShareLink(body.kind, body.targetId);

  return NextResponse.json({
    ok: true,
    link,
    url: `/l/${link.slug}`,
  });
}
