import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export async function POST() {
  return compatibilityJson("/api/wallet/ledger", "/api/zenwallet/ledger");
}
