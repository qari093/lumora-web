import type { NativeFypStorageAdapter } from "../storage/types";

export async function checkNativeFypStorageHealth(adapter: NativeFypStorageAdapter) {
  const result = await adapter.healthCheck();

  return {
    ok: result.ok,
    provider: result.provider,
    checkedAt: new Date().toISOString(),
  };
}
