import { NextRequest, NextResponse } from 'next/server';

import { emitNotification } from '@/src/lib/notify/store';
import { reqId } from '@/src/lib/reqid';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type EmitBody = {
  kind?: unknown;
  title?: unknown;
  body?: unknown;
  meta?: unknown;
};

const ALLOWED_KINDS = new Set(['low_balance', 'spend_spike', 'approval', 'generic']);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const requestId = reqId();

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        ok: false,
        error: 'disabled_in_production',
        requestId,
      },
      {
        status: 403,
        headers: {
          ...userPrivateNoStoreHeaders(),
          'x-request-id': requestId,
        },
      },
    );
  }

  let body: EmitBody;

  try {
    body = (await request.json()) as EmitBody;
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

  const title = typeof body.title === 'string' ? body.title.trim() : '';

  if (!ALLOWED_KINDS.has(kind) || !title) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_notification',
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

  const notification = emitNotification(
    auth.identity.userId,
    kind as 'low_balance' | 'spend_spike' | 'approval' | 'generic',
    title,
    typeof body.body === 'string' ? body.body : null,
    body.meta,
  );

  return NextResponse.json(
    {
      ok: true,
      route: '/api/notify/emit',
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
