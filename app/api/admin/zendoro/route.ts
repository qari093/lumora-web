import { getAdminZendoroSummary } from "@/src/core/zendoro/api/store";
import { okJson } from "@/src/core/zendoro/api/http";

export async function GET() {
  return okJson(getAdminZendoroSummary());
}
