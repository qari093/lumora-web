import crypto from "crypto";

export function makeRequestId(): string {
  // stable format: rid_<16hex>
  return "rid_" + crypto.randomBytes(8).toString("hex");
}

export function applyLiveStandardHeaders(res: Response, requestId: string) {
  try {
    (res.headers as any).set?.("x-request-id", requestId);
    (res.headers as any).set?.("cache-control", "no-store");
    (res.headers as any).set?.("content-type", "application/json; charset=utf-8");
    (res.headers as any).set?.("x-ratelimit-limit", "60");
    (res.headers as any).set?.("x-ratelimit-remaining", "59");
    (res.headers as any).set?.("x-ratelimit-reset", String(Math.floor(Date.now() / 1000) + 60));
  } catch {}
}
