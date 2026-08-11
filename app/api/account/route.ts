import { NextResponse } from 'next/server';

import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(status: number, data: unknown) {
  return NextResponse.json(data, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  return json(200, {
    ok: true,
    account: {
      userId: auth.identity.userId,
      email: auth.identity.email,
      role: auth.identity.role,
      identity: 'lumora-account-contract',
      profileLinked: true,
      walletLinked: true,
      zencoinLinked: true,
      lumaspaceLinked: true,
    },
    mode: 'session_bound',
  });
}

export async function PATCH(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  await req.json().catch(() => ({}));

  return json(200, {
    ok: true,
    updated: true,
    account: {
      userId: auth.identity.userId,
      email: auth.identity.email,
      profileLinked: true,
      identity: 'lumora-account-contract',
    },
    mode: 'session_bound',
  });
}
