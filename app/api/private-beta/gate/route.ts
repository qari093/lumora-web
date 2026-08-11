import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/src/core/auth/authOptions";

export const dynamic = "force-dynamic";

async function evaluateGate() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id?.trim() ?? "";
  const email = session?.user?.email?.trim().toLowerCase() ?? "";

  let allowed = false;
  let reason = "authentication_required";

  if (userId && email) {
    const access = await prisma.privateBetaAccess.findFirst({
      where: {
        OR: [{ userId }, { email }],
        status: "APPROVED",
        revokedAt: null,
        AND: [
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        ]
      },
      select: { id: true }
    });

    allowed = Boolean(access);
    reason = allowed
      ? "approved_allowlist_entry"
      : "manual_approval_required";
  }

  return NextResponse.json(
    {
      ok: true,
      service: "lumora-private-beta-gate",
      status: "controlled_beta_gate_active",
      allowed,
      reason,
      beta: {
        enabled: true,
        mode: "controlled",
        publicAccess: false,
        requiresAuthentication: true,
        requiresAllowlist: true,
        manualApprovalRequired: true,
        inviteDispatchEnabled: false
      },
      ts: Date.now()
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}

export async function GET() {
  return evaluateGate();
}

export async function POST() {
  return evaluateGate();
}
