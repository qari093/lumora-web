import { ok } from "@/lib/zendoro/runtime";

export async function GET() {
  return ok({
    route: "seller",
    operational: true
  });
}
