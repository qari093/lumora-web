import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const protectedRoutes = [
  'app/api/account/route.ts',
  'app/api/account/upgrade/route.ts',
  'app/api/persona/privacy/route.ts',
  'app/api/persona/profile/route.ts',
  'app/api/persona/select/route.ts',
  'app/api/persona/voice/route.ts',
  'app/api/user/profile/route.ts',
];

describe('account persona and user ownership protection', () => {
  it.each(protectedRoutes)('%s requires the canonical verified session', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toContain('requireUserSession');
    expect(source).toContain('return auth.response');
    expect(source).toContain('userPrivateNoStoreHeaders');
  });

  it.each(protectedRoutes)('%s does not trust caller-supplied user ownership', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).not.toContain('body.userId');
    expect(source).not.toContain('body.ownerId');
    expect(source).not.toContain('x-user-id');
    expect(source).not.toContain('x-owner-id');
  });

  it('binds account output to the verified user', () => {
    const source = readFileSync('app/api/account/route.ts', 'utf8');

    expect(source).toContain('userId: auth.identity.userId');
    expect(source).not.toContain('"demo-user"');
  });

  it('binds account upgrades to the verified user', () => {
    const source = readFileSync('app/api/account/upgrade/route.ts', 'utf8');

    expect(source).toContain('const ownerId = auth.identity.userId');
    expect(source).not.toContain('ownerId?: string');
  });

  it('isolates voice state by verified user identity', () => {
    const source = readFileSync('app/api/persona/voice/route.ts', 'utf8');

    expect(source).toContain('auth.identity.userId');
    expect(source).toContain('stateKey');
  });

  it('uses secure persona cookies in production', () => {
    const source = readFileSync('app/api/persona/select/route.ts', 'utf8');

    expect(source).toMatch(/secure:\s*process\.env\.NODE_ENV\s*===\s*['"]production['"]/);
    expect(source).toContain('httpOnly: true');
  });

  it('removes the launch profile stub', () => {
    const source = readFileSync('app/api/user/profile/route.ts', 'utf8');

    expect(source).not.toContain('"launch-user"');
    expect(source).toContain('canonical_verified_user_session');
  });
});
