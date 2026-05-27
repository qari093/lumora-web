export const dynamic = "force-dynamic";

export async function GET() {
  const checks = [
    "/api/live/google-trends",
    "/api/live/rss",
    "/api/live/reddit"
  ];

  return Response.json({
    ok: true,
    data: {
      endpoints: checks,
      validation: "manual-hit-required",
      rule: "all endpoints must return real payload > 0"
    },
    ts: Date.now()
  });
}
