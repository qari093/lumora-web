import { requireAdminSession } from '@/src/lib/auth/requireAdminSession';
import { NextResponse } from 'next/server';
import {
  auditDuplicateResponsibilities,
  summarizeDuplicateAudit,
} from '@/src/core/runtime-consolidation';

export const dynamic = 'force-dynamic';

async function GET_PRIVILEGED_INTERNAL() {
  return NextResponse.json({
    ok: true,
    data: auditDuplicateResponsibilities(),
    summary: summarizeDuplicateAudit(),
    meta: {
      domain: 'infra_telemetry',
      version: 'runtime-consolidation-pack-03',
      runtime: 'node',
    },
  });
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
