import { NextResponse } from "next/server";
import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import {
  getPresenceForActor,
  setPresenceForActor,
} from "@/src/core/lumalink/persistence";

export async function GET(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  try {
    const targetUserId = new URL(req.url).searchParams.get("userId");

    const presence = await getPresenceForActor(
      auth.identity.userId,
      targetUserId,
    );

    return NextResponse.json(
      { ok: true, presence },
      { headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "presence_read_failed" },
      { status: 403, headers: userPrivateNoStoreHeaders() },
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);

  try {
    const presence = await setPresenceForActor(
      auth.identity.userId,
      body?.status,
    );

    return NextResponse.json(
      { ok: true, presence },
      { headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "presence_update_failed" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }
}
