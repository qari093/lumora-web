import { guardedJson } from "@/lib/api/guardedJson";
import { scanExplicitKeywords } from "@/lib/safety/keywords/blacklist";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text =
    searchParams.get("text") ||
    "official teaser trailer with cinematic visuals";

  const result = scanExplicitKeywords(text);

  return guardedJson("api.safety.keywords", {
    ok: true,
    result,
    ts: Date.now(),
  });
}
