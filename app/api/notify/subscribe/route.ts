import { NextRequest, NextResponse } from 'next/server';

import { upsertSubscription } from '@/src/lib/notify/store';
import { reqId } from '@/src/lib/reqid';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SubscriptionBody = {
  kind?: unknown;
  thresholdEuros?: unknown;
};

const ALLOWED_KINDS = new Set(['low_balance', 'spend_spike', 'approval', 'generic']);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const requestId = reqId();

  let body: SubscriptionBody;

  try {
    body = (await request.json()) as SubscriptionBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_json',
        requestId,
      },
      {
        status: 400,
        headers: {
          ...userPrivateNoStoreHeaders(),
          'x-request-id': requestId,
        },
      },
    );
  }

  const kind = typeof body.kind === 'string' ? body.kind.trim().toLowerCase() : '';

  if (!ALLOWED_KINDS.has(kind)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_notification_kind',
        requestId,
      },
      {
        status: 422,
        headers: {
          ...userPrivateNoStoreHeaders(),
          'x-request-id': requestId,
        },
      },
    );
  }

  const threshold =
    typeof body.thresholdEuros === 'number' && Number.isFinite(body.thresholdEuros)
      ? body.thresholdEuros
      : null;

  if (threshold !== null && threshold < 0) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_threshold',
        requestId,
      },
      {
        status: 422,
        headers: {
          ...userPrivateNoStoreHeaders(),
          'x-request-id': requestId,
        },
      },
    );
  }

  const subscription = upsertSubscription(
    auth.identity.userId,
    kind as 'low_balance' | 'spend_spike' | 'approval' | 'generic',
    threshold,
  );

  return NextResponse.json(
    {
      ok: true,
      route: '/api/notify/subscribe',
      subscription,
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
