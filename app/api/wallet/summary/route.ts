import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        ownerId: auth.identity.userId,
      },
      select: {
        id: true,
        ownerId: true,
        currency: true,
        balanceCents: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        route: '/api/wallet/summary',
        source: 'database',
        wallet: wallet
          ? {
              id: wallet.id,
              ownerId: wallet.ownerId,
              currency: wallet.currency,
              balanceCents: Number(wallet.balanceCents),
              balanceEuros: Number((Number(wallet.balanceCents) / 100).toFixed(2)),
              updatedAt: wallet.updatedAt,
            }
          : null,
      },
      {
        status: 200,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  } catch (error) {
    console.error('USER_WALLET_SUMMARY_READ_FAILED', {
      userId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        route: '/api/wallet/summary',
        error: 'wallet_summary_failed',
      },
      {
        status: 500,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  }
}
