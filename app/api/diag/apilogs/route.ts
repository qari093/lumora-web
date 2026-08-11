import { requireAdminSession } from '@/src/lib/auth/requireAdminSession';
import { productionDebugGate } from '@/src/lib/runtime-guards/productionDebugGate';
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
export const runtime = 'nodejs';
async function GET_PRIVILEGED_INTERNAL(req: Request) {
  const blocked = productionDebugGate();
  if (blocked) return blocked;
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('limit') ?? '10';
  const n = Number.parseInt(raw, 10);
  const limit = Number.isFinite(n) ? Math.min(Math.max(n, 1), 50) : 10;
  try {
    const rows = await prisma.apiLog.findMany({ orderBy: { ts: 'desc' }, take: limit });
    return NextResponse.json({ ok: true, rows });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'DB_ERROR', message: err?.message ?? 'Unknown DB error' },
      { status: 500 },
    );
  }
}

// MEGA_STEP_13_CANONICAL_PRIVILEGED_WRAPPER
function applyPrivilegedNoStore(response: Response): Response {
  response.headers.set('cache-control', 'private, no-store, max-age=0');
  return response;
}

export async function GET(...args: Parameters<typeof GET_PRIVILEGED_INTERNAL>): Promise<Response> {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  const response = await GET_PRIVILEGED_INTERNAL(...args);

  return applyPrivilegedNoStore(response);
}
