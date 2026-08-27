import { randomUUID } from 'node:crypto';

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  adminNoStoreHeaders,
  requireAdminSession,
} from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReviewBody = {
  uid?: unknown;
  action?: unknown;
  reason?: unknown;
};

function json(status: number, body: Record<string, unknown>): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: adminNoStoreHeaders(),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: ReviewBody;

  try {
    body = (await request.json()) as ReviewBody;
  } catch {
    return json(400, {
      ok: false,
      route: '/api/admin/moderation/review',
      error: 'invalid_json',
    });
  }

  const uid =
    typeof body.uid === 'string'
      ? body.uid.trim()
      : '';

  const action =
    typeof body.action === 'string'
      ? body.action.trim().toUpperCase()
      : '';

  const reason =
    typeof body.reason === 'string'
      ? body.reason.trim()
      : '';

  if (
    !uid ||
    !reason ||
    (action !== 'APPROVE' && action !== 'REJECT')
  ) {
    return json(400, {
      ok: false,
      route: '/api/admin/moderation/review',
      error: 'invalid_moderation_review',
      required: {
        uid: 'non-empty string',
        action: ['APPROVE', 'REJECT'],
        reason: 'non-empty consequential decision explanation',
      },
    });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const video = await tx.streamVideo.findUnique({
        where: {
          uid,
        },
        select: {
          id: true,
          uid: true,
          ownerId: true,
          status: true,
          readyToStream: true,
        },
      });

      if (!video) {
        return {
          ok: false as const,
          error: 'video_not_found' as const,
        };
      }

      const nextStatus =
        action === 'APPROVE'
          ? 'ready'
          : 'rejected';

      const updated = await tx.streamVideo.update({
        where: {
          uid,
        },
        data:
          action === 'APPROVE'
            ? {
                status: 'ready',
                readyToStream: true,
              }
            : {
                status: 'rejected',
                readyToStream: false,
              },
        select: {
          id: true,
          uid: true,
          ownerId: true,
          status: true,
          readyToStream: true,
        },
      });

      const audit = await tx.moderationDecisionAudit.create({
        data: {
          targetType: 'stream_video',
          targetId: video.uid,
          affectedOwnerId: video.ownerId ?? null,
          action: 'moderation_review',
          outcome: nextStatus,
          reason,
          actorUserId: auth.identity.userId,
          actorEmail: auth.identity.email,
          source: 'admin_moderation_review',
          metadata: {
            previousStatus: video.status,
            previousReadyToStream: video.readyToStream,
          },
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

      return {
        ok: true as const,
        updated,
        audit,
      };
    });

    if (!result.ok) {
      return json(404, {
        ok: false,
        route: '/api/admin/moderation/review',
        error: result.error,
        uid,
      });
    }

    return json(200, {
      ok: true,
      route: '/api/admin/moderation/review',
      source: 'database',
      requestId: randomUUID(),
      action,
      reason,
      item: result.updated,
      audit: result.audit,
      reviewedBy: {
        userId: auth.identity.userId,
        email: auth.identity.email,
      },
    });
  } catch (error) {
    console.error('ADMIN_MODERATION_REVIEW_FAILED', {
      adminUserId: auth.identity.userId,
      uid,
      action,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      route: '/api/admin/moderation/review',
      error: 'admin_moderation_review_failed',
    });
  }
}
