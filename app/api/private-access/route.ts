import { NextResponse } from 'next/server';

import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(status: number, body: Record<string, unknown>): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function GET(): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  return json(200, {
    ok: true,
    route: '/api/private-access',
    identity: {
      userId: auth.identity.userId,
      email: auth.identity.email,
    },
    access: {
      authenticated: true,
      privateBetaEligible: true,
    },
  });
}

export async function POST(): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  return json(200, {
    ok: true,
    route: '/api/private-access',
    identity: {
      userId: auth.identity.userId,
      email: auth.identity.email,
    },
    access: {
      authenticated: true,
      privateBetaEligible: true,
    },
  });
}
