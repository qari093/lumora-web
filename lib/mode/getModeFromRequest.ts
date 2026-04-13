import { NextRequest } from "next/server";
import { resolveMode, LumoraMode } from "./mode";

export function getModeFromRequest(req: NextRequest): LumoraMode {
  const mode =
    req.headers.get("x-lumora-mode") ||
    req.cookies.get("lumora_mode")?.value ||
    "chill";

  return resolveMode(mode);
}
