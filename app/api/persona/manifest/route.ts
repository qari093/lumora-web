import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  try {
    const manifestPath = path.join(process.cwd(), "public", "persona", "manifest.json");
    const raw = await fs.readFile(manifestPath, "utf8");
    const json = JSON.parse(raw);

    return Response.json(json, {
      status: 200,
      headers: {
        "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "persona_manifest_unavailable";
    return Response.json(
      { ok: false, error: message },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
