import { withSafeLive } from "@/lib/live/withSafeLive";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";
import { makeRequestId } from "@/lib/live/requestId";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withSafeLive(async () => {
  const requestId = makeRequestId();
  return new Response(
    JSON.stringify({
      ok: false,
      error: { code: "ROUTE_DEPRECATED", message: "Use /api/live/rooms" },
      requestId,
      ts: new Date().toISOString(),
    }),
    {
      status: 410,
      headers: {
        "Content-Type": "application/json",
        "x-request-id": requestId,
        ...rateLimitHeaders(),
      },
    }
  );
});
