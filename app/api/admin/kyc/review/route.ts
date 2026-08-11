import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReviewBody = {
  submissionId?: unknown;
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
      route: '/api/admin/kyc/review',
      error: 'invalid_json',
    });
  }

  const submissionId = typeof body.submissionId === 'string' ? body.submissionId.trim() : '';

  const action = typeof body.action === 'string' ? body.action.trim().toUpperCase() : '';

  if (!submissionId || (action !== 'APPROVE' && action !== 'REJECT')) {
    return json(400, {
      ok: false,
      route: '/api/admin/kyc/review',
      error: 'invalid_review_request',
      required: {
        submissionId: 'non-empty string',
        action: ['APPROVE', 'REJECT'],
      },
    });
  }

  try {
    const submission = await prisma.kycSubmission.findUnique({
      where: {
        id: submissionId,
      },
    });

    if (!submission) {
      return json(404, {
        ok: false,
        route: '/api/admin/kyc/review',
        error: 'submission_not_found',
      });
    }

    if (String(submission.status).toUpperCase() !== 'PENDING') {
      return json(409, {
        ok: false,
        route: '/api/admin/kyc/review',
        error: 'submission_already_reviewed',
        status: submission.status,
      });
    }

    if (action === 'APPROVE') {
      await prisma.$transaction(async (transaction) => {
        await transaction.kycSubmission.update({
          where: {
            id: submission.id,
          },
          data: {
            status: 'APPROVED',
          },
        });

        await transaction.userAccount.upsert({
          where: {
            ownerId: submission.ownerId,
          },
          update: {
            status: 'ACTIVE',
            tier: submission.requestedTier ?? 'TIER1',
          },
          create: {
            ownerId: submission.ownerId,
            status: 'ACTIVE',
            tier: submission.requestedTier ?? 'TIER1',
          },
        });
      });
    } else {
      await prisma.kycSubmission.update({
        where: {
          id: submission.id,
        },
        data: {
          status: 'REJECTED',
        },
      });
    }

    return json(200, {
      ok: true,
      route: '/api/admin/kyc/review',
      source: 'database',
      action,
      ownerId: submission.ownerId,
      submissionId: submission.id,
      reviewedBy: {
        userId: auth.identity.userId,
        email: auth.identity.email,
      },
    });
  } catch (error) {
    console.error('ADMIN_KYC_REVIEW_FAILED', {
      adminUserId: auth.identity.userId,
      submissionId,
      action,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      route: '/api/admin/kyc/review',
      error: 'admin_kyc_review_failed',
    });
  }
}
