import { guardedJson } from "@/lib/api/guardedJson";
import {
  enqueueQuarantineItem,
  readQuarantineStore,
} from "@/lib/safety/quarantine/queue";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();

  if (mode === "seed") {
    const item = await enqueueQuarantineItem({
      contentId: "sample_flagged_asset",
      title: "Flagged Sample Asset",
      source: "step_064_seed",
      reason: "manual_review",
      meta: { seeded: true },
    });

    return guardedJson("api.safety.quarantine", {
      ok: true,
      mode: "seed",
      item,
      ts: Date.now(),
    });
  }

  const store = await readQuarantineStore();
  return guardedJson("api.safety.quarantine", {
    ok: true,
    mode: "read",
    count: store.items.length,
    updatedAt: store.updatedAt,
    items: store.items.slice(0, 100),
    ts: Date.now(),
  });
}
