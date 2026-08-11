import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { listOrders } from '@/src/core/zendoro/api/store';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const seller = await prisma.zendoroSeller.findFirst({
      where: {
        ownerId: auth.identity.userId,
      },
      select: {
        id: true,
      },
    });

    if (!seller) {
      return json(
        {
          ok: false,
          error: 'seller_not_found',
        },
        404,
      );
    }

    return json({
      ok: true,
      data: listOrders().filter((order) => order.sellerId === seller.id),
    });
  } catch (error: unknown) {
    console.error('[seller/orders] read failed', error instanceof Error ? error.message : error);

    return json(
      {
        ok: false,
        error: 'seller_orders_read_failed',
      },
      500,
    );
  }
}
