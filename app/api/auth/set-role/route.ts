import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEVELOPMENT_ROLES = new Set(['admin', 'moderator', 'creator', 'advertiser', 'user', 'guest']);

function noStoreHeaders(): Record<string, string> {
  return {
    'cache-control': 'no-store, max-age=0',
  };
}

function firstClientAddress(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    ''
  );
}

function isLocalRequest(request: Request): boolean {
  const hostname = (request.headers.get('host') || '').toLowerCase().split(':')[0];

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true;
  }

  const address = firstClientAddress(request);

  return (
    address === '127.0.0.1' ||
    address === '::1' ||
    /^10\./.test(address) ||
    /^192\.168\./.test(address) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(address)
  );
}

function clearDevelopmentRoleCookies(response: NextResponse): void {
  const secure = process.env.NODE_ENV === 'production';

  for (const name of ['role', 'name', 'isCreator']) {
    response.cookies.set(name, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 0,
    });
  }
}

function disabledResponse(): NextResponse {
  const response = NextResponse.json(
    {
      ok: false,
      error: 'not_found',
    },
    {
      status: 404,
      headers: noStoreHeaders(),
    },
  );

  clearDevelopmentRoleCookies(response);

  return response;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const developmentSwitchEnabled =
    process.env.NODE_ENV !== 'production' &&
    process.env.LUMORA_DEV_ROLE_SWITCH_ENABLED === '1' &&
    isLocalRequest(request);

  if (!developmentSwitchEnabled) {
    return disabledResponse();
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_json',
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  const role =
    typeof payload === 'object' &&
    payload !== null &&
    'role' in payload &&
    typeof payload.role === 'string'
      ? payload.role.trim().toLowerCase()
      : '';

  if (!DEVELOPMENT_ROLES.has(role)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_role',
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  const response = NextResponse.json(
    {
      ok: true,
      role,
      mode: 'local_development_only',
    },
    {
      status: 200,
      headers: noStoreHeaders(),
    },
  );

  response.cookies.set('role', role, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60,
  });

  return response;
}
