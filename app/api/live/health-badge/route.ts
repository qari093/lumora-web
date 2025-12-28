import { withSafeLive } from "@/lib/live/withSafeLive";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withSafeLive(async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      marker: "live-health-badge",
      status: "ok",
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
