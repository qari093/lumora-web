import { NextResponse } from 'next/server';
import { getWallet, addLedgerEntry } from '@/lib/wallet';
import { ensureIdempotency } from '@/lib/idempotency';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { ownerId, euros, reason, idempotencyKey } = body ?? {};
    if (!ownerId || typeof euros !== 'number' || euros <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    const headerKey = req.headers.get('Idempotency-Key') ?? undefined;
    const key = headerKey || idempotencyKey;

    if (key) {
      const dedup = await ensureIdempotency({ ownerId, key, endpoint: 'wallet/debit' });
      if (dedup) return NextResponse.json(dedup);
    }

    // Record debit (your addLedgerEntry must subtract when kind='debit')
    const entry = await addLedgerEntry({ ownerId, kind: 'debit', euros, reason });
    const wallet = await getWallet(ownerId);
    const resp = { ok: true, wallet, entry, requestId: entry.requestId };

    if (key) await ensureIdempotency({ ownerId, key, endpoint: 'wallet/debit', save: resp });
    return NextResponse.json(resp);
  } catch (err) {
    console.error('[wallet/debit] error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
