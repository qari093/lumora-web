import { requireAdminSession } from '@/src/lib/auth/requireAdminSession';
import { productionDebugGate } from '@/src/lib/runtime-guards/productionDebugGate';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/observability/logger';
import { startTrace, finishTrace } from '@/lib/observability/trace';

export const dynamic = 'force-dynamic';

async function GET_PRIVILEGED_INTERNAL() {
  const blocked = productionDebugGate();
  if (blocked) return blocked;
  const trace = startTrace('api.diag.trace');
  logger.info('api.diag.trace', 'trace_started', undefined, trace.requestId);
  const summary = finishTrace(trace);
  logger.info(
    'api.diag.trace',
    'trace_finished',
    { durationMs: summary.durationMs },
    trace.requestId,
  );

  return NextResponse.json(
    {
      ok: true,
      trace: summary,
    },
    {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'x-request-id': summary.requestId,
      },
    },
  );
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
