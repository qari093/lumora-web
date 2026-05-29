export function createLumaIdentity() {
  return {
    id: "identity_001",
    aura: "soft-bloom"
  };
}

export {
  createFoundationRuntime,
  createIdentity
} from "@/core/lumaspace/compat/legacyContracts";
