import { guardedJson } from "@/lib/api/guardedJson";
import { linkContent } from "@/lib/content/graph/relations";

export const dynamic = "force-dynamic";

export async function GET() {
  return guardedJson("api.content.graph", {
    ok: true,
    edge: linkContent("a","b"),
    ts: Date.now()
  });
}
