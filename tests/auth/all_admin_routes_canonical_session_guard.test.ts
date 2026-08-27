import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

function collectRoutes(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);

      return statSync(path).isDirectory()
        ? collectRoutes(path)
        : entry === 'route.ts'
          ? [path]
          : [];
    })
    .sort();
}

describe('all admin routes use canonical sessions', () => {
  const routes = collectRoutes('app/api/admin');

  it('covers the complete active administrator API surface', () => {
    expect(routes).toHaveLength(11);
  });

  it.each(routes)('%s uses the canonical administrator guard', (route) => {
    const source = readFileSync(route, 'utf8');

    expect(source).toContain('requireAdminSession');
    expect(source).toContain('adminNoStoreHeaders');
    expect(source).toContain('return auth.response');
  });

  it.each(routes)('%s contains no legacy administrator authentication', (route) => {
    const source = readFileSync(route, 'utf8');

    expect(source).not.toContain('ADMIN_TOKEN');
    expect(source).not.toContain('ADMIN_API_KEY');
    expect(source).not.toContain('x-admin-token');
    expect(source).not.toContain('x-admin-key');
    expect(source).not.toContain('assertAdmin');
    expect(source).not.toContain('isAdmin(');
    expect(source).not.toContain('requireAdmin(');
  });

  it('removes ephemeral tester telemetry persistence from the admin summary', () => {
    const source = readFileSync('app/api/admin/testers/summary/route.ts', 'utf8');

    expect(source).toContain('prisma.observabilityEvent.findMany');
    expect(source).toContain("source: 'database'");
    expect(source).not.toContain('telemetry.ndjson');
    expect(source).not.toContain('.lumora_telemetry');
    expect(source).not.toContain('readFileSync');
  });
});
