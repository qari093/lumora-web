import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/src/core/auth/authOptions';

export type UserSessionIdentity = {
  userId: string;
  email: string;
  role: string;
};

export type UserSessionResult =
  | {
      ok: true;
      identity: UserSessionIdentity;
    }
  | {
      ok: false;
      response: NextResponse;
    };

export function userPrivateNoStoreHeaders(): Record<string, string> {
  return {
    'cache-control': 'private, no-store, max-age=0',
  };
}

function deny(
  status: 401 | 403,
  error: 'authentication_required' | 'verified_account_required',
): UserSessionResult {
  return {
    ok: false,
    response: NextResponse.json(
      {
        ok: false,
        error,
      },
      {
        status,
        headers: userPrivateNoStoreHeaders(),
      },
    ),
  };
}

export async function requireUserSession(): Promise<UserSessionResult> {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id?.trim() ?? '';
  const sessionEmail = session?.user?.email?.trim().toLowerCase() ?? '';

  if (!userId || !sessionEmail) {
    return deny(401, 'authentication_required');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      emailVerified: true,
    },
  });

  if (!user || user.email.trim().toLowerCase() !== sessionEmail || !user.emailVerified) {
    return deny(403, 'verified_account_required');
  }

  return {
    ok: true,
    identity: {
      userId: user.id,
      email: user.email.trim().toLowerCase(),
      role: String(user.role),
    },
  };
}
