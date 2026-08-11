import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/src/core/auth/authOptions";

export const dynamic = "force-dynamic";

function accessDenied(reason: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      service: "lumora-private-beta-access",
      allowed: false,
      reason,
      mode: "controlled",
      ts: Date.now()
    },
    {
      status,
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}

async function evaluateAuthenticatedAccess() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id?.trim() ?? "";
  const email = session?.user?.email?.trim().toLowerCase() ?? "";

  if (!userId || !email) {
    return accessDenied("authentication_required", 401);
  }

  const access = await prisma.privateBetaAccess.findFirst({
    where: {
      OR: [{ userId }, { email }]
    },
    select: {
      id: true,
      userId: true,
      email: true,
      status: true,
      approvedAt: true,
      revokedAt: true,
      expiresAt: true
    }
  });

  if (!access) {
    return accessDenied("allowlist_entry_required", 403);
  }

  if (access.status !== "APPROVED") {
    return accessDenied(
      access.status === "REVOKED" ? "access_revoked" : "manual_approval_required",
      403
    );
  }

  if (access.revokedAt) {
    return accessDenied("access_revoked", 403);
  }

  if (access.expiresAt && access.expiresAt.getTime() <= Date.now()) {
    return accessDenied("access_expired", 403);
  }

  if (!access.userId) {
    await prisma.privateBetaAccess.update({
      where: { id: access.id },
      data: { userId }
    });
  }

  return NextResponse.json(
    {
      ok: true,
      service: "lumora-private-beta-access",
      status: "approved",
      allowed: true,
      reason: "approved_allowlist_entry",
      mode: "controlled",
      access: {
        email: access.email,
        approvedAt: access.approvedAt,
        expiresAt: access.expiresAt
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
  return evaluateAuthenticatedAccess();
}

export async function POST() {
  return evaluateAuthenticatedAccess();
}
