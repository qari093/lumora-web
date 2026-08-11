import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const protectedRoutes = [
  'app/api/private-access/route.ts',
  'app/api/notify/inbox/route.ts',
  'app/api/notify/subscribe/route.ts',
  'app/api/notify/check-low-balance/route.ts',
  'app/api/notify/emit/route.ts',
  'app/api/orders/route.ts',
];

describe('canonical user-owned route protection', () => {
  it.each(protectedRoutes)('%s requires the canonical verified user session', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toContain('requireUserSession');
    expect(source).toContain('return auth.response');
    expect(source).toContain('userPrivateNoStoreHeaders');
  });

  it.each(protectedRoutes)('%s removes spoofable caller identity', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).not.toContain('x-user-id');
    expect(source).not.toContain('body.ownerId');
    expect(source).not.toContain('body.userId');
    expect(source).not.toContain('searchParams.get("ownerId")');
    expect(source).not.toContain("searchParams.get('ownerId')");
    expect(source).not.toContain('searchParams.get("userId")');
    expect(source).not.toContain("searchParams.get('userId')");
  });

  it('binds order reads to the verified session identity', () => {
    const source = readFileSync('app/api/orders/route.ts', 'utf8');

    expect(source).toContain('listOrders(auth.identity.userId)');
  });

  it('keeps public review reads while protecting review creation', () => {
    const source = readFileSync('app/api/reviews/route.ts', 'utf8');

    expect(source).toContain('export async function GET');
    expect(source).toContain('export async function POST');
    expect(source).toContain('requireUserSession');
    expect(source).toContain('userId: auth.identity.userId');
    expect(source).not.toContain('body.userId');
  });

  it('revalidates canonical user identity against the database', () => {
    const source = readFileSync('src/lib/auth/requireUserSession.ts', 'utf8');

    expect(source).toContain('getServerSession(authOptions)');
    expect(source).toContain('prisma.user.findUnique');
    expect(source).toContain('emailVerified');
    expect(source).toContain('authentication_required');
    expect(source).toContain('verified_account_required');
  });
});
