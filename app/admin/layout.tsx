import type { ReactNode } from 'react';

import { requireAdminPageSession } from '@/src/lib/auth/requireAdminPageSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const identity = await requireAdminPageSession('/admin');

  return (
    <div
      data-admin-session-protected="true"
      data-admin-user-id={identity.userId}
      data-admin-role={identity.role}
    >
      {children}
    </div>
  );
}
