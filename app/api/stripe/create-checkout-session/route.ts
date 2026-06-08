import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export async function POST() {
  return compatibilityJson("/api/stripe/create-checkout-session", "/api/zendoro/checkout");
}
