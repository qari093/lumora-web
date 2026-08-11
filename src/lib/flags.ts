import { cookies } from 'next/headers';
export type Flags = { paywall?: 'on' | 'off'; experiment?: 'A' | 'B' };
export async function getFlags(): Promise<Flags> {
  const jar = await cookies();
  const raw = jar.get('lumora_flags')?.value || '';
  let out: Flags = {};
  try {
    out = raw ? JSON.parse(raw) : {};
  } catch {}
  if (!out.experiment) {
    out.experiment = Math.random() < 0.5 ? 'A' : 'B';
  }
  jar.set({
    name: 'lumora_flags',
    value: JSON.stringify(out),
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return out;
}
