import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const protectedRoutes = [
  'app/api/seller/route.ts',
  'app/api/seller/orders/route.ts',
  'app/api/seller/products/route.ts',
];

describe('canonical seller-owned route protection', () => {
  it.each(protectedRoutes)('%s requires the canonical verified session', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toContain('requireUserSession');
    expect(source).toContain('return auth.response');
    expect(source).toContain('userPrivateNoStoreHeaders');
  });

  it.each(protectedRoutes)('%s does not trust caller-supplied seller ownership', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).not.toContain('searchParams.get("sellerId")');
    expect(source).not.toContain("searchParams.get('sellerId')");
    expect(source).not.toContain('body.sellerId');
    expect(source).not.toContain('"zendoro-demo-seller"');
    expect(source).not.toContain("'zendoro-demo-seller'");
  });

  it.each(protectedRoutes)('%s resolves the seller through the verified user', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toContain('prisma.zendoroSeller.findFirst');
    expect(source).toContain('ownerId: auth.identity.userId');
  });

  it('limits seller summary to the authenticated seller record', () => {
    const source = readFileSync('app/api/seller/route.ts', 'utf8');

    expect(source).toContain('getSellerSummary(seller.id)');
  });

  it('limits order reads to the authenticated seller record', () => {
    const source = readFileSync('app/api/seller/orders/route.ts', 'utf8');

    expect(source).toContain('order.sellerId === seller.id');
  });

  it('binds product reads and writes to the authenticated seller', () => {
    const source = readFileSync('app/api/seller/products/route.ts', 'utf8');

    expect(source).toContain('product.sellerId === seller.id');
    expect(source).toContain('sellerId: seller.id');
    expect(source).not.toContain('sellerId?: string');
  });
});
