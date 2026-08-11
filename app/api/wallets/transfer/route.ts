import { NextResponse } from 'next/server';

import { transferEuros } from '@/lib/wallet';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type TransferBody = {
  toOwnerId?: unknown;
  euros?: unknown;
  note?: unknown;
  idempotencyKey?: unknown;
};

function json(status: number, body: Record<string, unknown>): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: TransferBody;

  try {
    body = (await request.json()) as TransferBody;
  } catch {
    return json(400, {
      ok: false,
      route: '/api/wallets/transfer',
      error: 'invalid_json',
    });
  }

  const toOwnerId = typeof body.toOwnerId === 'string' ? body.toOwnerId.trim() : '';

  const euros = typeof body.euros === 'number' ? body.euros : Number.NaN;

  const note =
    typeof body.note === 'string' && body.note.trim() ? body.note.trim() : 'wallet_transfer';

  const idempotencyKey =
    request.headers.get('idempotency-key')?.trim() ||
    (typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : '');

  if (!toOwnerId) {
    return json(400, {
      ok: false,
      route: '/api/wallets/transfer',
      error: 'destination_owner_required',
    });
  }

  if (toOwnerId === auth.identity.userId) {
    return json(409, {
      ok: false,
      route: '/api/wallets/transfer',
      error: 'self_transfer_not_allowed',
    });
  }

  if (!Number.isFinite(euros) || euros <= 0) {
    return json(400, {
      ok: false,
      route: '/api/wallets/transfer',
      error: 'invalid_transfer_amount',
    });
  }

  try {
    const result = await transferEuros({
      fromUserId: auth.identity.userId,
      toUserId: toOwnerId,
      amount: euros,
      ref: idempotencyKey || undefined,
      memo: note,
    });

    if (!result.ok) {
      return json(409, {
        ok: false,
        route: '/api/wallets/transfer',
        error: result.error ?? 'wallet_transfer_failed',
      });
    }

    return json(201, {
      ok: true,
      route: '/api/wallets/transfer',
      transfer: {
        fromUserId: auth.identity.userId,
        toUserId: toOwnerId,
        euros,
        reference: idempotencyKey || null,
      },
    });
  } catch (error) {
    console.error('USER_WALLET_TRANSFER_FAILED', {
      userId: auth.identity.userId,
      toOwnerId,
      message: error instanceof Error ? error.message : String(error),
    });

    return json(500, {
      ok: false,
      route: '/api/wallets/transfer',
      error: 'wallet_transfer_failed',
    });
  }
}
