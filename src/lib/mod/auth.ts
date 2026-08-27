import { NextRequest } from "next/server";

export function modKeyOk(req: NextRequest): { ok: boolean; who?: string } {
  const envKey = process.env.MOD_ADMIN_KEY?.trim() || "";

  // Production-safe default: a missing moderation credential never opens access.
  if (!envKey) {
    return { ok: false };
  }

  const provided = req.headers.get("x-mod-key")?.trim() || "";

  if (!provided || provided !== envKey) {
    return { ok: false };
  }

  return {
    ok: true,
    who: "admin:mod-key",
  };
}
