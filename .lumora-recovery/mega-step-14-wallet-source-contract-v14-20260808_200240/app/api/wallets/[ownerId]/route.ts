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
      route: '/api/wallets/[ownerId]',
      error: 'owner_id_required',
    });
  }

  if (requestedOwnerId !== auth.identity.userId) {
    return json(403, {
      ok: false,
      route: '/api/wallets/[ownerId]',
      error: 'wallet_ownership_required',
    });
  }

  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        ownerId: auth.identity.userId,
      },
    });

    return json(200, {
      ok: true,
      route: '/api/wallets/[ownerId]',
      wallet,
    });
  } catch (error) {
    console.error('USER_WALLET_READ_FAILED', {
      userId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      route: '/api/wallets/[ownerId]',
      error: 'wallet_read_failed',
    });
  }
}
