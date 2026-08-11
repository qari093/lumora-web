import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/src/core/auth/authOptions';

export type AdminSessionIdentity = {
  userId: string;
  email: string;
  role: 'admin';
};

export type AdminSessionResult =
  | {
      ok: true;
      identity: AdminSessionIdentity;
    }
  | {
      ok: false;
      response: NextResponse;
    };

function noStoreHeaders(): Record<string, string> {
  return {
    'cache-control': 'no-store, max-age=0',
  };
}

function denied(
  status: 401 | 403,
  error: 'authentication_required' | 'admin_required',
): AdminSessionResult {
  return {
    ok: false,
    response: NextResponse.json(
      { ok: false, error },
      {
        status,
        headers: noStoreHeaders(),
      },
    ),
  };
}

export async function requireAdminSession(): Promise<AdminSessionResult> {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id?.trim() ?? '';
  const sessionEmail = session?.user?.email?.trim().toLowerCase() ?? '';

  if (!userId || !sessionEmail) {
    return denied(401, 'authentication_required');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      emailVerified: true,
    },
  });

  if (
    !user ||
    user.email.toLowerCase() !== sessionEmail ||
    user.role !== 'admin' ||
    !user.emailVerified
  ) {
    return denied(403, 'admin_required');
  }

  return {
    ok: true,
    identity: {
      userId: user.id,
      email: user.email.toLowerCase(),
      role: 'admin',
    },
  };
}

export function adminNoStoreHeaders(): Record<string, string> {
  return noStoreHeaders();
}
