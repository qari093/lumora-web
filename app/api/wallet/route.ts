import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export async function GET() {
  return compatibilityJson("/api/wallet", "/api/zenwallet/runtime");
}
