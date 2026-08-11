import { guardedJson } from '@/lib/api/guardedJson';
import { buildBaseContent } from '@/lib/content/schema';
import { attachLifecycle } from '@/lib/content/lifecycle';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = Date.now();
  const base = {
    ...buildBaseContent({ id: 'lifecycle_sample', title: 'Lifecycle' }),
    type: 'signal_card' as const,
    title: 'Lifecycle',
    createdAt: now,
    updatedAt: now,
  };
  const content = attachLifecycle(base, 'rise');
  return guardedJson('api.content.lifecycle', { ok: true, content, ts: Date.now() });
}
