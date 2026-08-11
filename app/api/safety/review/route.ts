import { guardedJson } from '@/lib/api/guardedJson';
import { readSignalStore } from '@/lib/signals/store/fileStore';
import {
  listManualReviewItems,
  enqueueManualReview,
} from '@/src/lib/safety/review/manualReviewQueue';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get('mode') || 'list').trim();

  if (mode === 'seed') {
    const snapshot = await readSignalStore();
    const first = snapshot.signals[0];
    if (!first) {
      return guardedJson('api.safety.review', {
        ok: true,
        mode: 'seed',
        seeded: false,
        reason: 'no_signals_available',
        ts: Date.now(),
      });
    }

    const item = await enqueueManualReview(first, 'manual_escalation', {
      source: 'step_028_seed',
    });

    return guardedJson('api.safety.review', {
      ok: true,
      mode: 'seed',
      seeded: true,
      item,
      ts: Date.now(),
    });
  }

  const store = await listManualReviewItems();
  return guardedJson('api.safety.review', {
    ok: true,
    mode: 'list',
    count: store.items.length,
    updatedAt: store.updatedAt,
    items: store.items,
    ts: Date.now(),
  });
}
