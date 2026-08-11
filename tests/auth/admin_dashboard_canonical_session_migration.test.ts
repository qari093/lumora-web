import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const adminLayout = readFileSync('app/admin/layout.tsx', 'utf8');

const zendoroLayout = readFileSync('app/zendoro/admin/layout.tsx', 'utf8');

const pageGuard = readFileSync('src/lib/auth/requireAdminPageSession.ts', 'utf8');

const adminClient = readFileSync('app/admin/AdminClient.tsx', 'utf8');

const kycClient = readFileSync('app/admin/kyc/AdminKycClient.tsx', 'utf8');

const testersClient = readFileSync('app/admin/testers/TestersTable.tsx', 'utf8');

describe('canonical administrator dashboard session migration', () => {
  it('protects the complete administrator page subtree', () => {
    expect(existsSync('app/admin/layout.tsx')).toBe(true);

    expect(adminLayout).toContain('requireAdminPageSession');

    expect(adminLayout).toContain("requireAdminPageSession('/admin')");

    expect(adminLayout).toContain('data-admin-session-protected');
  });

  it('protects the external Zendoro administrator page', () => {
    expect(zendoroLayout).toContain('requireAdminPageSession');

    expect(zendoroLayout).toContain("requireAdminPageSession('/zendoro/admin')");
  });

  it('revalidates the administrator identity from the database', () => {
    expect(pageGuard).toContain('getServerSession');

    expect(pageGuard).toContain('prisma.user.findUnique');

    expect(pageGuard).toMatch(/user\.role\s*!==\s*['"]admin['"]/);

    expect(pageGuard).toContain('!user.emailVerified');

    expect(pageGuard).toContain('callbackUrl');

    expect(pageGuard).toContain('admin_required');
  });

  it('removes browser-stored administrator secrets', () => {
    const combined = [adminClient, kycClient, testersClient].join('\n');

    expect(combined).not.toContain('adminToken');

    expect(combined).not.toContain('dev-admin-token');

    expect(combined).not.toContain('x-admin-token');

    expect(combined).not.toContain('x-admin-key');

    expect(combined).not.toContain('localStorage');

    expect(combined).not.toContain('sessionStorage');
  });

  it('uses secure same-origin session requests', () => {
    const combined = [adminClient, kycClient, testersClient].join('\n');

    expect(combined).toContain("credentials: 'same-origin'");

    expect(combined).toContain("cache: 'no-store'");

    expect(combined).toContain('/api/admin/overview');

    expect(combined).toContain('/api/admin/kyc/pending');

    expect(combined).toContain('/api/admin/kyc/decision');

    expect(combined).toContain('/api/admin/testers/summary');
  });

  it('supports explicit authorization failure recovery', () => {
    const combined = [adminClient, kycClient, testersClient].join('\n');

    expect(combined).toContain('authorizationFailure');

    expect(combined).toContain('callbackUrl=/admin');

    expect(combined).toContain('Sign in again');
  });

  it('matches the canonical KYC and tester API response contracts', () => {
    expect(kycClient).toContain('payload.items');

    expect(kycClient).not.toContain('payload.pending');

    expect(testersClient).toContain('payload.testers');

    expect(testersClient).toContain('lastOccurredAt');

    expect(testersClient).toContain('pages');
  });
});
