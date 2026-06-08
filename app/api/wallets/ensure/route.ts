import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export async function POST() {
  return compatibilityJson("/api/wallets/ensure", "/api/zenwallet/runtime");
}
