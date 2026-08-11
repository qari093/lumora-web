import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type TesterSummary = {
  testerId: string;
  events: number;
  lastOccurredAt: Date;
  pages: Record<string, number>;
};

export async function GET(): Promise<NextResponse> {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const rows = await prisma.observabilityEvent.findMany({
      where: {
        testerId: {
          not: null,
        },
      },
      orderBy: {
        occurredAt: 'desc',
      },
      take: 10_000,
      select: {
        testerId: true,
        eventType: true,
        route: true,
        occurredAt: true,
      },
    });

    const byTester = new Map<string, TesterSummary>();

    for (const row of rows) {
      const testerId = row.testerId?.trim();

      if (!testerId) {
        continue;
      }

      const summary = byTester.get(testerId) ?? {
        testerId,
        events: 0,
        lastOccurredAt: row.occurredAt,
        pages: {},
      };

      summary.events += 1;

      if (row.occurredAt.getTime() > summary.lastOccurredAt.getTime()) {
        summary.lastOccurredAt = row.occurredAt;
      }

      if (row.eventType === 'route_view' && row.route) {
        summary.pages[row.route] = (summary.pages[row.route] ?? 0) + 1;
      }

      byTester.set(testerId, summary);
    }

    const testers = Array.from(byTester.values())
      .sort((left, right) => right.lastOccurredAt.getTime() - left.lastOccurredAt.getTime())
      .slice(0, 200)
      .map((summary) => ({
        ...summary,
        lastOccurredAt: summary.lastOccurredAt.toISOString(),
      }));

    return NextResponse.json(
      {
        ok: true,
        route: '/api/admin/testers/summary',
        source: 'database',
        admin: auth.identity,
        totals: {
          testers: byTester.size,
          events: rows.length,
        },
        testers,
      },
      {
        status: 200,
        headers: adminNoStoreHeaders(),
      },
    );
  } catch (error) {
    console.error('ADMIN_TESTER_SUMMARY_FAILED', {
      adminUserId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        route: '/api/admin/testers/summary',
        error: 'admin_tester_summary_failed',
      },
      {
        status: 500,
        headers: adminNoStoreHeaders(),
      },
    );
  }
}
