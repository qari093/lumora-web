export type VideoStatus = "created" | "ready" | "errored";
export type VideoRecord = {
  id: string;                 // Cloudflare uid
  createdAt: number;
  updatedAt: number;
  status: VideoStatus;
  duration?: number | null;   // seconds
  meta?: any;
  flags?: { overDuration?: boolean };
  error?: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __STREAM_STORE: Map<string, VideoRecord> | undefined;
}
const STORE: Map<string, VideoRecord> = (globalThis.__STREAM_STORE ||= new Map());

export function upsertVideo(id: string, patch: Partial<VideoRecord>): VideoRecord {
  const now = Date.now();
  const cur = STORE.get(id) || { id, createdAt: now, updatedAt: now, status: "created" as VideoStatus };
  const next: VideoRecord = { ...cur, ...patch, updatedAt: now };
  STORE.set(id, next);
  return next;
}
export function getVideo(id: string): VideoRecord | undefined { return STORE.get(id); }
export function stats() {
  let created=0, ready=0, errored=0;
  for (const v of STORE.values()) { if (v.status==="ready") ready++; else if (v.status==="errored") errored++; else created++; }
  return { total: STORE.size, created, ready, errored };
}
