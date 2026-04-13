import { captureReplaySignal } from "@/lib/profile/replay/capture";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      ok: true,
      data: captureReplaySignal({
        contentId: "content_sample_001",
        replayCount: 3,
      }),
      ts: Date.now(),
    },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
