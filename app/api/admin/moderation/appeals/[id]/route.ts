import { NextResponse } from "next/server";
import {
  MODERATION_APPEAL_APPROVED,
  MODERATION_APPEAL_REJECTED,
  reviewModerationAppeal,
  type ModerationAppealDecision,
} from "@/src/core/moderation-production/appeal";
import {
  adminNoStoreHeaders,
  requireAdminSession,
} from "@/src/lib/auth/requireAdminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: adminNoStoreHeaders(),
  });
}

export async function PATCH(
  req: Request,
  ctx: {
    params:
      | { id: string }
      | Promise<{ id: string }>;
  }
) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await Promise.resolve(ctx.params);
  const appealId = String(id || "").trim();
  const body = await req.json().catch(() => null);

  const decision =
    typeof body?.decision === "string"
      ? body.decision.trim().toLowerCase()
      : "";

  const decisionReason =
    typeof body?.reason === "string"
      ? body.reason.trim()
      : "";

  const remedy =
    typeof body?.remedy === "string"
      ? body.remedy.trim()
      : "";

  if (!appealId || !decisionReason) {
    return json(400, {
      ok: false,
      error: "INVALID_APPEAL_REVIEW_REQUEST",
    });
  }

  if (
    decision !== MODERATION_APPEAL_APPROVED &&
    decision !== MODERATION_APPEAL_REJECTED
  ) {
    return json(400, {
      ok: false,
      error: "INVALID_APPEAL_DECISION",
    });
  }

  try {
    const result = await reviewModerationAppeal({
      appealId,
      reviewerUserId: auth.identity.userId,
      reviewerEmail: auth.identity.email,
      decision: decision as ModerationAppealDecision,
      decisionReason,
      remedy: remedy || null,
    });

    if (!result.ok) {
      if (result.error === "APPEAL_NOT_FOUND") {
        return json(404, {
          ok: false,
          error: result.error,
        });
      }

      return json(409, {
        ok: false,
        error: result.error,
      });
    }

    return json(200, {
      ok: true,
      appeal: result.appeal,
    });
  } catch {
    return json(500, {
      ok: false,
      error: "APPEAL_REVIEW_FAILED",
    });
  }
}
