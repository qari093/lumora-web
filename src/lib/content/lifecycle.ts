import type { LumoraContent } from "@/types/content/lumora.content";

export function attachLifecycle(content: LumoraContent, state?: "rise" | "peak" | "decay") {
  return { ...content, metadata: { ...content.metadata, lifecycle: state || "rise" }, updatedAt: Date.now() };
}
