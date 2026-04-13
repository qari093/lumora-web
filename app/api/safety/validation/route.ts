import { guardedJson } from "@/lib/api/guardedJson";
import { validateZeroLeak } from "@/lib/safety/validation/zeroLeak";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await validateZeroLeak();

  return guardedJson("api.safety.validation", result);
}
