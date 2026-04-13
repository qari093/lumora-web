import { NextRequest, NextResponse } from "next/server";
import { createModerationAuditEvent } from "@/lib/moderation/auditLog";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.action || !body?.contentId || !body?.actor || !body?.outcome) {
      return NextResponse.json(
        { ok: false, error: "missing_audit_fields" },
        { status: 400 }
      );
    }

    const allowedOutcomes = new Set(["allow", "review", "block"]);
    if (!allowedOutcomes.has(body.outcome)) {
      return NextResponse.json(
        { ok: false, error: "invalid_outcome" },
        { status: 400 }
      );
    }

    const event = createModerationAuditEvent({
      action: String(body.action),
      contentId: String(body.contentId),
      actor: String(body.actor),
      outcome: body.outcome,
      reason: typeof body.reason === "string" ? body.reason : undefined,
    });

    console.log("LUMORA_MOD_AUDIT", JSON.stringify(event));

    return NextResponse.json({
      ok: true,
      source: "lumora_moderation_audit_v1",
      event,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "audit_log_failed" },
      { status: 500 }
    );
  }
}
