import { withSafeLive } from "@/lib/live/withSafeLive";
import { makeRequestId } from "@/lib/live/requestId";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withSafeLive(async () => {
  const requestId = makeRequestId();

  return new Response(
    JSON.stringify({
      ok: true,
      marker: "live-healthz",
      requestId,
      ts: Date.now(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...rateLimitHeaders(),
      },
    }
  );
});
