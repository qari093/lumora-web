import { guardedJson } from "@/lib/api/guardedJson";
import { probeDeviceNSFWHooks } from "@/lib/safety/device/nsfwHooks";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const userAgent = req.headers.get("user-agent") || "";
  const probe = probeDeviceNSFWHooks(userAgent);

  return guardedJson("api.safety.device-nsfw", {
    ok: true,
    supported: probe.supported,
    reason: probe.reason,
    config: probe.config,
    ts: Date.now(),
  });
}
