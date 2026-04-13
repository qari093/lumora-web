import { guardedJson } from "@/lib/api/guardedJson";
import { buildKineticFrames } from "@/lib/format/kinetic/generator";

export const dynamic = "force-dynamic";

export async function GET() {
  const frames = buildKineticFrames(
    "Lumora catches the signal early. The crowd arrives before the flood."
  );

  return guardedJson("api.format.kinetic", {
    ok: true,
    count: frames.length,
    frames,
    ts: Date.now(),
  });
}
