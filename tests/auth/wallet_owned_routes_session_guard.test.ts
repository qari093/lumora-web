import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const protectedImplementations = [
  'app/api/wallet/route.ts',
  'app/api/wallet/balance/route.ts',
  'app/api/wallet/history/route.ts',
  'app/api/wallet/summary/route.ts',
  'app/api/wallet/debit/route.ts',
  'app/api/wallets/[ownerId]/route.ts',
  'app/api/wallets/[ownerId]/balance/route.ts',
  'app/api/wallets/route.ts',
  'app/api/wallets/transfer/route.ts',
];

describe('wallet ownership and IDOR protection', () => {
  it.each(protectedImplementations)('%s requires the canonical verified user session', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toContain('requireUserSession');
    expect(source).toContain('auth.response');
    expect(source).toContain('userPrivateNoStoreHeaders');
  });

  it.each(protectedImplementations)(
    '%s does not trust caller-controlled source identity',
    (file) => {
      const source = readFileSync(file, 'utf8');

      expect(source).not.toContain('body.ownerId');
      expect(source).not.toContain('body.userId');
      expect(source).not.toContain('fromOwnerId');
      expect(source).not.toContain('x-user-id');
      expect(source).not.toContain('searchParams.get("ownerId")');
      expect(source).not.toContain("searchParams.get('ownerId')");
      expect(source).not.toContain('searchParams.get("userId")');
      expect(source).not.toContain("searchParams.get('userId')");
    },
  );

  it('binds wallet debit compatibility access to the verified session user', () => {
    const source = readFileSync('app/api/wallet/debit/route.ts', 'utf8');

    expect(source).toContain('requireUserSession');
    expect(source).toContain('const userId = auth.identity.userId');
    expect(source).toContain('compatibilityJson("/api/wallet/debit", "/api/zenwallet/runtime")');
    expect(source).toContain('userPrivateNoStoreHeaders');
    expect(source).not.toContain('ensureIdempotency');
    expect(source).not.toContain('addLedgerEntry');
    expect(source).not.toContain('getWallet');
  });

  it('binds transfer source identity to the verified session user', () => {
    const source = readFileSync('app/api/wallets/transfer/route.ts', 'utf8');

    expect(source).toContain('fromUserId: auth.identity.userId');
    expect(source).toContain('toUserId: toOwnerId');
    expect(source).toContain('self_transfer_not_allowed');
  });

  it('rejects path-owner access that does not match the session user', () => {
    for (const file of [
      'app/api/wallets/[ownerId]/route.ts',
      'app/api/wallets/[ownerId]/balance/route.ts',
    ]) {
      const source = readFileSync(file, 'utf8');

      expect(source).toContain('requestedOwnerId !== auth.identity.userId');
      expect(source).toContain('wallet_ownership_required');
      expect(source).toContain('ownerId: auth.identity.userId');
    }
  });

  it('preserves the withdraw alias over the protected debit handler', () => {
    const source = readFileSync('app/api/wallet/withdraw/route.ts', 'utf8');

    expect(source).toContain("export { POST } from '../debit/route'");
  });

  it('removes the static wallet summary balance contract', () => {
    const source = readFileSync('app/api/wallet/summary/route.ts', 'utf8');

    expect(source).toContain('prisma.wallet.findFirst');
    expect(source).toContain('ownerId: auth.identity.userId');
    expect(source).not.toContain('balance: 1250');
  });

  it('uses the object-based wallet transfer library contract', () => {
    const source = readFileSync('app/api/wallets/transfer/route.ts', 'utf8');

    expect(source).toContain('transferEuros({');
    expect(source).not.toContain('transferEuros(fromOwnerId, toOwnerId, cents');
  });
});
