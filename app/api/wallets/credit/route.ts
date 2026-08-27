import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HEADERS = {
  'cache-control': 'no-store, max-age=0',
  'x-lumora-wallet-boundary': 'legacy-money-mutation-quarantined',
};

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ok: false,
      route: '/api/wallets/credit',
      error: 'legacy_wallet_credit_disabled',
      status: 'quarantined',
    },
    {
      status: 410,
      headers: HEADERS,
    },
  );
}
