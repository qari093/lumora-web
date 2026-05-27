import { SOURCE_REGISTRY } from "./registry";

export function validateRegistry() {
  if (SOURCE_REGISTRY.length < 40) {
    throw new Error("Source registry incomplete");
  }

  for (const s of SOURCE_REGISTRY) {
    if (!s.commercialUse) {
      throw new Error(`Invalid source: ${s.name}`);
    }
  }

  return true;
}
