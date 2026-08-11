import { NextResponse } from 'next/server';

import { getAdminZendoroSummary } from '@/src/core/zendoro/api/store';
import { adminNoStoreHeaders, requireAdminSession } from '@/src/lib/auth/requireAdminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  return NextResponse.json(
    {
      ok: true,
      route: '/api/admin/zendoro',
      source: 'zendoro_runtime_store',
      admin: {
        userId: auth.identity.userId,
        email: auth.identity.email,
        role: auth.identity.role,
      },
      data: getAdminZendoroSummary(),
    },
    {
      status: 200,
      headers: adminNoStoreHeaders(),
    },
  );
}
