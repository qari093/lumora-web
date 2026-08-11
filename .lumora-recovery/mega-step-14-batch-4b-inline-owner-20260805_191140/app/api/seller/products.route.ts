import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { listProducts, upsertProduct } from '@/src/core/zendoro/api/store';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ProductBody = {
  id?: string;
  title?: string;
  description?: string;
  priceCents?: number;
  currency?: string;
  inventory?: number;
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

async function resolveOwnedSeller(userId: string) {
  return prisma.zendoroSeller.findFirst({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });
}

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const seller = await resolveOwnedSeller(auth.identity.userId);

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
      data: listProducts().filter((product) => product.sellerId === seller.id),
    });
  } catch (error: unknown) {
    console.error('[seller/products] read failed', error instanceof Error ? error.message : error);

    return json(
      {
        ok: false,
        error: 'seller_products_read_failed',
      },
      500,
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const seller = await resolveOwnedSeller(auth.identity.userId);

    if (!seller) {
      return json(
        {
          ok: false,
          error: 'seller_not_found',
        },
        404,
      );
    }

    const body: ProductBody = await request.json().catch(() => ({}) as ProductBody);

    const title = typeof body.title === 'string' ? body.title.trim() : '';

    if (!title) {
      return json(
        {
          ok: false,
          error: 'title_required',
        },
        422,
      );
    }

    const priceCents = Number(body.priceCents ?? 0);
    const inventory = Number(body.inventory ?? 0);

    if (!Number.isFinite(priceCents) || priceCents < 0) {
      return json(
        {
          ok: false,
          error: 'invalid_price',
        },
        422,
      );
    }

    if (!Number.isFinite(inventory) || inventory < 0) {
      return json(
        {
          ok: false,
          error: 'invalid_inventory',
        },
        422,
      );
    }

    const product = upsertProduct({
      id:
        typeof body.id === 'string' && body.id.trim()
          ? body.id.trim()
          : `product_${crypto.randomUUID()}`,
      sellerId: seller.id,
      title,
      description: typeof body.description === 'string' ? body.description.trim() : '',
      priceCents: Math.round(priceCents),
      currency:
        typeof body.currency === 'string' && /^[A-Z]{3}$/.test(body.currency.trim().toUpperCase())
          ? body.currency.trim().toUpperCase()
          : 'EUR',
      inventory: Math.floor(inventory),
    });

    return json(
      {
        ok: true,
        data: product,
      },
      201,
    );
  } catch (error: unknown) {
    console.error('[seller/products] write failed', error instanceof Error ? error.message : error);

    return json(
      {
        ok: false,
        error: 'seller_product_write_failed',
      },
      500,
    );
  }
}
