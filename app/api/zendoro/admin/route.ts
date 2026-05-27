import { ok } from "@/lib/zendoro/runtime";

export async function GET() {
  return ok({
    route: "admin",
    operational: true
  });
}
