import { NextResponse } from "next/server";
import {
  addGroupMember,
  createGroup,
  listGroups,
} from "@/src/core/lumalink/runtime";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId") ?? "";

  if (!userId.trim()) {
    return NextResponse.json(
      { ok: false, error: "userId_required" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, groups: listGroups(userId) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  try {
    const group = createGroup({
      name: body?.name,
      ownerId: body?.ownerId,
      memberIds: Array.isArray(body?.memberIds) ? body.memberIds : [],
    });

    return NextResponse.json({ ok: true, group }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "group_creation_failed",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);

  try {
    const group = addGroupMember({
      groupId: body?.groupId,
      actorId: body?.actorId,
      memberId: body?.memberId,
    });

    return NextResponse.json({ ok: true, group });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "group_update_failed",
      },
      { status: 400 },
    );
  }
}
