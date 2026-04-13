import { headers } from "next/headers";

export async function getRequestClientKey(scope = "global"): Promise<string> {
  const h = await headers();
  const forwarded =
    h.get("x-forwarded-for") ||
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    "local";
  return `${scope}:${forwarded.split(",")[0].trim()}`;
}
