import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return compatibilityJson(
    "/api/live/room",
    "/api/live/rooms",
  );
}
