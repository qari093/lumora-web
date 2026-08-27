import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return compatibilityJson(
    "/api/fyp94/health",
    "/api/fyp/health",
  );
}
