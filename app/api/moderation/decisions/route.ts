import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  requireUserSession,
  userPrivateNoStoreHeaders,
} from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const decisions = await prisma.moderationDecisionAudit.findMany({
      where: {
        affectedOwnerId: auth.identity.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      select: {
        id: true,
        targetType: true,
        targetId: true,
        action: true,
        outcome: true,
        reason: true,
        source: true,
        createdAt: true,
      },
    });

    return json(200, {
      ok: true,
      decisions,
    });
  } catch (error) {
    console.error('MODERATION_DECISION_HISTORY_READ_FAILED', {
      userId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      error: 'MODERATION_DECISION_HISTORY_READ_FAILED',
    });
  }
}
