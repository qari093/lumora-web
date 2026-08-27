import { NextResponse } from 'next/server';

import { getSession, hasRole } from '../auth';
import type { Role } from './session';

import { requireAdminSession } from './requireAdminSession';
export type ApiRoleGuardFailure = NextResponse<{
  error: 'unauthorized' | 'forbidden';
}>;

/**
 * API-route authorization counterpart to the page-oriented requireRole().
 *
 * Contract:
 * - 401 when there is no authenticated session.
 * - 403 when a session exists but lacks the required role.
 * - null when authorization succeeds.
 * - Never redirects.
 */
export async function requireApiRole(
  requiredRole: Role | Role[],
): Promise<ApiRoleGuardFailure | null> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const permitted = await hasRole(requiredRole);

  if (!permitted) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  return null;
}

export async function requireApiAdmin(): Promise<ApiRoleGuardFailure | null> {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response as ApiRoleGuardFailure;
  }

  return null;
}
