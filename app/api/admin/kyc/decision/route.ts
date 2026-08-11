import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DecisionBody = {
  requestId?: unknown;
  decision?: unknown;
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

  let body: DecisionBody;

  try {
    body = (await request.json()) as DecisionBody;
  } catch {
    return json(400, {
      ok: false,
      route: '/api/admin/kyc/decision',
      error: 'invalid_json',
    });
  }

  const requestId = typeof body.requestId === 'string' ? body.requestId.trim() : '';

  const decision = typeof body.decision === 'string' ? body.decision.trim().toUpperCase() : '';

  const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 2000) || null : null;

  if (!requestId || (decision !== 'APPROVED' && decision !== 'REJECTED')) {
    return json(400, {
      ok: false,
      route: '/api/admin/kyc/decision',
      error: 'invalid_decision_request',
      required: {
        requestId: 'non-empty string',
        decision: ['APPROVED', 'REJECTED'],
      },
    });
  }

  try {
    const existing = await prisma.kycRequest.findUnique({
      where: {
        id: requestId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      return json(404, {
        ok: false,
        route: '/api/admin/kyc/decision',
        error: 'kyc_request_not_found',
      });
    }

    if (existing.status === 'APPROVED' || existing.status === 'REJECTED') {
      return json(409, {
        ok: false,
        route: '/api/admin/kyc/decision',
        error: 'kyc_request_already_decided',
        status: existing.status,
      });
    }

    const updated = await prisma.kycRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: decision,
        reason,
        adminUser: auth.identity.email,
      },
    });

    return json(200, {
      ok: true,
      route: '/api/admin/kyc/decision',
      source: 'database',
      request: updated,
      decidedBy: {
        userId: auth.identity.userId,
        email: auth.identity.email,
      },
    });
  } catch (error) {
    console.error('ADMIN_KYC_DECISION_FAILED', {
      adminUserId: auth.identity.userId,
      requestId,
      decision,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      route: '/api/admin/kyc/decision',
      error: 'admin_kyc_decision_failed',
    });
  }
}
