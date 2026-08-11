import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? '20');

  if (!Number.isInteger(parsed)) {
    return 20;
  }

  return Math.min(Math.max(parsed, 1), 50);
}

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get('limit'));

    const rows = await prisma.streamVideo.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        uid: true,
        ownerId: true,
        durationSec: true,
        sizeBytes: true,
        status: true,
        readyToStream: true,
        createdAt: true,
        playbackId: true,
        thumbnailUrl: true,
        meta: true,
      },
    });

    const items = rows.map((row) => ({
      id: row.id,
      uid: row.uid,
      ownerId: row.ownerId,
      durationSec: row.durationSec ?? null,
      sizeBytes: row.sizeBytes === null ? null : Number(row.sizeBytes),
      status: row.status,
      readyToStream: row.readyToStream,
      createdAt: row.createdAt.toISOString(),
      playbackId: row.playbackId ?? null,
      thumbnailUrl: row.thumbnailUrl ?? null,
      meta: row.meta ?? null,
    }));

    return NextResponse.json(
      {
        ok: true,
        route: '/api/admin/moderation/list',
        source: 'database',
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
    console.error('ADMIN_MODERATION_LIST_FAILED', {
      adminUserId: auth.identity.userId,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        route: '/api/admin/moderation/list',
        error: 'admin_moderation_list_failed',
      },
      {
        status: 500,
        headers: adminNoStoreHeaders(),
      },
    );
  }
}
