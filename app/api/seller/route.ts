import { getSellerSummary } from "@/src/core/zendoro/api/store";
import { okJson } from "@/src/core/zendoro/api/http";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return okJson(getSellerSummary(url.searchParams.get("sellerId") ?? "zendoro-demo-seller"));
}
