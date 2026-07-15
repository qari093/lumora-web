import { NextResponse } from "next/server";
import { relationshipBetween } from "@/src/core/lumalink/runtime";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const firstUserId = params.get("firstUserId") ?? "";
  const secondUserId = params.get("secondUserId") ?? "";

  if (!firstUserId.trim() || !secondUserId.trim()) {
    return NextResponse.json(
      { ok: false, error: "relationship_participants_required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    relationship: relationshipBetween(firstUserId, secondUserId),
  });
}
