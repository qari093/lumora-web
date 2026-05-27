import { NextResponse } from "next/server";

import {
  createGmarAdminContext,
  createGmarAdminAction,
  assertGmarAdminAction
} from "@/src/core/gmar/final-completion/admin/adminModeration";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const context = createGmarAdminContext({
      adminId:
        typeof body.adminId === "string"
          ? body.adminId
          : "",
      role:
        body.role === "viewer" ||
        body.role === "moderator" ||
        body.role === "operator" ||
        body.role === "owner"
          ? body.role
          : "viewer"
    });

    const action = createGmarAdminAction({
      context,
      type:
        body.type === "player_lookup" ||
        body.type === "wallet_audit" ||
        body.type === "event_control" ||
        body.type === "creator_review" ||
        body.type === "reward_adjustment" ||
        body.type === "ban_player" ||
        body.type === "rollback"
          ? body.type
          : "player_lookup",
      targetId:
        typeof body.targetId === "string"
          ? body.targetId
          : ""
    });

    assertGmarAdminAction(action);

    return NextResponse.json({
      ok: true,
      action
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR admin action failed."
      },
      { status: 403 }
    );
  }
}
