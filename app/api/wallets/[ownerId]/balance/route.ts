import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    ownerId: string;
  }>;
};

function json(status: number, body: Record<string, unknown>): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function GET(_request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const params = await context.params;
  const requestedOwnerId = params.ownerId?.trim() ?? '';

  if (!requestedOwnerId) {
    return json(400, {
      ok: false,
      route: '/api/wallets/[ownerId]/balance',
      error: 'owner_id_required',
    });
  }

  if (requestedOwnerId !== auth.identity.userId) {
    return json(403, {
      ok: false,
      route: '/api/wallets/[ownerId]/balance',
      error: 'wallet_ownership_required',
    });
  }

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        ownerId: auth.identity.userId,
        currency: 'EUR',
      },
      select: {
        id: true,
        ownerId: true,
        currency: true,
        balanceCents: true,
        updatedAt: true,
      },
    });

    if (!wallet) {
      return json(404, {
        ok: false,
        route: '/api/wallets/[ownerId]/balance',
        error: 'wallet_not_found',
      });
    }

    return json(200, {
      ok: true,
      route: '/api/wallets/[ownerId]/balance',
      walletId: wallet.id,
      ownerId: wallet.ownerId,
      currency: wallet.currency,
      balanceCents: Number(wallet.balanceCents),
      balanceEuros: Number((Number(wallet.balanceCents) / 100).toFixed(2)),
      updatedAt: wallet.updatedAt,
    });
  } catch (error) {
    console.error('USER_WALLET_BALANCE_READ_FAILED', {
      userId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      route: '/api/wallets/[ownerId]/balance',
      error: 'wallet_balance_read_failed',
    });
  }
}
