import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';
import { NextResponse } from 'next/server';
import { availablePayoutMethods } from '@/src/core/zenwallet/creator/creatorSeparation';

async function GETImplementation() {
  return NextResponse.json({ ok: true, payoutMethods: availablePayoutMethods('DE') });
}

export async function GET(): Promise<Response> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const response = await GETImplementation();

  for (const [name, value] of Object.entries(userPrivateNoStoreHeaders())) {
    response.headers.set(name, value);
  }

  return response;
}
