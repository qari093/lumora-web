import { NextResponse } from 'next/server';

import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidCode(code: string) {
  return /^avatar_\d{3}$/.test(code);
}

export async function POST(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body?.code || '').trim();

    if (!isValidCode(code)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_code',
        },
        {
          status: 400,
          headers: userPrivateNoStoreHeaders(),
        },
      );
    }

    const response = NextResponse.json(
      {
        ok: true,
        userId: auth.identity.userId,
        code,
      },
      {
        status: 200,
        headers: userPrivateNoStoreHeaders(),
      },
    );

    response.cookies.set('persona_code', code, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 180,
    });

    return response;
  } catch (error: unknown) {
    console.error('[persona/select] failed', error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        ok: false,
        error: 'select_failed',
      },
      {
        status: 500,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  }
}

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  return NextResponse.json(
    {
      ok: true,
      userId: auth.identity.userId,
    },
    {
      headers: userPrivateNoStoreHeaders(),
    },
  );
}
