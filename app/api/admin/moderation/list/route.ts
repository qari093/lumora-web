import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const adminHeader = process.env.ADMIN_TOKEN || '';
    const token = req.headers.get('x-admin-token') || '';
    if (!adminHeader || token !== adminHeader) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') || 20), 50);

    const rows = await prisma.streamVideo.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    const items = rows.map((r) => ({
      id: r.id,
      uid: r.uid,
      ownerId: r.ownerId,
      durationSec: r.durationSec ?? null,
      sizeBytes: r.sizeBytes === null ? null : Number(r.sizeBytes),
      status: r.status,
      readyToStream: r.readyToStream,
      createdAt: r.createdAt.toISOString(),
      playbackId: r.playbackId ?? null,
      thumbnailUrl: r.thumbnailUrl ?? null,
      meta: r.meta ?? null,
    }));

    return NextResponse.json({ ok: true, count: items.length, items });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
