import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  requireUserSession,
  userPrivateNoStoreHeaders
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

export async function GET(
  _req: Request,
  ctx: {
    params:
      | { ownerId: string; refType: string; refId: string }
      | Promise<{ ownerId: string; refType: string; refId: string }>;
  },
) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { ownerId, refType, refId } = await Promise.resolve(ctx.params);

    if (ownerId !== auth.identity.userId) {
      return json(403, {
        ok: false,
        error: "forbidden_owner_scope",
      });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        ownerId: auth.identity.userId,
        currency: "EUR",
      },
      select: {
        id: true,
      },
    });

    if (!wallet) {
      return json(404, {
        ok: false,
        error: "WALLET_NOT_FOUND",
      });
    }

    const original = await prisma.walletLedger.findFirst({
      where: {
        walletId: wallet.id,
        refType,
        refId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        type: true,
        amountCents: true,
        createdAt: true,
      },
    });

    if (!original) {
      return json(404, {
        ok: false,
        error: "ORIGINAL_NOT_FOUND",
      });
    }

    const legacyRefId = `${refType}:${refId}`;

    const refunds = await prisma.walletLedger.findMany({
      where: {
        walletId: wallet.id,
        refType: "REFUND",
        OR: [
          { refId: legacyRefId },
          { note: { startsWith: `refund:${legacyRefId}` } },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        amountCents: true,
        refId: true,
        note: true,
        createdAt: true,
      },
    });

    const refundedSoFarCents = refunds.reduce(
      (sum, refund) => sum + refund.amountCents,
      0,
    );

    const remainingRefundableCents = Math.max(
      original.amountCents - refundedSoFarCents,
      0,
    );

    return json(200, {
      ok: true,
      ownerId: auth.identity.userId,
      original: {
        type: original.type,
        amountCents: original.amountCents,
        refType,
        refId,
        createdAt: original.createdAt,
      },
      refunds,
      totals: {
        originalCents: original.amountCents,
        refundedSoFarCents,
        remainingRefundableCents,
      },
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "refund_history_lookup_failed",
    });
  }
}
