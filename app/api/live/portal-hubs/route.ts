import { withSafeLive } from "@/lib/live/withSafeLive";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";
import { makeRequestId } from "@/lib/live/requestId";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withSafeLive(async () => {
  const requestId = makeRequestId();

  const hubs = [
    { id: "live", title: "Live", href: "/live", slug: "live", live: true, order: 1 },
    { id: "gmar", title: "GMAR", href: "/gmar", slug: "gmar", live: false, order: 2 },
    { id: "videos", title: "Videos", href: "/videos", slug: "videos", live: false, order: 3 },
    { id: "nexa", title: "NEXA", href: "/nexa", slug: "nexa", live: false, order: 4 },
    { id: "movies", title: "Movies", href: "/movies", slug: "movies", live: false, order: 5 },
  ];

  return new Response(
    JSON.stringify({
      ok: true,
      marker: "live-portal-hubs",
      requestId,
      hubs,
      count: hubs.length,
      ts: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "x-request-id": requestId,
        ...rateLimitHeaders(),
      },
    }
  );
});
