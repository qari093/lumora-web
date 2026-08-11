import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function safeCount(operation: () => Promise<number>): Promise<number> {
  try {
    return Number(await operation());
  } catch {
    return 0;
  }
}

async function safeAggregate<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

export async function GET() {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const windowMinutes = 60;
    const since = new Date(Date.now() - windowMinutes * 60_000);

    const wallets = await safeAggregate(
      async () => {
        const rows = await prisma.wallet.findMany({
          select: {
            balanceCents: true,
          },
        });

        return {
          count: rows.length,
          totalCents: rows.reduce((sum, row) => sum + Number(row.balanceCents || 0), 0),
        };
      },
      {
        count: 0,
        totalCents: 0,
      },
    );

    const [campaigns, kycPending, fraudLastHr, eventsLastHr, convLastHr] = await Promise.all([
      safeCount(() => prisma.campaign.count()),
      safeCount(() =>
        prisma.kycRequest.count({
          where: {
            status: 'PENDING',
          },
        }),
      ),
      safeCount(() =>
        prisma.fraudLog.count({
          where: {
            createdAt: {
              gte: since,
            },
          },
        }),
      ),
      safeCount(() =>
        prisma.adEvent.count({
          where: {
            createdAt: {
              gte: since,
            },
          },
        }),
      ),
      safeCount(() =>
        prisma.adConversion.count({
          where: {
            createdAt: {
              gte: since,
            },
          },
        }),
      ),
    ]);

    return NextResponse.json(
      {
        ok: true,
        route: '/api/admin/overview',
        source: 'database',
        admin: auth.identity,
        windowMinutes,
        wallets,
        campaigns,
        kycPending,
        activity: {
          eventsLastHr,
          convLastHr,
          fraudLastHr,
        },
      },
      {
        status: 200,
        headers: adminNoStoreHeaders(),
      },
    );
  } catch (error) {
    console.error('ADMIN_OVERVIEW_READ_FAILED', {
      adminUserId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        route: '/api/admin/overview',
        error: 'admin_overview_read_failed',
      },
      {
        status: 500,
        headers: adminNoStoreHeaders(),
      },
    );
  }
}
