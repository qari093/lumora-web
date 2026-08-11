import { randomUUID } from 'node:crypto';

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReviewBody = {
  uid?: unknown;
  action?: unknown;
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

  const uid = typeof body.uid === 'string' ? body.uid.trim() : '';

  const action = typeof body.action === 'string' ? body.action.trim().toUpperCase() : '';

  if (!uid || (action !== 'APPROVE' && action !== 'REJECT')) {
    return json(400, {
      ok: false,
      route: '/api/admin/moderation/review',
      error: 'invalid_moderation_review',
      required: {
        uid: 'non-empty string',
        action: ['APPROVE', 'REJECT'],
      },
    });
  }

  try {
    const video = await prisma.streamVideo.findUnique({
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
      return json(404, {
        ok: false,
        route: '/api/admin/moderation/review',
        error: 'video_not_found',
        uid,
      });
    }

    const updated = await prisma.streamVideo.update({
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

    return json(200, {
      ok: true,
      route: '/api/admin/moderation/review',
      source: 'database',
      requestId: randomUUID(),
      action,
      item: updated,
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
