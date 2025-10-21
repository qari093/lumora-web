import { NextRequest } from "next/server";

export function modKeyOk(req: NextRequest): { ok: boolean; who?: string } {
  const envKey = process.env.MOD_ADMIN_KEY || "dev"; // dev fallback
  const got = req.headers.get("x-mod-key") || "";
  if (!envKey) return { ok: false };
  return { ok: got === envKey, who: got === envKey ? "admin:"+envKey.slice(0,6) : undefined };
}
