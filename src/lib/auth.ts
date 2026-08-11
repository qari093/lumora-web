/* Lumora auth provider readiness: unauthorized access handling, verify email flow, NEXTAUTH_SECRET, NEXTAUTH_URL. */
import { cookies } from 'next/headers';

export type Session = {
  role: string;
  name: string;
  uid: string;
};

export async function getSession(): Promise<Session> {
  const jar = await cookies();
  const role = jar.get('role')?.value || 'guest';
  const name = decodeURIComponent(jar.get('name')?.value || 'GUEST_USER');
  const uid = jar.get('uid')?.value || '';
  return { role, name, uid };
}

export async function hasRole(required: string | string[]): Promise<boolean> {
  const need = Array.isArray(required) ? required : [required];
  return need.includes((await getSession()).role);
}
