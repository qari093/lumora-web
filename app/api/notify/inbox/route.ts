import { NextRequest, NextResponse } from 'next/server';

import { listInbox, listSubscriptions } from '@/src/lib/notify/store';
import { reqId } from '@/src/lib/reqid';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const requestId = reqId();
  const limitRaw = Number(request.nextUrl.searchParams.get('limit') ?? '50');
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(200, Math.floor(limitRaw))) : 50;

  return NextResponse.json(
    {
      ok: true,
      route: '/api/notify/inbox',
      ownerId: auth.identity.userId,
      subscriptions: listSubscriptions(auth.identity.userId),
      inbox: listInbox(auth.identity.userId, limit),
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
