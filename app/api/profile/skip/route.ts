import { captureSkipSignal } from "@/lib/profile/skip/capture";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      ok: true,
      data: captureSkipSignal({
        contentId: "content_sample_002",
        watchedMs: 1800,
        totalMs: 15000,
      }),
      ts: Date.now(),
    },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
