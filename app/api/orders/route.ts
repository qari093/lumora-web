import { NextResponse } from 'next/server';

import { listOrders } from '@/src/core/zendoro/api/store';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  return NextResponse.json(
    {
      ok: true,
      route: '/api/orders',
      data: listOrders(auth.identity.userId),
    },
    {
      status: 200,
      headers: userPrivateNoStoreHeaders(),
    },
  );
}
