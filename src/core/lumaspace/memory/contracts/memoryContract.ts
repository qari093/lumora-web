import type {
  MemoryFragment,
  MemoryFusion,
  MemoryRuntime
} from "../types";

export function validateMemoryFragment(
  fragment: MemoryFragment
): boolean {
  return Boolean(
    fragment.id &&
    fragment.atmosphere
  );
}

export function validateMemoryFusion(
  fusion: MemoryFusion
): boolean {
  return Boolean(
    fusion.id &&
    typeof fusion.merged === "boolean"
  );
}

export function validateMemoryRuntime(
  runtime: MemoryRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.vaultId
  );
}
