import { NextResponse } from 'next/server';

import { createModerationReport } from '@/src/core/moderation-production/report';
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

export async function POST(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const body = await req.json().catch(() => null);

  const targetId =
    typeof body?.targetId === 'string'
      ? body.targetId.trim()
      : '';

  const category =
    typeof body?.category === 'string'
      ? body.category.trim()
      : '';

  const suppliedReporterId =
    typeof body?.reporterId === 'string'
      ? body.reporterId.trim()
      : '';

  if (
    suppliedReporterId &&
    suppliedReporterId !== auth.identity.userId
  ) {
    return json(403, {
      ok: false,
      error: 'FORBIDDEN_REPORTER_SCOPE',
    });
  }

  if (!targetId || !category) {
    return json(400, {
      ok: false,
      error: 'INVALID_REPORT_REQUEST',
    });
  }

  return json(201, {
    ok: true,
    report: createModerationReport({
      reporterId: auth.identity.userId,
      targetId,
      category,
    }),
  });
}
