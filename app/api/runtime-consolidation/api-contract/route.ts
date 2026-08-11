import { requireAdminSession } from '@/src/lib/auth/requireAdminSession';
import { NextResponse } from 'next/server';
import { apiSuccess, assertLumoraApiResponse } from '@/src/core/runtime-consolidation';

export const dynamic = 'force-dynamic';

async function GET_PRIVILEGED_INTERNAL() {
  const response = apiSuccess({
    data: {
      contract: 'universal_api_response',
      enforced: true,
    },
    domain: 'infra_telemetry',
    version: 'runtime-consolidation-pack-05',
    runtime: 'node',
  });

  assertLumoraApiResponse(response);

  return NextResponse.json(response);
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
