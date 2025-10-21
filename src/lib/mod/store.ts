export type ReportKind = "content" | "user" | "ad";
export type ReportStatus = "open" | "approved" | "rejected" | "banned" | "unbanned";

export type Report = {
  id: string;
  kind: ReportKind;
  targetId: string;        // e.g., videoId, userId, creativeId
  reason: string;
  createdAt: number;
  status: ReportStatus;    // default "open"
  resolvedAt?: number | null;
  resolvedBy?: string | null;
  resolutionNote?: string | null;
  meta?: Record<string, any> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __MOD_STORE: Map<string, Report> | undefined;
}
const STORE: Map<string, Report> = (globalThis.__MOD_STORE ||= new Map());

function rid() { return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,10); }

export function createReport(kind: ReportKind, targetId: string, reason: string, meta?: any): Report {
  const r: Report = {
    id: rid(),
    kind, targetId, reason,
    createdAt: Date.now(),
    status: "open",
    meta: meta || null,
    resolvedAt: null,
    resolvedBy: null,
    resolutionNote: null,
  };
  STORE.set(r.id, r);
  return r;
}

export function listReports(status: ReportStatus[] = ["open"]): Report[] {
  const set = new Set(status);
  return Array.from(STORE.values()).filter(r => set.has(r.status))
    .sort((a,b)=>a.createdAt-b.createdAt);
}

export function resolveReport(id: string, status: Exclude<ReportStatus,"open">, actor: string, note?: string): Report | null {
  const r = STORE.get(id);
  if (!r) return null;
  r.status = status;
  r.resolvedAt = Date.now();
  r.resolvedBy = actor;
  r.resolutionNote = note || null;
  STORE.set(id, r);
  return r;
}
