import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizeBigInt(x: any): any {
  if (typeof x === 'bigint') return Number(x);
  if (Array.isArray(x)) return x.map(sanitizeBigInt);
  if (x && typeof x === 'object') {
    const out: any = {};
    for (const k of Object.keys(x)) out[k] = sanitizeBigInt(x[k]);
    return out;
  }
  return x;
}

export async function GET() {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const ping = sanitizeBigInt(await prisma.$queryRawUnsafe<any[]>(`SELECT 1 AS ok`));

    const counts: Record<string, number> = {};

    const tryCount = async (name: string, run: () => Promise<number>) => {
      try {
        counts[name] = Number(await run());
      } catch {}
    };

    await tryCount('Wallet', () => prisma.wallet.count());
    await tryCount('Campaign', () => prisma.campaign.count());
    await tryCount('CpvView', () => prisma.cpvView.count());
    await tryCount('AdEvent', () => prisma.adEvent.count());
    await tryCount('AdConversion', () => prisma.adConversion.count());
    await tryCount('KycRequest', () => prisma.kycRequest.count());
    await tryCount('FraudLog', () => prisma.fraudLog.count());

    return NextResponse.json(
      {
        ok: true,
        route: '/api/admin/health',
        admin: auth.identity,
        db: 'up',
        ping,
        counts,
      },
      {
        status: 200,
        headers: adminNoStoreHeaders(),
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: String(error?.message || error),
      },
      {
        status: 500,
        headers: adminNoStoreHeaders(),
      },
    );
  }
}
