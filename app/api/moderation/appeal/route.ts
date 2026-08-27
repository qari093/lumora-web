import { NextResponse } from "next/server";
import {
  createModerationAppeal,
  listModerationAppealsForUser,
  ModerationAppealTargetError,
} from "@/src/core/moderation-production/appeal";
import {
  requireUserSession,
  userPrivateNoStoreHeaders,
} from "@/src/lib/auth/requireUserSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const appeals = await listModerationAppealsForUser(
      auth.identity.userId
    );

    return json(200, {
      ok: true,
      appeals,
    });
  } catch {
    return json(500, {
      ok: false,
      error: "APPEAL_STATUS_READ_FAILED",
    });
  }
}

export async function POST(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const body = await req.json().catch(() => null);

  const reportId =
    typeof body?.reportId === "string"
      ? body.reportId.trim()
      : "";

  const reason =
    typeof body?.reason === "string"
      ? body.reason.trim()
      : "";

  const suppliedUserId =
    typeof body?.userId === "string"
      ? body.userId.trim()
      : "";

  if (
    suppliedUserId &&
    suppliedUserId !== auth.identity.userId
  ) {
    return json(403, {
      ok: false,
      error: "forbidden_user_scope",
    });
  }

  if (!reportId || !reason) {
    return json(400, {
      ok: false,
      error: "INVALID_APPEAL_REQUEST",
    });
  }

  try {
    const appeal = await createModerationAppeal({
      reportId,
      userId: auth.identity.userId,
      reason,
    });

    return json(201, {
      ok: true,
      appeal,
    });
  } catch (error) {
    if (error instanceof ModerationAppealTargetError) {
      if (error.code === "APPEAL_TARGET_NOT_FOUND") {
        return json(404, {
          ok: false,
          error: "APPEAL_TARGET_NOT_FOUND",
        });
      }

      if (error.code === "APPEAL_TARGET_FORBIDDEN") {
        return json(403, {
          ok: false,
          error: "APPEAL_TARGET_FORBIDDEN",
        });
      }

      if (error.code === "APPEAL_TARGET_NOT_APPEALABLE") {
        return json(409, {
          ok: false,
          error: "APPEAL_TARGET_NOT_APPEALABLE",
        });
      }
    }

    return json(500, {
      ok: false,
      error: "APPEAL_CREATE_FAILED",
    });
  }
}
