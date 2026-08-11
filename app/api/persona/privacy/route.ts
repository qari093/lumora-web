import { NextResponse } from 'next/server';

import { sanitizePersonaPrivacy } from '@/lib/persona/privacy';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const body = await req.json().catch(() => ({}));
  const privacy = sanitizePersonaPrivacy(body as never);

  return NextResponse.json(
    {
      ok: true,
      userId: auth.identity.userId,
      privacy,
    },
    {
      headers: userPrivateNoStoreHeaders(),
    },
  );
}
