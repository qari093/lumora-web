import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
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

  try {
    const { targetTier, note }: Body = await req.json().catch(() => ({}) as Body);

    if (!targetTier || !ALLOWED_TIERS.has(targetTier)) {
      return json(
        {
          ok: false,
          error: `targetTier must be one of: ${[...ALLOWED_TIERS].join(', ')}`,
        },
        400,
      );
    }

    const ownerId = auth.identity.userId;

    const account =
      (await prisma.userAccount.findFirst({
        where: {
          ownerId,
        },
      })) ??
      (await prisma.userAccount.create({
        data: {
          ownerId,
          tier: 'TIER0',
          status: 'ACTIVE',
        },
      }));

    const submission = await prisma.kycSubmission.create({
      data: {
        ownerId,
        status: 'SUBMITTED',
        requestedTier: targetTier,
        note: note?.slice(0, 1000) ?? null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    await prisma.userAccount.update({
      where: {
        id: account.id,
      },
      data: {
        status: 'PENDING',
      },
    });

    return json({
      ok: true,
      ownerId,
      requestedTier: targetTier,
      currentTier: account.tier,
      newStatus: 'PENDING',
      submissionId: submission.id,
      requestId: crypto.randomUUID(),
    });
  } catch (error: unknown) {
    console.error('[account/upgrade] failed', error instanceof Error ? error.message : error);

    return json(
      {
        ok: false,
        error: 'account_upgrade_failed',
      },
      500,
    );
  }
}
