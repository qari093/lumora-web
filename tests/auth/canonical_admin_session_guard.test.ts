import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('canonical admin session guard', () => {
  const source = readFileSync('src/lib/auth/requireAdminSession.ts', 'utf8');

  it('uses the verified NextAuth server session', () => {
    expect(source).toContain('getServerSession');
    expect(source).toContain('authOptions');
    expect(source).toContain('session?.user?.id');
    expect(source).toContain('session?.user?.email');
  });

  it('revalidates the administrator against the database', () => {
    expect(source).toContain('prisma.user.findUnique');
    expect(source).toMatch(/user\.role\s*!==\s*['"]admin['"]/);
    expect(source).toContain('!user.emailVerified');
  });

  it('returns explicit authentication and authorization failures', () => {
    expect(source).toContain('authentication_required');
    expect(source).toContain('admin_required');
    expect(source).toContain('denied(401');
    expect(source).toContain('denied(403');
  });

  it('does not trust legacy tokens or role cookies', () => {
    expect(source).not.toContain('ADMIN_TOKEN');
    expect(source).not.toContain('ADMIN_API_KEY');
    expect(source).not.toContain('x-admin-token');
    expect(source).not.toContain('x-admin-key');
    expect(source).not.toContain('get("role")');
  });

  it('prevents caching of authorization responses', () => {
    expect(source).toContain('no-store, max-age=0');
  });
});
