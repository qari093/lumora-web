import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('zendoro admin session guard', () => {
  const source = readFileSync('app/api/admin/zendoro/route.ts', 'utf8');

  it('requires the canonical admin session', () => {
    expect(source).toContain('requireAdminSession');
    expect(source).toContain('adminNoStoreHeaders');
    expect(source).toContain('if (!auth.ok)');
    expect(source).toContain('return auth.response');
  });

  it('removes legacy or anonymous admin access', () => {
    expect(source).not.toContain('x-admin-token');
    expect(source).not.toContain('ADMIN_TOKEN');
    expect(source).not.toContain('assertAdmin');
    expect(source).not.toContain('requireAdmin(');
  });

  it('retains the zendoro admin summary contract', () => {
    expect(source).toContain('getAdminZendoroSummary');
    expect(source).toContain('/api/admin/zendoro');
    expect(source).toContain('source');
  });
});
