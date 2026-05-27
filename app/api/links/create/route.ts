import { NextResponse } from "next/server";
import { createLumoraLink } from "@/src/core/link-runtime/create";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.kind || !body?.targetId) {
    return NextResponse.json({ ok: false, error: "INVALID_LINK_REQUEST" }, { status: 400 });
  }

  const link = createLumoraLink({ kind: body.kind, targetId: body.targetId });

  return NextResponse.json({
    ok: true,
    link,
    url: `/l/${link.id}`,
  });
}
