import { NextResponse } from "next/server";
import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import { findRelationship } from "@/src/core/lumalink/persistence";

export async function GET(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const params = new URL(req.url).searchParams;
  const otherUserId =
    params.get("otherUserId") ??
    params.get("secondUserId") ??
    "";

  if (!otherUserId.trim()) {
    return NextResponse.json(
      { ok: false, error: "otherUserId_required" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      relationship: await findRelationship(
        auth.identity.userId,
        otherUserId.trim(),
      ),
    },
    { headers: userPrivateNoStoreHeaders() },
  );
}
