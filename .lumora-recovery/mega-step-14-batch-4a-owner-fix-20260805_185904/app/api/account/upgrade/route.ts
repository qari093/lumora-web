import { NextResponse } from 'next/server';

import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TIERS = new Set(['TIER1', 'TIER2', 'TIER3']);

type Body = {
  targetTier?: string;
  note?: string;
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function POST(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const body: Body = await req.json().catch(() => ({}) as Body);
  const targetTier =
    typeof body.targetTier === 'string' ? body.targetTier.trim().toUpperCase() : '';

  if (!ALLOWED_TIERS.has(targetTier)) {
    return json(
      {
        ok: false,
        error: `targetTier must be one of: ${[...ALLOWED_TIERS].join(', ')}`,
      },
      400,
    );
  }

  /*
   * The repository currently has no UserAccount or KycSubmission Prisma models.
   * Refuse the mutation explicitly rather than pretending that an upgrade was
   * persisted or writing to an unrelated model.
   */
  return json(
    {
      ok: false,
      error: 'account_upgrade_persistence_unavailable',
      userId: auth.identity.userId,
      requestedTier: targetTier,
      retryable: false,
    },
    503,
  );
}
