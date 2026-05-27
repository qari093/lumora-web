import { buildRuntimeMultiSource } from "./buildRuntimeMultiSource";
import { injectMultiSourceIntoFyp, buildMultiSourceDebug } from "@/src/lib/content/fyp/injectMultiSourceFyp";

export async function buildRuntimeFypFeed(existing: any[] = []) {
  const runtime = await buildRuntimeMultiSource();
  const items = injectMultiSourceIntoFyp(existing, runtime.accepted as any);

  return {
    ok: true,
    items,
    debug: {
      rawCount: runtime.rawCount,
      acceptedCount: runtime.acceptedCount,
      rejectedCount: runtime.rejectedCount,
      ...buildMultiSourceDebug(items),
    },
  };
}
