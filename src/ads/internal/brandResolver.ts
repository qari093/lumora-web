import { BRAND_REGISTRY } from "@/brands/registry";

export function resolveBrand(key: string) {
  return BRAND_REGISTRY[key] ?? null;
}
