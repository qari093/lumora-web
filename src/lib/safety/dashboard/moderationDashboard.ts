import { readQuarantineStore } from '@/lib/safety/quarantine/queue';
import { readManualReviewItems } from '@/src/lib/safety/review/manualReviewQueue';

export type ModerationDashboardSnapshot = {
  ok: boolean;
  updatedAt: number;
  quarantine: {
    total: number;
    queued: number;
    released: number;
    removed: number;
  };
  manualReview: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  summary: {
    totalOpenItems: number;
  };
};

export async function getModerationDashboard(): Promise<ModerationDashboardSnapshot> {
  const quarantineStore = await readQuarantineStore();
  const reviewStore = await readManualReviewItems();

  const quarantineItems = Array.isArray(quarantineStore.items) ? quarantineStore.items : [];
  const reviewItems = Array.isArray(reviewStore.items) ? reviewStore.items : [];

  const queued = quarantineItems.filter((i) => i.status === 'queued').length;
  const released = quarantineItems.filter((i) => i.status === 'released').length;
  const removed = quarantineItems.filter((i) => i.status === 'removed').length;

  const pending = reviewItems.filter((i) => i.status === 'pending').length;
  const approved = reviewItems.filter((i) => i.status === 'approved').length;
  const rejected = reviewItems.filter((i) => i.status === 'rejected').length;

  return {
    ok: true,
    updatedAt: Date.now(),
    quarantine: {
      total: quarantineItems.length,
      queued,
      released,
      removed,
    },
    manualReview: {
      total: reviewItems.length,
      pending,
      approved,
      rejected,
    },
    summary: {
      totalOpenItems: queued + pending,
    },
  };
}
