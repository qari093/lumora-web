import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export async function POST() {
  return compatibilityJson("/api/payments/webhook", "/api/zendoro/webhook");
}
