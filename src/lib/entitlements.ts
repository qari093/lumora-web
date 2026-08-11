import { cookies } from 'next/headers';

export async function getEntitlements() {
  try {
    const jar = await cookies();
    return JSON.parse(jar.get('lumora_entitlements')?.value || '{}');
  } catch {
    return {};
  }
}

export async function setPro(val: boolean): Promise<void> {
  const jar = await cookies();
  jar.set({
    name: 'lumora_entitlements',
    value: JSON.stringify({ pro: !!val }),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}
