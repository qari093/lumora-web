import type { LumoraMode } from "./mode";

export async function persistMode(mode: LumoraMode): Promise<boolean> {
  try {
    const res = await fetch("/api/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });

    return res.ok;
  } catch {
    return false;
  }
}
