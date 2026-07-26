import { randomUUID } from 'node:crypto';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/src/core/auth/authOptions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CheckoutBody = {
  productId?: string;
  quantity?: number;
  idempotencyKey?: string;
  mode?: 'test' | 'live';
};

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

function resolveBaseUrl(request: Request): string {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    (process.env.VERCEL_URL?.trim() ? `https://${process.env.VERCEL_URL.trim()}` : '');

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  return new URL(request.url).origin;
}

function normalizedQuantity(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return null;
  }

  if (value < 1 || value > 20) {
    return null;
  }

  return value;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/zendoro/checkout',
    methods: ['POST'],
    authenticated: true,
    persistentOrders: true,
    inventoryReservation: true,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
  });
}

export async function POST(request: Request) {
  const authSession = await getServerSession(authOptions);
  const buyerId = authSession?.user?.id?.trim() ?? '';

  if (!buyerId) {
    return json(401, {
      ok: false,
      error: 'authentication_required',
      route: '/api/zendoro/checkout',
    });
  }

  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return json(400, {
      ok: false,
      error: 'invalid_json',
      route: '/api/zendoro/checkout',
    });
  }

  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const quantity = normalizedQuantity(body.quantity ?? 1);

  if (!productId || quantity === null) {
    return json(400, {
      ok: false,
      error: 'invalid_checkout_request',
      required: {
        productId: 'non-empty string',
        quantity: 'integer from 1 to 20',
      },
    });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim() ?? '';

  if (!stripeSecret) {
    return json(503, {
      ok: false,
      error: 'stripe_not_configured',
      requiredEnv: ['STRIPE_SECRET_KEY'],
      safe: true,
    });
  }

  const allowLive = process.env.STRIPE_ALLOW_LIVE_MODE?.trim().toLowerCase() === 'true';

  if (stripeSecret.startsWith('sk_live_') && !allowLive) {
    return json(403, {
      ok: false,
      error: 'stripe_live_mode_blocked',
      requiredEnv: ['STRIPE_ALLOW_LIVE_MODE=true'],
      safe: true,
    });
  }

  if (body.mode === 'live' && !allowLive) {
    return json(403, {
      ok: false,
      error: 'zendoro_live_checkout_blocked',
      safe: true,
    });
  }

  const suppliedIdempotencyKey =
    typeof body.idempotencyKey === 'string'
      ? body.idempotencyKey.trim()
      : (request.headers.get('idempotency-key')?.trim() ?? '');

  const idempotencyKey = suppliedIdempotencyKey || `zendoro_${buyerId}_${randomUUID()}`;

  if (idempotencyKey.length > 255) {
    return json(400, {
      ok: false,
      error: 'idempotency_key_too_long',
    });
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2024-06-20',
  });

  const existingOrder = await prisma.zendoroOrder.findUnique({
    where: { idempotencyKey },
    include: {
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (existingOrder) {
    if (existingOrder.buyerId !== buyerId) {
      return json(409, {
        ok: false,
        error: 'idempotency_key_conflict',
      });
    }

    const stripeSessionId = existingOrder.payments[0]?.providerPaymentId;

    if (stripeSessionId) {
      const existingStripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);

      return json(200, {
        ok: true,
        reused: true,
        orderId: existingOrder.id,
        checkoutSessionId: existingStripeSession.id,
        url: existingStripeSession.url,
      });
    }

    return json(409, {
      ok: false,
      error: 'checkout_initialization_in_progress',
      orderId: existingOrder.id,
    });
  }

  const reservation = await prisma
    .$transaction(async (tx) => {
      const product = await tx.zendoroProduct.findFirst({
        where: {
          id: productId,
          active: true,
          seller: {
            status: 'ACTIVE',
          },
        },
        include: {
          inventory: true,
          seller: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
      });

      if (!product) {
        throw new Error('product_not_available');
      }

      if (!product.inventory) {
        throw new Error('inventory_not_configured');
      }

      const availableStock = product.inventory.stock - product.inventory.reserved;

      if (availableStock < quantity) {
        throw new Error('insufficient_inventory');
      }

      const inventoryUpdate = await tx.zendoroInventory.updateMany({
        where: {
          id: product.inventory.id,
          reserved: product.inventory.reserved,
          stock: {
            gte: product.inventory.reserved + quantity,
          },
        },
        data: {
          reserved: {
            increment: quantity,
          },
        },
      });

      if (inventoryUpdate.count !== 1) {
        throw new Error('inventory_reservation_conflict');
      }

      const subtotalCents = product.priceCents * quantity;

      const order = await tx.zendoroOrder.create({
        data: {
          buyerId,
          status: 'PENDING',
          subtotalCents,
          totalCents: subtotalCents,
          currency: product.currency.toUpperCase(),
          idempotencyKey,
          items: {
            create: {
              productId: product.id,
              quantity,
              unitPrice: product.priceCents,
              totalPrice: subtotalCents,
            },
          },
          payments: {
            create: {
              provider: 'stripe',
              status: 'CREATED',
              amountCents: subtotalCents,
              currency: product.currency.toUpperCase(),
            },
          },
        },
        include: {
          payments: true,
        },
      });

      return {
        order,
        product,
        quantity,
        inventoryId: product.inventory.id,
      };
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'checkout_reservation_failed';

      return { error: message } as const;
    });

  if ('error' in reservation) {
    const status =
      reservation.error === 'product_not_available'
        ? 404
        : reservation.error === 'insufficient_inventory'
          ? 409
          : reservation.error === 'inventory_not_configured'
            ? 409
            : reservation.error === 'inventory_reservation_conflict'
              ? 409
              : 500;

    return json(status, {
      ok: false,
      error: reservation.error,
    });
  }

  const baseUrl = resolveBaseUrl(request);

  try {
    const checkoutSession = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        client_reference_id: reservation.order.id,
        success_url: `${baseUrl}/zendoro/orders?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/zendoro/checkout?checkout=cancelled&order_id=${reservation.order.id}`,
        line_items: [
          {
            price_data: {
              currency: reservation.product.currency.toLowerCase(),
              product_data: {
                name: reservation.product.title,
                description: reservation.product.description.slice(0, 500) || undefined,
                metadata: {
                  zendoroProductId: reservation.product.id,
                  zendoroSellerId: reservation.product.seller.id,
                },
              },
              unit_amount: reservation.product.priceCents,
            },
            quantity: reservation.quantity,
          },
        ],
        metadata: {
          flow: 'zendoro_commerce',
          zendoroOrderId: reservation.order.id,
          buyerId,
          productId: reservation.product.id,
          quantity: String(reservation.quantity),
        },
        payment_intent_data: {
          metadata: {
            flow: 'zendoro_commerce',
            zendoroOrderId: reservation.order.id,
            buyerId,
          },
        },
      },
      {
        idempotencyKey,
      },
    );

    await prisma.zendoroPayment.update({
      where: {
        id: reservation.order.payments[0].id,
      },
      data: {
        providerPaymentId: checkoutSession.id,
        status: 'REQUIRES_ACTION',
      },
    });

    return json(201, {
      ok: true,
      reused: false,
      orderId: reservation.order.id,
      checkoutSessionId: checkoutSession.id,
      url: checkoutSession.url,
      amountCents: reservation.order.totalCents,
      currency: reservation.order.currency,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'stripe_session_creation_failed';

    await prisma
      .$transaction([
        prisma.zendoroInventory.update({
          where: {
            id: reservation.inventoryId,
          },
          data: {
            reserved: {
              decrement: reservation.quantity,
            },
          },
        }),
        prisma.zendoroPayment.update({
          where: {
            id: reservation.order.payments[0].id,
          },
          data: {
            status: 'FAILED',
          },
        }),
        prisma.zendoroOrder.update({
          where: {
            id: reservation.order.id,
          },
          data: {
            status: 'CANCELLED',
          },
        }),
      ])
      .catch(() => null);

    return json(502, {
      ok: false,
      error: 'stripe_session_creation_failed',
      detail: message,
      orderId: reservation.order.id,
    });
  }
}
