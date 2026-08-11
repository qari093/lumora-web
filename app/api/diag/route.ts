import { requireAdminSession } from '@/src/lib/auth/requireAdminSession';
import { NextResponse } from 'next/server';
import { productionDebugGate } from '@/src/lib/runtime-guards/productionDebugGate';

function devOnlyResponse() {
  const blocked = productionDebugGate();
  if (blocked) return blocked;

  return NextResponse.json({
    ok: true,
    devOnly: true,
    message: 'Development-only endpoint.',
  });
}

async function GET_PRIVILEGED_INTERNAL() {
  return devOnlyResponse();
}

async function POST_PRIVILEGED_INTERNAL() {
  return devOnlyResponse();
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

export async function POST(
  ...args: Parameters<typeof POST_PRIVILEGED_INTERNAL>
): Promise<Response> {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  const response = await POST_PRIVILEGED_INTERNAL(...args);

  return applyPrivilegedNoStore(response);
}
