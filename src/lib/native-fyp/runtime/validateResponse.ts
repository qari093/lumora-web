import type { NativeFypResponse } from "./apiShape";

export function validateResponse(res: NativeFypResponse): boolean {
  if (!res.ok) return false;
  if (res.source !== "native_fyp") return false;
  if (!Array.isArray(res.items)) return false;
  return true;
}
