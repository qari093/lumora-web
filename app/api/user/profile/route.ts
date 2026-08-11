import { NextResponse } from 'next/server';

import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const displayName = auth.identity.email.split('@')[0]?.trim() || 'Lumora User';

  return NextResponse.json(
    {
      ok: true,
      profile: {
        id: auth.identity.userId,
        email: auth.identity.email,
        displayName,
        role: auth.identity.role,
      },
      source: 'canonical_verified_user_session',
      ts: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        ...userPrivateNoStoreHeaders(),
        'x-lumora-sec': '1',
      },
    },
  );
}
