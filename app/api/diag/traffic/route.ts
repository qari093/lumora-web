import { requireAdminSession } from '@/src/lib/auth/requireAdminSession';
import { productionDebugGate } from '@/src/lib/runtime-guards/productionDebugGate';
import { NextRequest, NextResponse } from 'next/server';
import { dumpStats } from '@/src/lib/trust/engine';
import { reqId } from '@/src/lib/reqid';

async function GET_PRIVILEGED_INTERNAL(_req: NextRequest) {
  const blocked = productionDebugGate();
  if (blocked) return blocked;
  const id = reqId();
  const stats = dumpStats();
  return NextResponse.json(
    { ok: true, stats, requestId: id },
    { status: 200, headers: { 'x-request-id': id } },
  );
}
export const dynamic = 'force-dynamic';

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
