import { NextRequest, NextResponse } from 'next/server';

import { emitNotification, getLowBalanceThreshold } from '@/src/lib/notify/store';
import { getWallet } from '@/src/lib/wallet/mem';
import { reqId } from '@/src/lib/reqid';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const requestId = reqId();
  const ownerId = auth.identity.userId;
  const threshold = getLowBalanceThreshold(ownerId);
  const balance = getWallet(ownerId).euros;

  if (threshold === null) {
    return NextResponse.json(
      {
        ok: true,
        emitted: false,
        reason: 'NO_SUBSCRIPTION',
        threshold: null,
        balance,
        requestId,
      },
      {
        status: 200,
        headers: {
          ...userPrivateNoStoreHeaders(),
          'x-request-id': requestId,
        },
      },
    );
  }

  if (balance < threshold) {
    const title = `Low balance: €${balance.toFixed(2)} ` + `(< €${threshold.toFixed(2)})`;

    const notification = emitNotification(
      ownerId,
      'low_balance',
      title,
      'Top up to keep campaigns running',
      {
        balance,
        threshold,
      },
    );

    return NextResponse.json(
      {
        ok: true,
        emitted: true,
        notification,
        requestId,
      },
      {
        status: 200,
        headers: {
          ...userPrivateNoStoreHeaders(),
          'x-request-id': requestId,
        },
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      emitted: false,
      reason: 'ABOVE_THRESHOLD',
      threshold,
      balance,
      requestId,
    },
    {
      status: 200,
      headers: {
        ...userPrivateNoStoreHeaders(),
        'x-request-id': requestId,
      },
    },
  );
}
