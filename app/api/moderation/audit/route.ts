import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  adminNoStoreHeaders,
  requireAdminSession,
} from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AuditBody = {
  action?: unknown;
  contentId?: unknown;
  outcome?: unknown;
  reason?: unknown;
  actor?: unknown;
};

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: adminNoStoreHeaders(),
  });
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  const body = (await req.json().catch(() => null)) as AuditBody | null;

  const action =
    typeof body?.action === 'string'
      ? body.action.trim()
      : '';

  const contentId =
    typeof body?.contentId === 'string'
      ? body.contentId.trim()
      : '';

  const outcome =
    typeof body?.outcome === 'string'
      ? body.outcome.trim().toLowerCase()
      : '';

  const reason =
    typeof body?.reason === 'string'
      ? body.reason.trim()
      : '';

  if (
    !action ||
    !contentId ||
    !reason ||
    !['allow', 'review', 'block'].includes(outcome)
  ) {
    return json(400, {
      ok: false,
      error: 'invalid_audit_request',
    });
  }

  /*
   * `actor` from the caller is intentionally ignored.
   * Consequential authority always comes from the authenticated admin session.
   */
  void body?.actor;

  try {
    const target = await prisma.streamVideo.findUnique({
      where: {
        uid: contentId,
      },
      select: {
        uid: true,
        ownerId: true,
      },
    });

    const event = await prisma.moderationDecisionAudit.create({
      data: {
        targetType: target ? 'stream_video' : 'moderation_content',
        targetId: contentId,
        affectedOwnerId: target?.ownerId ?? null,
        action,
        outcome,
        reason,
        actorUserId: auth.identity.userId,
        actorEmail: auth.identity.email,
        source: 'moderation_audit_api',
      },
      select: {
        id: true,
        targetType: true,
        targetId: true,
        action: true,
        outcome: true,
        reason: true,
        createdAt: true,
      },
    });

    return json(201, {
      ok: true,
      source: 'database',
      event,
    });
  } catch (error) {
    console.error('MODERATION_AUDIT_WRITE_FAILED', {
      adminUserId: auth.identity.userId,
      contentId,
      action,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      error: 'audit_log_failed',
    });
  }
}
