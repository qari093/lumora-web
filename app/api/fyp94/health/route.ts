import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export async function GET() {
  return compatibilityJson("/api/fyp94/health", "/api/fyp/health");
}
