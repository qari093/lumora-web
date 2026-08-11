import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('production role escalation guard', () => {
  it('disables role switching in production', () => {
    const source = readFileSync('app/api/auth/set-role/route.ts', 'utf8');

    expect(source).toContain('LUMORA_DEV_ROLE_SWITCH_ENABLED');
    expect(source).toMatch(/process\.env\.NODE_ENV\s*!==\s*['"]production['"]/);
    expect(source).toContain('status: 404');
    expect(source).toContain('clearDevelopmentRoleCookies');
  });

  it('uses the verified NextAuth session for the creator gate', () => {
    const source = readFileSync('app/creator/page.tsx', 'utf8');

    expect(source).toContain('getServerSession');
    expect(source).toContain('session.user.role');
    expect(source).not.toContain('get("role")');
  });

  it('removes client-side role switching', () => {
    const source = readFileSync('src/components/RoleBar.tsx', 'utf8');

    expect(source).toContain('/api/auth/session');
    expect(source).not.toContain('/api/auth/set-role');
    expect(source).not.toContain('document.cookie');
    expect(source).not.toContain('setRole');
  });
});
