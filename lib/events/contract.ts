export type ContentType = "ugc" | "trailer";
export type EventType = "ingest.requested" | "ingest.completed" | "ingest.failed";

export type EventStreamInput = Readonly<{
  type: EventType;
  contentType: ContentType;
  contentId: string;
  actorId?: string;
  ts?: number;
  payload?: Record<string, unknown>;
}>;

export type ValidationIssue = Readonly<{ path: string; message: string }>;
export type ParseOk<T> = Readonly<{ ok: true; data: T }>;
export type ParseErr = Readonly<{ ok: false; error: string; issues: readonly ValidationIssue[] }>;
export type ParseResult<T> = ParseOk<T> | ParseErr;

export const EVENT_STREAM_POLICY = Object.freeze({
  allowedContentTypes: ["ugc", "trailer"] as const,
  // storage contract: signed URLs only, no public buckets
  signedUrlMaxTtlSec: 3600,
});

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function nonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function parseEventStreamInput(input: unknown): ParseResult<EventStreamInput> {
  const issues: ValidationIssue[] = [];
  if (!isPlainObject(input)) {
    return { ok: false, error: "invalid_object", issues: [{ path: "$", message: "expected_object" }] };
  }

  const type = input["type"];
  const contentType = input["contentType"];
  const contentId = input["contentId"];
  const actorId = input["actorId"];
  const ts = input["ts"];
  const payload = input["payload"];

  const allowedTypes: readonly string[] = ["ingest.requested", "ingest.completed", "ingest.failed"];
  if (!nonEmptyString(type) || !allowedTypes.includes(type)) issues.push({ path: "type", message: "invalid_type" });

  const allowedCT: readonly string[] = EVENT_STREAM_POLICY.allowedContentTypes as unknown as readonly string[];
  if (!nonEmptyString(contentType) || !allowedCT.includes(contentType)) issues.push({ path: "contentType", message: "invalid_contentType" });

  if (!nonEmptyString(contentId)) issues.push({ path: "contentId", message: "contentId_required" });

  if (actorId !== undefined && !nonEmptyString(actorId)) issues.push({ path: "actorId", message: "actorId_must_be_string" });

  if (ts !== undefined && (typeof ts !== "number" || !Number.isFinite(ts) || ts <= 0)) issues.push({ path: "ts", message: "ts_must_be_positive_number" });

  if (payload !== undefined && !isPlainObject(payload)) issues.push({ path: "payload", message: "payload_must_be_object" });

  if (issues.length) return { ok: false, error: "validation_failed", issues };

  return {
    ok: true,
    data: {
      type: type as EventType,
      contentType: contentType as ContentType,
      contentId: (contentId as string).trim(),
      actorId: actorId === undefined ? undefined : (actorId as string).trim(),
      ts: ts === undefined ? undefined : (ts as number),
      payload: payload as any,
    },
  };
}

export type Hook = Readonly<{ name: string; url: string; method: "POST" | "PUT" }>;

export function computeHooks(
  input: Readonly<{ baseUrl: string; contentType: ContentType; contentId: string }>,
  opts?: Readonly<{ routePrefix?: string }>
): readonly Hook[] {
  const baseUrl = input.baseUrl.replace(/\/+$/, "");
  const prefix = (opts?.routePrefix ?? "/api/events/hooks").replace(/\/+$/, "");
  const id = encodeURIComponent(input.contentId);
  const ct = encodeURIComponent(input.contentType);

  return [
    { name: "ingest", url: `${baseUrl}${prefix}/${ct}/${id}/ingest`, method: "POST" },
    { name: "audit", url: `${baseUrl}${prefix}/${ct}/${id}/audit`, method: "POST" },
  ] as const;
}
