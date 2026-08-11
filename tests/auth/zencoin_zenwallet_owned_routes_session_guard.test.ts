import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const protectedRoutes = [
  'app/api/zencoin/balance/route.ts',
  'app/api/zencoin/transactions/route.ts',
  'app/api/zencoin/transfer/route.ts',
  'app/api/zencoin/wallet/route.ts',
  'app/api/zenwallet/creator/route.ts',
  'app/api/zenwallet/final-seal/route.ts',
  'app/api/zenwallet/ledger/route.ts',
  'app/api/zenwallet/offline/route.ts',
  'app/api/zenwallet/portals/route.ts',
  'app/api/zenwallet/refunds/route.ts',
  'app/api/zenwallet/runtime/route.ts',
  'app/api/zenwallet/security/route.ts',
  'app/api/zenwallet/subscriptions/route.ts',
  'app/api/zenwallet/support/route.ts',
  'app/api/zenwallet/transparency/route.ts',
];

describe('canonical Zencoin and Zenwallet ownership protection', () => {
  it.each(protectedRoutes)('%s requires the canonical verified user session', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toContain('requireUserSession');
    expect(source).toContain('return auth.response');
    expect(source).toContain('userPrivateNoStoreHeaders');
  });

  it.each(protectedRoutes)('%s preserves its protected implementation', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toMatch(/async function (?:GET|POST)Implementation\(/);
    expect(source).toMatch(/const response = await (?:GET|POST)Implementation\(\)/);
    expect(source).toContain('response.headers.set(name, value)');
  });

  it.each(protectedRoutes)('%s contains no spoofable caller identity', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).not.toContain('x-user-id');
    expect(source).not.toContain('x-owner-id');
    expect(source).not.toContain('body.userId');
    expect(source).not.toContain('body.ownerId');
    expect(source).not.toContain('searchParams.get("userId")');
    expect(source).not.toContain('searchParams.get("ownerId")');
  });

  it('preserves the Zencoin transfer mutation contract', () => {
    const source = readFileSync('app/api/zencoin/transfer/route.ts', 'utf8');

    expect(source).toContain('async function POSTImplementation()');
    expect(source).toContain('export async function POST()');
    expect(source).toContain('transferred: true');
  });

  it('protects all fifteen audited routes', () => {
    expect(protectedRoutes).toHaveLength(15);
  });
});
