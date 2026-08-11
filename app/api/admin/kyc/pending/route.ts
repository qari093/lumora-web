import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const rows = await prisma.kycSubmission.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        ownerId: true,
        status: true,
        requestedTier: true,
        createdAt: true,
      },
    });

    const pendingStatuses = new Set(['PENDING', 'Pending', 'pending']);

    const items = rows.filter((row) => pendingStatuses.has(String(row.status)));

    return NextResponse.json(
      {
        ok: true,
        route: '/api/admin/kyc/pending',
        admin: auth.identity,
        count: items.length,
        items,
      },
      {
        status: 200,
        headers: adminNoStoreHeaders(),
      },
    );
  } catch (error) {
    console.error('ADMIN_KYC_PENDING_READ_FAILED', {
      adminUserId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        route: '/api/admin/kyc/pending',
        error: 'admin_kyc_pending_read_failed',
      },
      {
        status: 500,
        headers: adminNoStoreHeaders(),
      },
    );
  }
}
