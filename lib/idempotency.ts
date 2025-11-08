type Saved = { response: any; at: number };
const seen = new Map<string, Saved>();

export async function ensureIdempotency(opts: { ownerId: string; endpoint: string; key: string; save?: any }) {
  const id = `${opts.ownerId}:${opts.endpoint}:${opts.key}`;
  if (opts.save !== undefined) {
    seen.set(id, { response: opts.save, at: Date.now() });
    return null;
  }
  const hit = seen.get(id);
  return hit ? hit.response : null;
}
