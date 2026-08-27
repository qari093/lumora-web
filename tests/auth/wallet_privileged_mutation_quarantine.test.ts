import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const quarantinedRoutes = [
  {
    file: 'app/api/wallets/credit/route.ts',
    route: '/api/wallets/credit',
    error: 'legacy_wallet_credit_disabled',
  },
  {
    file: 'app/api/wallets/debit/route.ts',
    route: '/api/wallets/debit',
    error: 'legacy_wallet_debit_disabled',
  },
  {
    file: 'app/api/wallet/topup/route.ts',
    route: '/api/wallet/topup',
    error: 'legacy_wallet_topup_disabled',
  },
];

describe('legacy privileged wallet mutation quarantine', () => {
  it.each(quarantinedRoutes)(
    '$route fails closed with HTTP 410',
    ({ file, route, error }) => {
      const source = readFileSync(file, 'utf8');

      expect(source).toContain(route);
      expect(source).toContain(error);
      expect(source).toContain('status: 410');
      expect(source).toContain("status: 'quarantined'");
      expect(source).toContain('legacy-money-mutation-quarantined');
      expect(source).toContain("'cache-control': 'no-store, max-age=0'");
    },
  );

  it.each(quarantinedRoutes)(
    '$route cannot execute a money mutation',
    ({ file }) => {
      const source = readFileSync(file, 'utf8');

      expect(source).not.toContain('addLedgerEntry');
      expect(source).not.toContain('ledgerEntry(');
      expect(source).not.toContain('topup(');
      expect(source).not.toContain('prisma.');
      expect(source).not.toContain('req.json');
      expect(source).not.toContain('request.json');
      expect(source).not.toContain('body.ownerId');
      expect(source).not.toContain('b?.ownerId');
      expect(source).not.toContain('ownerId =');
    },
  );

  it('preserves the authenticated transfer implementation', () => {
    const source = readFileSync(
      'app/api/wallets/transfer/route.ts',
      'utf8',
    );

    expect(source).toContain('requireUserSession');
    expect(source).toContain('return auth.response');
    expect(source).toContain('fromUserId: auth.identity.userId');
    expect(source).toContain('userPrivateNoStoreHeaders');
    expect(source).not.toContain('status: 410');
  });
});
