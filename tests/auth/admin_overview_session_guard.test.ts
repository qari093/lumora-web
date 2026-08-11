import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('admin overview canonical session guard', () => {
  const source = readFileSync('app/api/admin/overview/route.ts', 'utf8');

  it('requires the canonical administrator session', () => {
    expect(source).toContain('requireAdminSession');
    expect(source).toContain('adminNoStoreHeaders');
    expect(source).toContain('return auth.response');
  });

  it('retains the operational overview contract', () => {
    expect(source).toMatch(/route:\s*['"]\/api\/admin\/overview['"]/);
    expect(source).toContain('windowMinutes');
    expect(source).toContain('wallets');
    expect(source).toContain('campaigns');
    expect(source).toContain('kycPending');
    expect(source).toContain('eventsLastHr');
    expect(source).toContain('convLastHr');
    expect(source).toContain('fraudLastHr');
  });

  it('removes all legacy administrator authentication', () => {
    expect(source).not.toContain('ADMIN_TOKEN');
    expect(source).not.toContain('ADMIN_API_KEY');
    expect(source).not.toContain('x-admin-token');
    expect(source).not.toContain('x-admin-key');
    expect(source).not.toContain('isAdmin(');
    expect(source).not.toContain('assertAdmin');
  });
});
