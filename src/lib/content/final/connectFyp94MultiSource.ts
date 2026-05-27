import { buildRuntimeFypFeed } from "@/src/lib/content/runtime/buildRuntimeFypFeed";

export async function connectFyp94MultiSource(existing: any[]) {
  const runtime = await buildRuntimeFypFeed(existing);

  return {
    items: runtime.items,
    debug: runtime.debug,
  };
}
