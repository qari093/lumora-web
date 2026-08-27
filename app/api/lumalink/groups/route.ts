import { NextResponse } from "next/server";
import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import {
  addGroupMemberForActor,
  createGroupForActor,
  listGroupsForActor,
} from "@/src/core/lumalink/persistence";

export async function GET() {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  return NextResponse.json(
    { ok: true, groups: await listGroupsForActor(auth.identity.userId) },
    { headers: userPrivateNoStoreHeaders() },
  );
}

export async function POST(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);

  try {
    const group = await createGroupForActor(
      auth.identity.userId,
      body?.name,
      body?.memberIds,
    );
    return NextResponse.json(
      { ok: true, group },
      { status: 201, headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "group_creation_failed" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }
}

export async function PATCH(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);

  try {
    const group = await addGroupMemberForActor(
      auth.identity.userId,
      body?.groupId,
      body?.memberId,
    );
    return NextResponse.json(
      { ok: true, group },
      { headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "group_update_failed" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }
}
