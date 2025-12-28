import { makeRequestId } from "@/lib/live/requestId";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";

type Handler = (req: Request) => Promise<Response> | Response;

/**
 * MUST be a sync factory that returns an async function (Next route handler).
 * Ensures every code path returns a Response and always emits x-request-id.
 */
export function withSafeLive(handler: Handler) {
  return async function wrapped(req: Request): Promise<Response> {
    const requestId = makeRequestId();
    try {
      const res = await handler(req);
      // Force Response shape
      const out = res instanceof Response ? res : new Response(String(res), { status: 200 });

      // Copy headers and enforce required headers
      const headers = new Headers(out.headers);
      headers.set("x-request-id", headers.get("x-request-id") || requestId);

      // Ensure ratelimit headers exist (some routes rely on them)
      const rl = rateLimitHeaders();
      if (!headers.get("x-ratelimit-limit")) headers.set("x-ratelimit-limit", rl["x-ratelimit-limit"]);
      if (!headers.get("x-ratelimit-remaining")) headers.set("x-ratelimit-remaining", rl["x-ratelimit-remaining"]);
      if (!headers.get("x-ratelimit-reset")) headers.set("x-ratelimit-reset", rl["x-ratelimit-reset"]);

      return new Response(out.body, { status: out.status, statusText: out.statusText, headers });
    } catch (e: any) {
      const headers = new Headers({
        "Content-Type": "application/json",
        "x-request-id": requestId,
        ...rateLimitHeaders(),
      });
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: "LIVE_HANDLER_ERROR", message: String(e?.message || e || "unknown") },
          requestId,
          ts: Date.now(),
        }),
        { status: 500, headers }
      );
    }
  };
}
