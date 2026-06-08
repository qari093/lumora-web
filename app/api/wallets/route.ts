import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";

export async function GET() {
  return compatibilityJson("/api/wallets", "/api/zenwallet/runtime");
}
export async function POST() {
  return compatibilityJson("/api/wallets", "/api/zenwallet/runtime");
}
