import fs from 'node:fs/promises';
import path from 'node:path';
import { readQuarantineStore } from '@/lib/safety/quarantine/queue';
import { readManualReviewItems } from '@/src/lib/safety/review/manualReviewQueue';

export type ModerationAlert = {
  id: string;
  level: 'info' | 'warning' | 'critical';
  type:
    | 'quarantine_backlog'
    | 'manual_review_backlog'
    | 'critical_flagged_content'
    | 'system_health';
  message: string;
  createdAt: number;
  meta?: Record<string, unknown>;
};

export type ModerationAlertStore = {
  updatedAt: number;
  alerts: ModerationAlert[];
};

const OUT_DIR = path.join(process.cwd(), 'data', 'safety');
const OUT_FILE = path.join(OUT_DIR, 'moderation.alerts.json');

async function ensureDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

export async function readModerationAlertStore(): Promise<ModerationAlertStore> {
  await ensureDir();

  try {
    const raw = await fs.readFile(OUT_FILE, 'utf8');
    const parsed = JSON.parse(raw) as ModerationAlertStore;
    return {
      updatedAt: typeof parsed?.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
      alerts: Array.isArray(parsed?.alerts) ? parsed.alerts : [],
    };
  } catch {
    return {
      updatedAt: Date.now(),
      alerts: [],
    };
  }
}

async function writeModerationAlertStore(
  store: ModerationAlertStore,
): Promise<ModerationAlertStore> {
  await ensureDir();
  const next: ModerationAlertStore = {
    updatedAt: Date.now(),
    alerts: Array.isArray(store.alerts) ? store.alerts : [],
  };
  await fs.writeFile(OUT_FILE, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function makeAlert(
  level: ModerationAlert['level'],
  type: ModerationAlert['type'],
  message: string,
  meta?: Record<string, unknown>,
): ModerationAlert {
  const now = Date.now();
  return {
    id: `alert_${now}_${Math.random().toString(36).slice(2, 8)}`,
    level,
    type,
    message,
    createdAt: now,
    meta,
  };
}

export async function refreshModerationAlerts(): Promise<ModerationAlertStore> {
  const quarantine = await readQuarantineStore();
  const reviews = await readManualReviewItems();

  const queued = quarantine.items.filter((i) => i.status === 'queued').length;
  const pending = reviews.items.filter((i) => i.status === 'pending').length;

  const alerts: ModerationAlert[] = [];

  if (queued >= 10) {
    alerts.push(
      makeAlert('critical', 'quarantine_backlog', 'Quarantine backlog is high', {
        queued,
      }),
    );
  } else if (queued >= 3) {
    alerts.push(
      makeAlert('warning', 'quarantine_backlog', 'Quarantine backlog needs review', {
        queued,
      }),
    );
  }

  if (pending >= 10) {
    alerts.push(
      makeAlert('critical', 'manual_review_backlog', 'Manual review backlog is high', {
        pending,
      }),
    );
  } else if (pending >= 3) {
    alerts.push(
      makeAlert('warning', 'manual_review_backlog', 'Manual review queue growing', {
        pending,
      }),
    );
  }

  const criticalReasons = quarantine.items.filter(
    (i) => i.reason === 'nsfw' || i.reason === 'violence' || i.reason === 'explicit_audio',
  ).length;

  if (criticalReasons > 0) {
    alerts.push(
      makeAlert(
        'warning',
        'critical_flagged_content',
        'Critical flagged content exists in quarantine',
        {
          criticalReasons,
        },
      ),
    );
  }

  if (alerts.length === 0) {
    alerts.push(
      makeAlert('info', 'system_health', 'Moderation system healthy', {
        queued,
        pending,
      }),
    );
  }

  return writeModerationAlertStore({ updatedAt: Date.now(), alerts });
}
