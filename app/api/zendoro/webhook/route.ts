import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

function orderIdFromSession(session: Stripe.Checkout.Session): string {
  return String(session.metadata?.zendoroOrderId || session.client_reference_id || '').trim();
}

async function fulfilCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = orderIdFromSession(session);
  const stripeSessionId = String(session.id || '').trim();

  if (!orderId) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'zendoro_order_metadata_required',
      },
    };
  }

  if (!stripeSessionId) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'stripe_session_id_required',
      },
    };
  }

  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return {
      status: 200,
      body: {
        ok: true,
        pending: true,
        orderId,
        paymentStatus: session.payment_status,
      },
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.zendoroOrder.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new Error('zendoro_order_not_found');
    }

    if (order.status === 'PAID' || order.status === 'FULFILLED') {
      return {
        alreadyApplied: true,
        orderId: order.id,
        status: order.status,
      };
    }

    if (order.status !== 'PENDING') {
      throw new Error(`zendoro_order_not_payable:${order.status}`);
    }

    const sessionAmount = typeof session.amount_total === 'number' ? session.amount_total : null;
    const sessionCurrency = String(session.currency || '').toUpperCase();

    if (sessionAmount === null || sessionAmount !== order.totalCents) {
      throw new Error('zendoro_payment_amount_mismatch');
    }

    if (!sessionCurrency || sessionCurrency !== order.currency.toUpperCase()) {
      throw new Error('zendoro_payment_currency_mismatch');
    }

    const payment =
      order.payments.find((candidate) => candidate.providerPaymentId === stripeSessionId) ||
      order.payments[0];

    if (!payment) {
      throw new Error('zendoro_payment_record_not_found');
    }

    for (const item of order.items) {
      const inventoryUpdate = await tx.zendoroInventory.updateMany({
        where: {
          productId: item.productId,
          stock: {
            gte: item.quantity,
          },
          reserved: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
          reserved: {
            decrement: item.quantity,
          },
        },
      });

      if (inventoryUpdate.count !== 1) {
        throw new Error(`zendoro_inventory_commit_failed:${item.productId}`);
      }
    }

    await tx.zendoroPayment.update({
      where: { id: payment.id },
      data: {
        providerPaymentId: stripeSessionId,
        status: 'SUCCEEDED',
      },
    });

    const paidOrder = await tx.zendoroOrder.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
      },
    });

    return {
      alreadyApplied: false,
      orderId: paidOrder.id,
      status: paidOrder.status,
    };
  });

  return {
    status: 200,
    body: {
      ok: true,
      applied: result.alreadyApplied ? 'already' : 'fulfilled',
      orderId: result.orderId,
      orderStatus: result.status,
    },
  };
}

async function cancelCheckoutSession(session: Stripe.Checkout.Session, reason: string) {
  const orderId = orderIdFromSession(session);
  const stripeSessionId = String(session.id || '').trim();

  if (!orderId) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'zendoro_order_metadata_required',
      },
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.zendoroOrder.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new Error('zendoro_order_not_found');
    }

    if (order.status === 'CANCELLED') {
      return {
        alreadyApplied: true,
        orderId: order.id,
      };
    }

    if (order.status === 'PAID' || order.status === 'FULFILLED' || order.status === 'REFUNDED') {
      return {
        alreadyApplied: true,
        orderId: order.id,
      };
    }

    for (const item of order.items) {
      const inventoryUpdate = await tx.zendoroInventory.updateMany({
        where: {
          productId: item.productId,
          reserved: {
            gte: item.quantity,
          },
        },
        data: {
          reserved: {
            decrement: item.quantity,
          },
        },
      });

      if (inventoryUpdate.count !== 1) {
        throw new Error(`zendoro_inventory_release_failed:${item.productId}`);
      }
    }

    const payment =
      order.payments.find((candidate) => candidate.providerPaymentId === stripeSessionId) ||
      order.payments[0];

    if (payment) {
      await tx.zendoroPayment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
        },
      });
    }

    await tx.zendoroOrder.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
      },
    });

    return {
      alreadyApplied: false,
      orderId: order.id,
    };
  });

  return {
    status: 200,
    body: {
      ok: true,
      applied: result.alreadyApplied ? 'already' : 'cancelled',
      reason,
      orderId: result.orderId,
    },
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/zendoro/webhook',
    methods: ['POST'],
    signatureVerification: true,
    idempotentFulfilment: true,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
  });
}

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim() || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || '';

  if (!stripeSecret) {
    return json(503, {
      ok: false,
      error: 'stripe_not_configured',
      requiredEnv: ['STRIPE_SECRET_KEY'],
      safe: true,
    });
  }

  if (!webhookSecret) {
    return json(503, {
      ok: false,
      error: 'stripe_webhook_not_configured',
      requiredEnv: ['STRIPE_WEBHOOK_SECRET'],
      safe: true,
    });
  }

  const allowLive = process.env.STRIPE_ALLOW_LIVE_MODE?.trim().toLowerCase() === 'true';

  if (stripeSecret.startsWith('sk_live_') && !allowLive) {
    return json(403, {
      ok: false,
      error: 'stripe_live_mode_blocked',
      safe: true,
    });
  }

  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return json(400, {
      ok: false,
      error: 'missing_stripe_signature',
    });
  }

  const rawBody = await request.text();
  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2024-06-20',
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error: unknown) {
    return json(400, {
      ok: false,
      error: 'invalid_stripe_signature',
      detail: error instanceof Error ? error.message : 'signature_verification_failed',
    });
  }

  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.flow !== 'zendoro_commerce') {
        return json(200, {
          ok: true,
          ignored: true,
          type: event.type,
          reason: 'non_zendoro_checkout',
        });
      }

      const result = await fulfilCheckoutSession(session);
      return json(result.status, result.body);
    }

    if (
      event.type === 'checkout.session.expired' ||
      event.type === 'checkout.session.async_payment_failed'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.flow !== 'zendoro_commerce') {
        return json(200, {
          ok: true,
          ignored: true,
          type: event.type,
          reason: 'non_zendoro_checkout',
        });
      }

      const result = await cancelCheckoutSession(session, event.type);
      return json(result.status, result.body);
    }

    return json(200, {
      ok: true,
      ignored: true,
      type: event.type,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'zendoro_webhook_failed';

    const status =
      message === 'zendoro_order_not_found'
        ? 404
        : message.includes('not_payable') ||
            message.includes('amount_mismatch') ||
            message.includes('currency_mismatch') ||
            message.includes('inventory_')
          ? 409
          : 500;

    return json(status, {
      ok: false,
      error: message,
      eventId: event.id,
      eventType: event.type,
    });
  }
}
