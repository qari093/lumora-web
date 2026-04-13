import fs from "node:fs/promises";
import path from "node:path";

export type QuarantineReason =
  | "nsfw"
  | "explicit_audio"
  | "violence"
  | "keyword_blacklist"
  | "rating_block"
  | "manual_review";

export type QuarantineItem = {
  id: string;
  contentId: string;
  title?: string;
  source?: string;
  reason: QuarantineReason;
  status: "queued" | "released" | "removed";
  createdAt: number;
  updatedAt: number;
  meta?: Record<string, unknown>;
};

type QuarantineStore = {
  updatedAt: number;
  items: QuarantineItem[];
};

const OUT_DIR = path.join(process.cwd(), "data", "safety");
const OUT_FILE = path.join(OUT_DIR, "quarantine.queue.json");

async function ensureDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

export async function readQuarantineStore(): Promise<QuarantineStore> {
  await ensureDir();

  try {
    const raw = await fs.readFile(OUT_FILE, "utf8");
    const parsed = JSON.parse(raw) as QuarantineStore;
    return {
      updatedAt: typeof parsed?.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      items: Array.isArray(parsed?.items) ? parsed.items : [],
    };
  } catch {
    return {
      updatedAt: Date.now(),
      items: [],
    };
  }
}

async function writeQuarantineStore(store: QuarantineStore): Promise<QuarantineStore> {
  await ensureDir();
  const next: QuarantineStore = {
    updatedAt: Date.now(),
    items: Array.isArray(store.items) ? store.items : [],
  };
  await fs.writeFile(OUT_FILE, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export async function enqueueQuarantineItem(input: {
  contentId: string;
  title?: string;
  source?: string;
  reason: QuarantineReason;
  meta?: Record<string, unknown>;
}): Promise<QuarantineItem> {
  const store = await readQuarantineStore();

  const existing = store.items.find(
    (item) =>
      item.contentId === input.contentId &&
      item.reason === input.reason &&
      item.status === "queued"
  );

  if (existing) return existing;

  const now = Date.now();
  const item: QuarantineItem = {
    id: `quarantine_${now}_${Math.random().toString(36).slice(2, 8)}`,
    contentId: input.contentId,
    title: input.title,
    source: input.source,
    reason: input.reason,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    meta: input.meta,
  };

  store.items.unshift(item);
  await writeQuarantineStore(store);
  return item;
}

export async function updateQuarantineStatus(
  id: string,
  status: "released" | "removed"
): Promise<QuarantineItem | null> {
  const store = await readQuarantineStore();
  const idx = store.items.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const current = store.items[idx];
  const updated: QuarantineItem = {
    ...current,
    status,
    updatedAt: Date.now(),
  };

  store.items[idx] = updated;
  await writeQuarantineStore(store);
  return updated;
}
