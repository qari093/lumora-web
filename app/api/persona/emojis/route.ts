import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reaction = (searchParams.get("reaction") || "love").toLowerCase();
  const r = await fetch(new URL(`/api/persona/assets?type=emoji&reaction=${encodeURIComponent(reaction)}`, req.url), {
    cache: "no-store",
  });
  const j = await r.json();
  return NextResponse.json(j);
}
