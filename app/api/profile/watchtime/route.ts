import { captureWatchTime } from "@/lib/profile/watchtime/capture";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      ok: true,
      data: captureWatchTime({
        contentId: "content_sample_001",
        watchedMs: 18200,
        totalMs: 20000,
      }),
      ts: Date.now(),
    },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
